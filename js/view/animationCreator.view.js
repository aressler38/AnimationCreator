define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "CanvasView",
        "CanvasModel",
        "Tools",
        "Tool",
        "renderTemplate",
        "hbs!templates/main"
    ],
    function($, _, Backbone, CanvasView, CanvasModel, Tools,
               Tool, renderTemplate, mainTemplate) {

        var AnimationCreatorView = Backbone.View.extend({

            className   : "animation-creator-main",
            tagName     : "div",
            workerURI   : "js/utils/worker.js",

            initialize: function() {
                var that = this;
                this.SubProcess = new Worker(this.workerURI);
                this.el.setAttribute("id", this.model.get("id"));

                var mainTemplateConfig = this.model.get("mainTemplateConfig");
                var mainAxisConfig = {
                    target : mainTemplateConfig.mainAxis
                };

                this.mainAxis = Tool("MainAxes", mainAxisConfig);
                this.tools = new Tools({model:this.model});
                this.render();
                this.addInitialTools();

                this.addAnimatedObject({ 
                    DOMAttributes: {
                        id:"test",
                        //draggable:true,
                    },
                    offset: {x:381, y:-481}
                    
                    /*
                    ondrag: function(event) {
                        if (event.y !== 0 && event.x !== 0) {
                            $(this).css({top: event.y});
                            $(this).css({left: event.x});
                        }
                    }
                    */
                });
                this.renderAnimatedObjects();
            },
            
            setAnimationName: function(event, text) {
                this.model.set("animationName", text);
            },
            
            addInitialTools: function() {
                var that = this;
                this.tools.collection.add([
                    Tool("Button", {
                        innerHTML: "generate css",
                        onclick: function() {
                            that.generateCSS();
                        }
                    }),
                    Tool("Button", {
                        innerHTML: "print css",
                        onclick: function() {
                            that.printCSS();
                        }
                    }),
                    Tool("TextInput", {
                        onkeyup: this.setAnimationName,
                        callContext: this
                    }),
                    Tool("Button", {
                        viewAttributes: {
                            class: "time-control"
                        },
                        innerHTML: "play",
                        onclick: function() {
                            that.play();
                        }
                    }),
                    Tool("Button", {
                        viewAttributes: {
                            class: "time-control"
                        },
                        innerHTML: "stop",
                        onclick: function() {
                            that.stop();
                        }
                    }),
                    Tool("Button", {
                        viewAttributes: {
                            class: "time-control"
                        },
                        innerHTML: "overdub",
                        onclick: function() {
                            that.overdub();
                        }
                    }),
                    Tool("Button", {
                        innerHTML: "resetAxes & css animations",
                        onclick: function() {
                            that.resetToZeroState();
                        }
                    })
                ]);
            },

            events: function() {
                var that = this;
                /* === SubProcess events === */
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

                /* === tool model events === */
                this.mainAxis.model.on("change:transformations", function() {
                    that.model.set("transformations", arguments[0]);
                });

                /* View Events */
                var events = new Object();
                //events["click #"+this.model.get("mainTemplateConfig").generateCSS] = "generateCSS";
                return events;
            },

            render: function() {
                var mainTemplateConfig = this.model.get("mainTemplateConfig");
                var template = renderTemplate(mainTemplate, mainTemplateConfig);
                this.$el.html(template);
                this.model.get("target").html(this.el);

                // render mainAxis and Tools...
                document.getElementById(mainTemplateConfig.mainAxis).appendChild(this.mainAxis.render());
                document.getElementById(mainTemplateConfig.tools).appendChild(this.tools.render());
                
                // get contexts of other app specific dom elements
                this.loadIcon           = document.getElementById(mainTemplateConfig.loadIcon);
                this.styleSheet         = document.getElementById(mainTemplateConfig.styleSheet);
                this.styleSheetHelper   = document.getElementById(mainTemplateConfig.styleSheetHelper);
                this.queryElement       = document.getElementById(mainTemplateConfig.queryElement);

                return null;
            },

            generateCSS: function(clear) {
                var workerInterface = {
                    message: "generateCSS",
                    workerData: {
                        animationName: this.model.get("animationName"),
                        transformations: (!clear) ? this.model.get("transformations") : []
                    } 
                }

                $(this.queryElement).removeClass("animation-creator-query");
                this.spinerIcon.on.call(this);
                this.SubProcess.postMessage(workerInterface);
            },

            processCSS: function(data) {
                this.styleSheet.innerHTML = data[0];
                this.styleSheetHelper.innerHTML = data[1];
                this.spinerIcon.off.call(this);

                $(this.queryElement).addClass("animation-creator-query");

                return null;
            },

            printCSS: function() {
                return (document.getElementById("text").innerHTML = this.styleSheet.innerHTML);
            },

            query: function() {
                var percentage = parseFloat($(this.queryElement).css("opacity"));
                var cssPercentage = (percentage.toFixed(4)*100).toPrecision(4);
                var opacityPercentage = ((percentage.toFixed(4)*100).toPrecision(4)/100).toPrecision(4),
                    opacityPercentage = parseFloat(opacityPercentage);

                if (this.styleSheet.innerHTML.match(cssPercentage)) {
                    return cssPercentage;
                }
                else {
                    throw new Error("failed query "+cssPercentage);
                }
            },

            play: function(percentage) {
                // apply style sheet
                this.model.get("animatedObjects").forEach(function(view) {
                    view.$el.addClass("animate");
                });
                return null;
            },

            stop: function() {
                // capture current state
                this.model.get("animatedObjects").forEach(function(view) {
                    view.$el.removeClass("animate");
                });
                return null;
            },

            overdub: function() {

                /*
                 *  Rewrite the current transformation loaded.
                 *  The process will actively listen for changes
                 *  from the set of active tools and make edits to
                 *  the stylesheet as desired.
                 */

                return null;
            },

            addAnimatedObject: function(config) {
                // this will add a new backbone view to the list of animated objects
                var animatedObject = Backbone.View.extend({
                    initialize: function() {
                        for (var attr in this.options.DOMAttributes)
                            if (this.options.DOMAttributes.hasOwnProperty(attr))
                                this.el.setAttribute(attr, this.options.DOMAttributes[attr]);
                        
                       // if (this.options.ondrag) this.el.ondrag = this.options.ondrag;
                       // if (this.options.ondrag) this.el.ondrop = this.options.ondrop;
                       // if (this.options.ondrag) this.el.ondragend = this.options.ondragend;
                        this.$el.draggable();
                            
                        if (this.options.offset !== undefined) {
                            this.$el.css({top: this.options.offset.y, left: this.options.offset.x});
                        }
                    }
                });
                this.model.get("animatedObjects").push(new animatedObject(config));
            },

            removeAnimatedObjects: function() {
                this.model.get("animatedObjects").forEach(function(view) {
                    view.$el.remove();        
                });
            }, 

            renderAnimatedObjects: function() {
                var that = this;
                this.model.get("animatedObjects").forEach(function(view) {
                    //that.$el.append(view.$el);                 
                    $(document.body).append(view.$el);
                });
            },

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

            spinerIcon: {
                // this is the loader icon
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
                this.mainAxis.model.set("transformations", []);
                this.mainAxis.drawAxes();
            }
        });
        return AnimationCreatorView;
    }
);
