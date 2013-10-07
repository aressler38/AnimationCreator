define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "ButtonModel",
        "InputModel",
        "CanvasView",
        "CanvasModel"

    ],
    function($, _,  Backbone, 
                    ButtonModel,
                    InputModel, 
                    CanvasView, 
                    CanvasModel) 
        {

        return function(toolType, config) {

            switch(toolType) {
                case "Button":
                    return new ButtonModel(config);
                case "TextInput":
                    return new InputModel(config);
                case "MainAxes":
                    return new CanvasView({model:new CanvasModel(config)});
                default:
                    throw new Error("TypeError: Unhandled toolType: "+toolType);
            }
        }
    }
);
