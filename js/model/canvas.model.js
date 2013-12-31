define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, underscore, Backbone) {
        var CanvasModel = Backbone.Model.extend({

            defaults: {
                width: "800",
                height: "600",
                id: _.uniqueId("annotationCreator-"),

                transformations: [],
                transformation: function() {
                    this.matrix  = arguments[0];
                    this.time    = arguments[1];
                    this.type    = arguments[2];
                    return this;
                }
            },

            initialize: function() {
                this.set("target", $(this.get("target")));
                if (typeof this.get("width") === "string") {
                    this.set("width", this.get("width").replace("px", "")); // just in case someone uses px
                }
                if (typeof this.get("height") === "string") {
                    this.set("height", this.get("height").replace("px", ""));
                }
            }
        });
        return CanvasModel;
    }
);
