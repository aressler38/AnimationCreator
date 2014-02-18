/*
 * Description: configuration file for requirejs,
 *              contains the main module at the bottom.
*/
require.config({
    baseURL: "/opt/animationCreator",
    shim: {
        jQuery: {
            exports: "jQuery"
        },
        underscore: {
            exports: "_"
        },
        Backbone: {
            deps:["underscore", "jQuery"],
            exports: "Backbone"
        }
    },
    paths: {
        "addInitialTools"       : "js/extras/addInitialTools",
        "requestAnimationFrame" : "js/utils/requestAnimationFrame",
        "jQuery"                : "vendor/jquery/jquery-1.10.2.min",
        "jQueryNC"              : "js/utils/noConflict/jQueryNC",
        "jQueryUI"              : "vendor/jquery/jquery-ui-1.10.3.custom",
        "noUiSlider"            : "vendor/noUiSlider/jquery.nouislider",
        "bootstrap"             : "vendor/bootstrap/bootstrap_amd",
        "Backbone"              : "vendor/backbone/backbone-min",
        "underscore"            : "vendor/underscore/underscore-min",
        "hbs"                   : "vendor/hbs-plugin/hbs",
        "Handlebars"            : "vendor/handlebars/handlebars",
        "renderTemplate"        : "js/utils/renderTemplate",
        "toolInitializer"       : "js/utils/toolInitializer",
        "ModalView"             : "js/view/modal.view",
        "AnimationCreatorView"  : "js/view/AnimationCreator.view",
        "AnimationCreatorModel" : "js/model/AnimationCreator.model",
        "AnimatedObjectView"    : "js/view/AnimatedObject.view",
        "AnimatedObjectModel"   : "js/model/AnimatedObject.model",
        "CanvasView"            : "js/view/canvas.view",
        "CanvasModel"           : "js/model/canvas.model",
        "InputView"             : "js/view/input.view",
        "InputModel"            : "js/model/input.model",
        "ButtonView"            : "js/view/button.view",
        "ButtonModel"           : "js/model/button.model",
        "SliderView"            : "js/view/slider.view",
        "SliderModel"           : "js/model/slider.model",
        "Tools"                 : "js/view/tools.view",
        "Tool"                  : "js/utils/tool",
        "Overdub"               : "js/utils/overdub"
    },
    map: {
        "*" : {
            "jQuery"    : "jQueryNC"
        },
        "jQueryNC": {
            "jQuery" : "jQuery"
        }
    }
});


define(
    [
        "requestAnimationFrame",
        "jQuery",
        "jQueryUI",
        "bootstrap",
        "noUiSlider",
        "underscore",
        "Backbone",
        "AnimationCreatorModel",
        "AnimationCreatorView"
    ], // note: jqUI has already run and has attached all the widgets to $.
    function(raf, $, jqUI, bootstrap, nouislider, _, Backbone, AnimationCreatorModel, AnimationCreatorView) {

        _.noConflict();
        Backbone.noConflict();
        Backbone.$ = $;
        window.$=$;

        function AnimationCreator(config) {
            var model = new AnimationCreatorModel(config);
            var view = new AnimationCreatorView({model:model});

            return ({
                view:view,
                model:model,
                render:function(){return view.render();}
            });
        }
        
        return AnimationCreator;
    }
);
