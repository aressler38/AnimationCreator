define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var InputFieldModel = Backbone.Model.extend({
            defaults: {
                type: "text"
            },
            initialize:function() {

            }
        });
        return InputFieldModel;
    }
);
