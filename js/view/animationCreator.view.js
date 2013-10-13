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

              //  this.tools.collection.add([Tool("TextInput"), Tool("TextInput")]);
                this.tools.collection.add([
                    Tool("Button", {
                        attributes: {
                            type: "button",
                        },
                        innerHTML: "generate css",
                        onclick: function() {
                            that.generateCSS();
                        }
                    }),
                    Tool("Button", {
                        attributes: {
                            type: "button",
                        },
                        innerHTML: "print css",
                        onclick: function() {
                            that.printCSS();
                        }
                    })
                ]);
                
            },
            
            addInitialTools: function() {

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

            generateCSS: function() {
                var workerInterface = {
                    message: "generateCSS",
                    workerData: {
                        transformations: this.model.get("transformations")
                    }
                }

                $("#test").removeClass("animate");
                $(this.queryElement).removeClass("animation-creator-query");
                this.spinerIcon.on.call(this);
                this.SubProcess.postMessage(workerInterface);
            },

            processCSS: function(data) {
                this.styleSheet.innerHTML = data[0];
                this.styleSheetHelper.innerHTML = data[1];
                this.spinerIcon.off.call(this);

                $("#test").addClass("animate");
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
                return null;
            },

            stop: function() {
                // capture current state
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
                on:function(){
                    $(this.loadIcon).addClass("animation-creator-loading");
                },
                off: function(){
                    $(this.loadIcon).removeClass("animation-creator-loading");
                }
            }

        });
        return AnimationCreatorView;
    }
);
