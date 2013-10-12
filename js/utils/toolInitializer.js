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
            var DOMAttributes   = this.model.get("attributes");
            var onclick         = this.model.get("onclick");

            // default properties and text stuff
            this.el.innerHTML = innerHTML;
            this.el.setAttribute("id", _.uniqueId(this.tagName));

            // events
            if (onclick) this.el.onclick = onclick;

            // attributes
            for (var i in DOMAttributes)
                if (DOMAttributes.hasOwnProperty(i))
                    this.el.setAttribute(i, DOMAttributes[i]);
        }
    }
);
