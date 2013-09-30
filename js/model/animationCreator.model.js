define(
    [
        "jQuery",
        "underscore",
        "Backbone",
    ],
    function($, underscore ,Backbone) {
        var AnimationCreatorModel = Backbone.Model.extend({

            defaults: {
                transformations: [],
                transformation: function() {
                    this.cssMatrix  = arguments[0];
                    this.time       = arguments[1];
                    return this;
                },
                mainTemplateConfig: {
                    mainAxis : _.uniqueId("mainaxis-"),
                    toolKit  : _.uniqueId("toolkit-"),
                    loadIcon : _.uniqueId("load-"),
                    styleSheet : _.uniqueId("ss-"),
                    styleSheetHelper : _.uniqueId("ssh-"),
                    generateCSS : _.uniqueId("button-")
                }
            },

            initialize: function() {
                this.set("target", $(this.get("target"))); //deal with querySelector cases
            }

        });

        return AnimationCreatorModel;
    }
);
