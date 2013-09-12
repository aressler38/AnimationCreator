//build script for r.js

({

    baseURL: '/opt/labs/peer_help',

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
    // Require paths * appends .js to each path
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

    },


    modules: [
        {
            name: "require_config"
        }
    ],

    dir: 'build',


    mainConfigFile:'require_config.js',

    namespace: 'animationCreator'

    //If you want to be able to read it the file, then uncomment the next line.
    //optimize: "none"

})

