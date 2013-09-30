define(
    [
        "jQuery",
        "underscore",
        "Backbone",

        "CanvasView",
        "CanvasModel",

        "Tools",
        "ToolModel",

        "renderTemplate",
        "hbs!templates/main"
    ],
    function($, _, Backbone, CanvasView, CanvasModel, Tools, 
               ToolModel, renderTemplate, mainTemplate) {

        var AnimationCreatorView = Backbone.View.extend({

            className: "animation-creator-main",

            tagName: "div",

            initialize: function() {
                var model = this.model;
                this.SubProcess = new Worker("./worker.js");

                this.el.setAttribute("id", this.model.get("id"));

                var mainTemplateConfig = this.model.get("mainTemplateConfig");
                var mainAxisConfig = {
                    target : mainTemplateConfig.mainAxis
                };

                this.mainAxis = new CanvasView({model:new CanvasModel(mainAxisConfig)});

                this.mainAxis.model.on("change:transformations", function() {
                    console.log(arguments);
                    model.set("transformations", arguments[0]);
                });
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
                            throw new Error("no handled response type")
                    }
                }

                this.SubProcess.addEventListener("message", parseSubProcessResponse);

                /* === view Events === */
                var events = new Object();
                events["click #"+this.model.get("mainTemplateConfig").generateCSS] = "generateCSS";
                return events;
            },

            render: function() {
                var mainTemplateConfig = this.model.get("mainTemplateConfig");
                var template = renderTemplate(mainTemplate, mainTemplateConfig);
                this.$el.html(template);
                this.model.get("target").html(this.el);
            
                document.getElementById(mainTemplateConfig.mainAxis).appendChild(this.mainAxis.render());

                this.loadIcon           = document.getElementById(mainTemplateConfig.loadIcon);
                this.styleSheet         = document.getElementById(mainTemplateConfig.styleSheet);
                this.styleSheetHelper   = document.getElementById(mainTemplateConfig.styleSheetHelper);
                this.queryElement       = document.getElementById(mainTemplateConfig.queryElement);

                return null;
            },

            spinerIcon: {
                on:function(){
                    $(this.loadIcon).addClass("animation-creator-loading");
                },
                off: function(){
                    $(this.loadIcon).removeClass("animation-creator-loading");
                }
            },

            generateCSS: function() {
                var transformations  = this.model.get("transformations");
                var workerData = {
                    transformations: transformations
                }

                $("#test").removeClass("animate");

                $(this.queryElement).removeClass("animation-creator-query");

                this.spinerIcon.on.call(this);
                this.SubProcess.postMessage({message:"generateCSS", workerData:workerData});
            },

            processCSS: function(data) {
                this.styleSheet.innerHTML = data[0];
                this.styleSheetHelper.innerHTML = data[1];
                this.spinerIcon.off.call(this);

                $("#test").addClass("animate");
                $(this.queryElement).addClass("animation-creator-query");

                document.getElementById("text").innerHTML = this.styleSheet.innerHTML;
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

            overdub: function() {
                /*
                 *  Rewrite the current transformation loaded.
                 *  The process will actively listen for changes
                 *  from the set of active tools and make edits to
                 *  the stylesheet as desired.
                 */
            },

            matrixMultiplication: function(A, B) {
                /* defined as:
                 *
                 *     [ a0 a1 a4 ]       [ b0 b1 b4 ]
                 * A = [ a2 a3 a5 ] , B = [ b2 b3 b5 ]
                 *
                 *      [ a0b0+a1b2   a0b1+a1b3   a5+b5]
                 * AB = [ a2b0+a3b2   a3b1+a3b3   a5+b5]
                 *
                 *  note: the 'n' in a<n> represents the index in array a, so a1 == A[1]
                */
                return ([   (A[0]*B[0]+A[1]*B[2]), (A[0]*B[1]+A[1]*B[3]),
                            (A[2]*B[0]+A[3]*B[2]), (A[2]*B[1]+A[3]*B[3]),
                            (A[4]+B[4]), (A[5]+B[5])
                        ]);
            }

        });
        return AnimationCreatorView;
    }
);
