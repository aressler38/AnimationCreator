define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var ButtonModel = Backbone.Model.extend({
            defaults: {
                type: "button"
            },
            initialize: function() {

            }
        });
        return ButtonModel;

    }
);
