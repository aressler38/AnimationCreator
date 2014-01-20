define(
    [
        "jQuery",
        "underscore",
        "Backbone",
    ],
    function($, _ ,Backbone) {
        var AnimationCreatorModel = Backbone.Model.extend({

            defaults: function() { 
                return ({
                    transformations: [],
                    transformation: function() {
                        this.matrix  = arguments[0];
                        this.time       = arguments[1];
                        return this;
                    },
                    mainTemplateConfig: {
                        mainAxes            : _.uniqueId("mainaxes-"),
                        tools               : _.uniqueId("toolkit-"),
                        loadIcon            : _.uniqueId("load-"),
                        styleSheet          : _.uniqueId("ss-"),
                        styleSheetHelper    : _.uniqueId("ssh-"),
                        generateCSS         : _.uniqueId("button-")
                        /*queryElement        : _.uniqueId("query-")*/
                    },
                    // collection of animatedObjectModels
                    animatedObjectModels: new Backbone.Collection(),
                    // array of views created by adding new models to animatedObjectModels
                    animatedObjectViews: new Array(),
                    // array of views that are 'active' meaning that they get any incoming transformations
                    // pushed to their models
                    activeAnimatedObjects: new Array()
                });
            },

            initialize: function() {
                this.set("target", $(this.get("target"))); //deal with querySelector cases
            }

        });

        return AnimationCreatorModel;
    }
);
