


define( 
    [
        "jQuery",
        "underscore",
        "Backbone",
        "ToolModel"
    ],
    function($, _, Backbone, ToolModel) {
        var Tools = Backbone.Collection.extend({
            model:ToolModel
        });

        return Tools;
    }
);
