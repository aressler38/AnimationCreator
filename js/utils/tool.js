define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "tools",
        "CanvasView",
        "CanvasModel",
        "InputFieldView",
        "InputFieldModel"
        
    ],
    function($, _, Backbone, tools, CanvasView, CanvasModel,
        InputFieldView, InputFieldModel) {

        return function(toolType, config) {

            switch(toolType) {
                case "text-input":
                    return new InputFieldView({model:new InputFieldModel(config)});
                case "axes":
                    return new CanvasView({model:new CanvasModel(config)});
                default: 
                    throw new Error("TypeError: Unhandled toolType: "+toolType);
            }
        }
    }
);
