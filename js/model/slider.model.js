define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var SliderModel = Backbone.Model.extend({
            defaults: {
                type: "slider"
            },
            initialize: function() {

            }
        });
        return SliderModel;

    }
);
