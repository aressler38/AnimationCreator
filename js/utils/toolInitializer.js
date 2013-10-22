//NOTE: you should call this function with the context of the tool
define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function ($, _, Backbone) {
        return function() {
            var innerHTML       = this.model.get("innerHTML"); 
            var DOMAttributes   = this.model.get("viewAttributes");
            var onclick         = this.model.get("onclick");
            var onchange        = this.model.get("onchange");
            var callContext     = this.model.get("callContext");
            var onkeyup         = this.model.get("onkeyup");
            // default properties and text stuff
            this.el.innerHTML = innerHTML;
            this.el.setAttribute("id", _.uniqueId(this.tagName));

            // events
            if (onclick) this.el.onclick = onclick;

            if (onkeyup) {
                if (callContext) {
                    this.el.addEventListener("keyup", function(e) {
                        onkeyup.call(callContext, e, this.value);
                    });
                }
                else {
                    this.el.addEventListener("keyup", function(e) {
                        onkeyup(e, this.value);
                    });
                }
            }

            // attributes
            for (var i in DOMAttributes)
                if (DOMAttributes.hasOwnProperty(i))
                    this.el.setAttribute(i, DOMAttributes[i]);
        }
    }
);
