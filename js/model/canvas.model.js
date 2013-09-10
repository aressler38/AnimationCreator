define(
    [
        "jQuery",
        "underscore",
        "Backbone",
    ],
    function($, underscore ,Backbone) {
        var CanvasModel = Backbone.Model.extend({

            defaults: {
                width: "800",
                height: "600",
                id: _.uniqueId("annotationCreator-")
            },

            initialize: function() {
                this.set("target", $(this.get("target")));
                this.set("width", this.get("width").replace("px", "")); // just in case someone uses px
                this.set("height", this.get("height").replace("px", ""));
            }

        });
        return AnimationCreatorModel;
    }
);
