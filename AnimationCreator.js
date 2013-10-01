/* Description: configuration file for requirejs,
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
        "Backbone"              : "vendor/backbone/backbone-min",
        "underscore"            : "vendor/underscore/underscore-min",
        "noUiSlider"            : "vendor/noUiSlider/jquery.nouislider",
        "hbs"                   : "vendor/hbs-plugin/hbs",
        "Handlebars"            : "vendor/handlebars/handlebars",
        "renderTemplate"        : "js/utils/renderTemplate",
        "AnimationCreatorModel" : "js/model/animationCreator.model",
        "AnimationCreatorView"  : "js/view/animationCreator.view",
        "CanvasView"            : "js/view/canvas.view",
        "CanvasModel"           : "js/model/canvas.model",
        "InputFieldView"        : "js/view/inputfield.view",
        "InputFieldModel"       : "js/model/inputfield.model",
        "tools"                 : "js/collection/tools",
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
        "noUiSlider",
        "underscore",
        "Backbone",
        "AnimationCreatorModel",
        "AnimationCreatorView"
    ],
    function($, None, _, Backbone, AnimationCreatorModel, AnimationCreatorView) {
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

        return AnimationCreator;
    }
);
