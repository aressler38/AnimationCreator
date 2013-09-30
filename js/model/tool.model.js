define(
    [
        "jQuery",
        "underscore",
        "Backbone",

        "CanvasView",
        "CanvasModel"
        
    ],
    function($, _, Backbone, CanvasView, CanvasModel) {
        var ToolModel = Backbone.Model.extend({
            
            initialize: function(d) {
                console.log(d);
            }
        });

        return ToolModel;
    }
);
