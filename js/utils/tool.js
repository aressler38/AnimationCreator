define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "SliderModel",
        "ButtonModel",
        "InputModel",
        "CanvasView",
        "CanvasModel"

    ],
    function($, _,  Backbone, 
                    SliderModel,
                    ButtonModel,
                    InputModel, 
                    CanvasView, 
                    CanvasModel) 
        {

        return function(toolType, config) {

            switch(toolType) {
                case "Slider":
                    return new SliderModel(config);
                    break;
                case "Button":
                    return new ButtonModel(config);
                    break;
                case "TextInput":
                    return new InputModel(config);
                    break;
                case "MainAxes":
                    return new CanvasView({model:new CanvasModel(config)});
                    break;
                default:
                    throw new Error("TypeError: Unhandled toolType: "+toolType);
            }
        }
    }
);
