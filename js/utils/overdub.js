define(["jQuery"],function($){ 
    return function(context) {
        /*
         *  Rewrite the current transformation loaded.
         *  The process will actively listen for changes
         *  from the set of active tools and make edits to
         *  the stylesheet as desired.
        */
        var activate = false;
        var that = context;

        function paintFrame(time) {
            // first check the mode
            if (activate) {
                // do stuff...
                // let's make a couple of callbacks for requestAnimationFrame.
                window.requestAnimationFrame(paintFrame);
            }
            return null;
        }

        return ({
            on: function() {
                $("#overdub-button").addClass("push-button-active");
                activate = true;
                window.requestAnimationFrame(paintFrame);
            },
            off: function() {
                $("#overdub-button").removeClass("push-button-active");
                activate = false;
            },
            toggle: function() {
                if (activate === true) this.off();
                else this.on(); 
            }
        })
    }
});
