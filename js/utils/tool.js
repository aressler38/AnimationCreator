define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "CanvasView",
        "CanvasModel",
        "InputFieldView",
        "InputFieldModel"

    ],
    function($, _, Backbone, CanvasView, CanvasModel,
        InputFieldView, InputFieldModel) {

        return function(toolType, config) {

            switch(toolType) {
                case "TextInput":
                    return new InputFieldModel(config);
                case "MainAxes":
                    return new CanvasView({model:new CanvasModel(config)});
                default:
                    throw new Error("TypeError: Unhandled toolType: "+toolType);
            }
        }
    }
);
