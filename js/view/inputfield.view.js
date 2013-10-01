define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var InputFieldView = Backbone.View.extend({
            tagName: "input",

            initialize:function() {

            },
            events: function() {
                var events = new Object();
                return events;
            }
        });
        return InputFieldView;
    }
);
