define(["Tool", "Tools"], function(Tool, Tools) {

    // TODO: this goes in a seperate file 
    // Add the initial set of tools when initialize is called.
    return function() {
        var that = this;
        // Add a whole bunch of tools 
        this.tools.collection.add([
            Tool("Button", {
                viewAttributes: {
                    class: "btn btn-info btn-lg" 
                },
                innerHTML: "generate css",
                onclick: function() {
                    that.generateCSS();
                }    
            }),
            Tool("Button", {
                viewAttributes: {
                    class: "btn btn-info"
                },
                innerHTML: "print css",
                onclick: function() {
                    that.printCSS();
                }
            }),
            Tool("TextInput", {
                onkeyup: this.setAnimationName,
                callContext: this
            }),
            Tool("Button", {
                viewAttributes: {
                    class: "time-control btn btn-success"
                },
                innerHTML: "play",
                onclick: function() {
                    that.play();
                }
            }),
            Tool("Button", {
                viewAttributes: {
                    class: "time-control btn btn-danger"
                },
                innerHTML: "stop",
                onclick: function() {
                    that.stop();
                }
            }),
            Tool("Button", {
                viewAttributes: {
                    id: "overdub-button",
                    class: "time-control btn btn-info"
                },
                innerHTML: "overdub",
                onclick: function() {
                    that.overdub.toggle();
                }
            }),
            Tool("Button", {
                viewAttributes: {
                    class: "btn btn-info"
                },
                innerHTML: "resetAxes & css animations",
                onclick: function() {
                    that.resetToZeroState();
                }
            }),
            Tool("Slider", {
                // We want different types of sliders to controll different axes
                // z,x,y axes, rotation, etc..
                // We need a hook that can supply the type of slider desired,
                // and initialize it on demand.
                viewAttributes: {},
                rangeMin: -360,
                rangeMax: 360,
                startValue: 0,
                onslide: function() {
                    that.model.set("transformations", arguments[0]);
                }
                
            }),
            Tool("Button", {
                viewAttributes: {
                    class: "btn"
                },
                innerHTML: "add a new animated object",
                onclick: function() {
                    that.addNewAnimatedObject()
                }
            })

        ]);
        return null;
    };
});
