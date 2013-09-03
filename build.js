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
        "AnimationCreatorModel" : "js/model/animationCreator.model",
        "AnimationCreatorView"  : "js/view/animationCreator.view"
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

