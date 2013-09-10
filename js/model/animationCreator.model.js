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
                }
            },

            initialize: function() {
                this.set("target", $(this.get("target")));
            }

        });
        return AnimationCreatorModel;
    }
);
