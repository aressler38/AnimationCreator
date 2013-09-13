define(
    [
        "jQuery",
        "underscore",
        "Backbone",
    ],
    function($, underscore, Backbone) {
        var CanvasModel = Backbone.Model.extend({

            defaults: {
                width: "800",
                height: "600",
                id: _.uniqueId("annotationCreator-"),

                //transformations: [],
                transformation: function() {
                    this.cssMatrix  = arguments[0];
                    this.time       = arguments[1];
                    this.type       = arguments[2];
                    return this;
                }

            },

            initialize: function() {
                this.set("target", $(this.get("target")));
                this.set("width", this.get("width").replace("px", "")); // just in case someone uses px
                this.set("height", this.get("height").replace("px", ""));
                this.set("transformations", []);
            }

        });
        return CanvasModel;
    }
);
