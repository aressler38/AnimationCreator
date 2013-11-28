define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "toolInitializer"
    ],
    function($, _, Backbone, toolInitializer) {
        var SliderView = Backbone.View.extend({
        
            tagName     : "div",
            className   : "noUiSlider",


            initialize: function() {
                toolInitializer.call(this);
                this.$el.noUiSlider({
                    range: [this.model.get("rangeMin"), this.model.get("rangeMax")],
                    start: this.model.get("startValue"),
                    handles: 1,
                    slide: this.model.get("onslide")
                });
            },
            events: function() {
                
            }
        });
        return SliderView;
    }
);
