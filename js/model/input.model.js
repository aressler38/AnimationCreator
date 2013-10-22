define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {

        var InputModel = Backbone.Model.extend({

            defaults: {
                type: "text",
            },

            initialize:function() {
                
                if (this.get("onchange")) {
                    if (this.get("callContext"))
                        this.on("change", this.get("onchange"), this.get("callContext"));
                    else {
                        this.on("change", this.get("onchange"));
                    }
                }
                else this.on("change", this.inputChanged);
            },

            inputChanged: function() {
                console.log(arguments);
            }

        });

        return InputModel;
    }
);
