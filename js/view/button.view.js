define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "toolInitializer"
    ],
    function($, _, Backbone, toolInitializer) {
        var ButtonView = Backbone.View.extend({
        
            tagName     : "button",
            className   : "",

            initialize: function() {
                toolInitializer.call(this);
            },
            events: function() {
                
            }
        });
        return ButtonView;
    }
);
