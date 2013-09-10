// Description: configuration file for requirejs

require.config({
    baseURL: "/opt/animationCreator",
    shim: {
        jQuery: {
            exports: "$"
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
        "Backbone"              : "vendor/backbone/backbone-min",
        "underscore"            : "vendor/underscore/underscore-min",
        "noUiSlider"            : "vendor/noUiSlider/jquery.nouislider",
        "hbs"                   : "vendor/hbs-plugin/hbs",
        "Handlebars"            : "vendor/handlebars/handlebars",
        "renderTemplate"        : "js/utils/renderTemplate",
        "AnimationCreatorModel" : "js/model/animationCreator.model",
        "AnimationCreatorView"  : "js/view/animationCreator.view",
        "CanvasView"            : "js/view/canvas.view",
        "CanvasModel"           : "js/model/canvas.model"
    }
});

require(
    [
        "jQuery",
        "noUiSlider",
        "underscore",
        "Backbone",
        "AnimationCreatorModel",
        "AnimationCreatorView"
    ],
    function($, None, _, Backbone, AnimationCreatorModel, AnimationCreatorView) {

        window.requestAnimationFrame = (function(){
            return  window.requestAnimationFrame       ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                    };
        })();

        function AnimationCreator(config) {
            var model = new AnimationCreatorModel(config);
            var view = new AnimationCreatorView({model:model});
            return ({
                view:view, model:model,
                render:function(){return view.render();}
            });
        }

        window.AnimationCreator = AnimationCreator;

        return null; 
    }
);
