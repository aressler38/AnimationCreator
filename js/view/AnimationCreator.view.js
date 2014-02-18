// AnimationCreatorView
// Description: Defines the class for the main view. 

define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "CanvasView",
        "CanvasModel",
        "Tools",
        "Tool",
        "Overdub",
        "renderTemplate",
        "hbs!templates/main",
        "ModalView",
        "AnimatedObjectView",
        "AnimatedObjectModel",
        "addInitialTools"
    ],
    function($, _, Backbone, CanvasView, CanvasModel, Tools,
                Tool, Overdub, renderTemplate, mainTemplate, ModalView,
                AnimatedObjectView, AnimatedObjectModel, addInitialTools) 
    {
        "use strict";

        var vendors = ["-webkit-", "-moz-", ""];


        /**
         * @constructor
         * Creates the main view for which other tools attach and communicate through.
         * @return Backbone.View
        */
        var AnimationCreatorView = Backbone.View.extend({

            className   : "animation-creator-main",
            tagName     : "div",
            workerURI   : "js/utils/worker.js",

            initialize: function() {
                var that = this;
                var mainTemplateConfig = this.model.get("mainTemplateConfig");

                this.SubProcess = new Worker(this.workerURI);
                this.el.setAttribute("id", (this.model.get("id") || "animation-creator-view"));
                this.mainAxesConfig = {
                    target: mainTemplateConfig.mainAxes,
                    width: 800,
                    height: 600
                };
                // preRender
                this.mainAxes = Tool("MainAxes", this.mainAxesConfig);
                this.tools = new Tools({model:this.model});
                //render
                this.render();
                // postRender
                addInitialTools.call(this);
                this.overdub = new Overdub(this);
            },
            
            // TODO: deprecate this method. 
            setAnimationName: function(event, text) {
                this.model.set("animationName", text);
            },
            
            events: function() {
                var that = this;
                // SubProcess events
                function parseSubProcessResponse(workerResponse) {
                    switch (workerResponse.data.type) {
                        case "generateCSS":
                            that.processCSS(workerResponse.data.data);
                            break;
                        case "error":
                            console.log("the worker returned an error");
                            console.log(workerResponse);
                            break;
                        default:
                            throw new Error("no handled response type");
                    }
                }
                this.SubProcess.addEventListener("message", parseSubProcessResponse);

                // tool model events 
                this.mainAxes.model.on("change:transformations", function() {
                    // we need to think about what happens when the app is in overdub mode
                    var transformations = arguments[0];
                    that.activeAnimatedObjects.forEach(function(view, index, views) {
                        view.model.set("transformations", transformations);
                    });
                    /*that.model.set("transformations", arguments[0]);*/
                });
                
                // animatedObjectModels collection events
                this.listenTo(this.model.get("animatedObjectModels"), "add", this.renderAnimatedObjectModel);

                // View Events 
                // lots of events are handled by individual tool objects created in addInitialTools.
                var events = new Object();
                return events;
            },

            render: function() {
                var mainTemplateConfig = this.model.get("mainTemplateConfig");
                var template = renderTemplate(mainTemplate, mainTemplateConfig);
                this.$el.html(template);
                this.model.get("target").html(this.el);

                // render mainAxes and Tools...
                document.getElementById(mainTemplateConfig.mainAxes).appendChild(this.mainAxes.render());
                document.getElementById(mainTemplateConfig.tools).appendChild(this.tools.render());

                this.$el.find(".animation-creator-main-axes").css({
                    width: this.mainAxesConfig.width + 2,
                    height: this.mainAxesConfig.height + 2
                });
                
                // get contexts of other app specific dom elements
                this.loadIcon           = document.getElementById(mainTemplateConfig.loadIcon);
                this.styleSheet         = document.getElementById(mainTemplateConfig.styleSheet);
                this.styleSheetHelper   = document.getElementById(mainTemplateConfig.styleSheetHelper);

                return null;
            },

            // TODO: fix me
            // task for SubProcess
            // Get all the transformations from the animatedObjects (not necessarialy active), 
            // and process the transformations into CSS.  
            generateCSS: function(clear) {
                var transformations = new Array(), 
                    workerInterface = new Object();

                this.model.get("animatedObjectModels").forEach(function(model, index, models) {
                    transformations.push(model.get("transformations"));
                });
                console.log(transformations);
                console.log(workerInterface);
                
                workerInterface["message"]      = "generateCSS";
                workerInterface["workerData"]   = {
                        animationName: this.model.get("animationName"),
                        transformations: (!clear) ? transformations : []
                }
                this.spinerIcon.on.call(this);
                this.SubProcess.postMessage(workerInterface);
                return null;
            },

            // callback for SubProcess
            processCSS: function(data) {
                this.styleSheet.innerHTML = data[0];
                this.styleSheetHelper.innerHTML = data[1];
                this.spinerIcon.off.call(this);
                return null;
            },

            // show a modal
            printCSS: function() {
                throw new Error("broken... you gotta recalculate the css");
                var modal = new ModalView({
                    body: this.styleSheet.innerHTML,
                    header: "this is your CSS"
                });
                return null;
            },

            // given a percentage, return the matrix3d css arguments
            // this is slow...
            getMatrix: function(cssPercentage) {
                var regex=RegExp(cssPercentage+"%.*{\n.*matrix3d\\((.*)\\);")
                // regex must match
                var stringMatch = this.styleSheet.innerHTML.match(regex)[1];
                var arrayMatch = stringMatch.split(","); 
                var numericalArray = arrayMatch.map(function(x){return parseInt(x);});
                return numericalArray;
            },

            // mode can be overdub, neutral, play, stop
            mode: "neutral",

            getMaxAnimatedObjectTransformationTimeDelta: function() {
                var animatedObjectViews = this.model.get("animatedObjectViews");
                var maxDelta = 0;
                var newDelta = null;
                animatedObjectViews.forEach(function(view, index, views) {
                    newDelta = view.getDeltaTransformationTime(); 
                    if (newDelta > maxDelta) {
                        maxDelta = newDelta;    
                    } 
                    return null;
                });
                return maxDelta;
            },

            play: function(percentage) {
                var animatedObjectViews = this.model.get("animatedObjectViews");
                var transformations     = this.model.get("transformations");
                var viewIndex   = 0;
                var tStart      = window.performance.now();
                var tInitial    = Number.MAX_VALUE;
                var tFinal      = transformations[transformations.length-1].time;
                var tDelta      = this.getMaxAnimatedObjectTransformationTimeDelta();
                var dt          = tFinal - tInitial;
                var lookAhead   = 32;
                var that        = this;

                
                this.mode = "play";
                // get first tInitial (find min value of transformations[0])

                /** @callback - requestAnimationFrame step */
                function renderLoop(timestamp) {
                    if (this.mode !== "play" ) return null;
                    animatedObjectViews.forEach(function(view, index, views) {
                        //view.apply3DMatrix(transformations[tCounter++ % tLen].matrix);
                        view.applyNextMatrix();
                    });
                    window.requestAnimationFrame(renderLoop);
                }
                window.requestAnimationFrame(renderLoop);

                return null;
            },

            getInitialTime: function() {
                var animatedObjectViews = this.model.get("animatedObjectViews");
                var tInitial = null;
                animatedObjectViews.forEach(function(view, index, views) {
                    if (view.model.get("transformations")[0].time < tInitial) {
                        tInitial = view.model.get("transformations")[0].time;
                    }
                }); 
                
                return tInitial; 
            },  

            stop: function() {
                this.mode="stop";
                this.overdub.off();
                // capture current state
                var matrix;

                return null;
            },

            // Add a new backbone view to the list of animated objects using a modal
            addNewAnimatedObject: function(event) {
                var that        = this;
                var $input      = null, 
                    modal       = null;
                var imgID       = _.uniqueId("supercoolimagepreview-");
                var imgWidth    = 250;
                var imgHeight   = 250;
                var objectConfig = null;
                var $bodyTemplate       = $("<div>");
                var animatedObjectView  = null, 
                    animatedObjectModel = null;

                // make ready the template overides
                $bodyTemplate.append("<span class='img-input-label'></span><input class='add-image' type='file'><br>");
                $bodyTemplate.append("<span class='img-name-label'></span><input class='img-name' type='text'><br>");
                $bodyTemplate.append("<span class='img-width-label'></span><input class='img-width' type='number' value="+imgWidth+"><br>");
                $bodyTemplate.append("<span class='img-height-label'></span><input class='img-height' type='number' value="+imgHeight+"><br>");
                $bodyTemplate.append("<button class='submit'>Submit</button><br>");
                $bodyTemplate.append("<div><img id='"+imgID+"' width='250' height='250' value="+imgHeight+"></div>");
                $input = $bodyTemplate.find(".add-image");
                // start the modal view
                modal = new ModalView({
                    header: "Select an Image",
                    partial: $bodyTemplate,
                    initialize: function() {
                        var self        = this;
                        var local       = new Object();
                        var $imgtag     = $bodyTemplate.find("#"+imgID);
                        var className   = null;
                        var $imgWidth   = $bodyTemplate.find(".img-width");
                        var $imgHeight  = $bodyTemplate.find(".img-height");
                        var $imgName    = $bodyTemplate.find(".img-name");
                        var $submitNewObject = $bodyTemplate.find(".submit");
                        // onload callback for FileReader
                        function fileReaderOnload(event) {
                            var result = event.target.result;
                            $imgtag.attr("src", result);
                        }
                        // onchange callback for file add event
                        function fileSelected(event) {
                            var selectedFile = event.target.files[0];
                            var reader = new FileReader();

                            $imgtag.title = selectedFile.name;
                            reader.onload = fileReaderOnload;
                            reader.readAsDataURL(selectedFile);
                        }

                        function changeDimension(event) {
                            if ($(this).hasClass("img-width")) {
                                $imgtag.attr("width", event.currentTarget.value);
                            }
                            else {
                                $imgtag.attr("height", event.currentTarget.value);
                            }
                        }
                        
                        function setClassName(event) {
                            className = event.currentTarget.value;
                        }
                        
                        function submitNewObject(event) {
                            var width   = $imgWidth.val(), 
                                height  = $imgHeight.val(), 
                                className = $imgName.val();
                            var classNameMatch = className.match(/[\^%\\!@#()+=`~\*&\|\{\}\[\]'"\?<>\.,]/g);

                            // validate width 
                            if (Number.isNaN(window.parseInt(width))) {
                                alert("specify a number for the width");
                                return null;
                            }
                            // validate height
                            else if (Number.isNaN(window.parseInt(height))) {
                                alert("specify a number for the width");
                                return null;
                            }
                            // validate className
                            else if (className.trim() === "") {
                                alert("Enter a className.");
                                return null; 
                            }
                            else if (className[0].match(/[0-9\^%\\!@#\$()+=-`~\*&\|\{\}\[\]'"\?<>\.,]/)) {
                                alert("classNames can't start with "+className[0]+". Please use a letter.");
                                return null; 
                            }
                            else if (classNameMatch !== null) {
                                alert("classNames can't contain certain characters like this: '"+classNameMatch[0]+"'. Please change the className.");
                                return null; 
                            }
                            // validate loaded img
                            else if ($imgtag.attr("src") === undefined) {
                                alert("You need to select an image from your computer");
                                return null; 
                            }

                            // append new animated object to the list of animated objects
                            objectConfig = {
                                DOMAttributes: {
                                    class   : className,
                                    width   : width,
                                    height  : height,
                                    src     : $imgtag.attr("src")
                                },
                                tagName : "img"
                            };

                            that.model.get("animatedObjectModels").add(new AnimatedObjectModel(objectConfig));
                            self.closeModal();
                            return null;
                        }
                        
                        // event binding
                        $input[0].addEventListener("change", fileSelected);
                        $imgWidth.on("change", changeDimension);
                        $imgHeight.on("change", changeDimension);
                        $imgName.on("change", setClassName);
                        $submitNewObject.on("click", submitNewObject);
                    }
                });
            },
            
            // Set some animated object's view as the active animated object. The active animated object
            // is the only element(s) storing transformation data into its (their) model(s).
            // TODO: pluralize the method. 
            setActiveAnimatedObjects: function(/*view, view, ...*/) {
                var views = new Array(); 
                if (arguments.length === 0) {
                    throw new Error("pass some views to setActiveAnimatedObjects()");
                }
                if (arguments[0] instanceof Array) {
                    views = views.concat(arguments[0]);
                }
                else {
                    for (var i=0; i<len; i++) views.push(arguments[i]);
                }
                this.model.set("activeAnimatedObjects", views); 
                this.activeAnimatedObjects = views;
            },
            
            getActiveAnimatedObjects: function() {
                return this.model.get("activeAnimatedObjects");
            },

            removeAnimatedObjects: function(view) {
                this.model.get("animatedObjectViews").forEach(function(view) {
                    view.remove();        
                });
            }, 

            // callback function for animatedObjectModels collection
            renderAnimatedObjectModel: function(model, collection, options) {
                var that = this;
                var view = new AnimatedObjectView({model: model})
                var activeAnimatedObjects = this.getActiveAnimatedObjects();

                this.model.get("animatedObjectViews").push(view);
                // render all if no view was passed
                $(".animation-creator-main-axes").append(view.$el);
                view.$el.draggable();
                

                //TODO: find a better way of adding view to activeAnimatedObjects
                activeAnimatedObjects.push(view);
                this.setActiveAnimatedObjects(activeAnimatedObjects);
                
            },

            // will I ever use this?
            multiplyMatrix2D: function(A, B) {
                /* defined as:
                 *
                 *     [ a0 a1 a4 ]       [ b0 b1 b4 ]
                 * A = [ a2 a3 a5 ] , B = [ b2 b3 b5 ]
                 *
                 *      [ a0b0+a1b2   a0b1+a1b3   a5+b5]
                 * AB = [ a2b0+a3b2   a3b1+a3b3   a5+b5]
                 *
                */
                return ([
                            (A[0]*B[0]+A[1]*B[2]), (A[0]*B[1]+A[1]*B[3]),
                            (A[2]*B[0]+A[3]*B[2]), (A[2]*B[1]+A[3]*B[3]),
                            (A[4]+B[4]), (A[5]+B[5])
                        ]);
            },

            multiplyMatrix3D: function(A, B) {
                /* defined for matrix X as:
                 *
                 *          [ a b 0 r ]   |   [ 0  1  2  3  ]
                 *          [ c d 0 t ]   |   [ 4  5  6  7  ]
                 *    X  =  [ 0 0 0 0 ]   |   [ 8  9  10 11 ]
                 *          [ x y 0 z ]   |   [ 12 13 14 15 ]
                 *
                 *          [ aa+bc ab+bd 0     r+r ]
                 *          [ ca+dc cb+dd 0     t+t ]
                 *   X^2 =  [ 0     0     0     0   ]
                 *          [ x+x   y+y   0     z+z ]
                */
                return ([
                         (A[0]*B[0]+A[1]*B[4]), (A[0]*B[1]+A[1]*B[5]), 0    , (A[3]+B[3]),
                         (A[4]*B[0]+A[5]*B[4]), (A[4]*B[1]+A[5]*B[5]), 0    , (A[7]+B[7]),
                         0                    , 0                    , 1    , 0          ,
                         (A[12]+B[12])        , (A[13]+B[13])        , 0    , (A[15]+B[15])
                        ]);
            },

            // TODO: deprecate
            // this is the loader icon
            spinerIcon: {
                on:function(){
                    $(this.loadIcon).addClass("animation-creator-loading");
                },
                off: function(){
                    $(this.loadIcon).removeClass("animation-creator-loading");
                }
            },
            
            resetToZeroState: function() {
                this.model.set("transformations", []);
                this.processCSS(["","",""]);
                this.mainAxes.model.set("transformations", []);
                this.mainAxes.drawAxes();
            }
        });
        return AnimationCreatorView;
    }
);
