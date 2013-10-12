define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var InputFieldModel = Backbone.Model.extend({
            defaults: {
                type: "text"
            },
            initialize:function() {
                this.on("add", this.addModel);
            },

            addModel: function(model) {
                console.log("new model added: ");console.log(model);
            }
        });
        return InputFieldModel;
    }
);
