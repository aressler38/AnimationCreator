//build script for r.js

({

    baseURL: "/opt/animationCreator",
    dir: "../dist",

    modules: [
        {
            name: "AnimationCreator"
        }
    ],

    mainConfigFile:"../AnimationCreator.js",

    namespace: "AnimationCreator"

    //optimize: "none"
})
