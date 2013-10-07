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
                this.el.setAttribute("id", _.uniqueId("input-"));
            },
            events: function() {
                var events = new Object();
                events["#"+this.el.id+" keyup"] = "captureText";
                return events;
            },
            captureText: function(event) {
                this.model.set("text", this.el.value());
            }
        });
        return InputFieldView;
    }
);
