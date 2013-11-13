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
        "AnimationCreatorView"  : "js/view/animationCreator.view",
        "AnimationCreatorModel" : "js/model/animationCreator.model",
        "CanvasView"            : "js/view/canvas.view",
        "CanvasModel"           : "js/model/canvas.model",
        "InputView"             : "js/view/input.view",
        "InputModel"            : "js/model/input.model",
        "ButtonView"            : "js/view/button.view",
        "ButtonModel"           : "js/model/button.model",
        "Tools"                 : "js/view/tools.view",
        "Tool"                  : "js/utils/tool"
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
        "jQuery",
        "jQueryUI",
        "bootstrap",
        "noUiSlider",
        "underscore",
        "Backbone",
        "AnimationCreatorModel",
        "AnimationCreatorView"
    ], // note: jqUI has already run and has attached all the widgets to $.
    function($, jqUI, bootstrap, None, _, Backbone, AnimationCreatorModel, AnimationCreatorView) {

        _.noConflict();
        Backbone.noConflict();
        Backbone.$ = $;

        function AnimationCreator(config) {
            var model = new AnimationCreatorModel(config);
            var view = new AnimationCreatorView({model:model});

            return ({
                view:view,
                model:model,
                render:function(){return view.render();}
            });
        }
        
        window.$=$;

        return AnimationCreator;
    }
);
