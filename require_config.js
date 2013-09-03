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
        "AnimationCreatorModel" : "js/model/animationCreator.model",
        "AnimationCreatorView"  : "js/view/animationCreator.view"
    }
});

require(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "AnimationCreatorModel",
        "AnimationCreatorView"
    ],
    function($, _, Backbone, AnimationCreatorModel, AnimationCreatorView) {

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
