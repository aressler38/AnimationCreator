//build script for r.js

({

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
    },

    modules: [
        {
            name: "AnimationCreator"
        }
    ],

    dir: "build",


    mainConfigFile:"AnimationCreator.js",

    namespace: "AnimationCreator"

    //If you want to be able to read it the file, then uncomment the next line.
    //optimize: "none"

})

