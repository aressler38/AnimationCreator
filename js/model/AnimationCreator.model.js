define(
    [
        "jQuery",
        "underscore",
        "Backbone",
    ],
    function($, _ ,Backbone) {
        var AnimationCreatorModel = Backbone.Model.extend({

            defaults: {
                transformations: [],
                transformation: function() {
                    this.matrix  = arguments[0];
                    this.time       = arguments[1];
                    return this;
                },
                mainTemplateConfig: {
                    mainAxis            : _.uniqueId("mainaxis-"),
                    tools               : _.uniqueId("toolkit-"),
                    loadIcon            : _.uniqueId("load-"),
                    styleSheet          : _.uniqueId("ss-"),
                    styleSheetHelper    : _.uniqueId("ssh-"),
                    generateCSS         : _.uniqueId("button-"),
                    queryElement        : _.uniqueId("query-")
                },
                animatedObjects: new Array()
            },

            initialize: function() {
                this.set("target", $(this.get("target"))); //deal with querySelector cases
            }

        });

        return AnimationCreatorModel;
    }
);