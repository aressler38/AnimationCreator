define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "toolInitializer"
    ],
    function($, _, Backbone, toolInitializer) {
        var InputView = Backbone.View.extend({
            tagName: "input",

            initialize:function() {
                toolInitializer.call(this);
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
        return InputView;
    }
);
