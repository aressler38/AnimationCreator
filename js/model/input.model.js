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
                this.on("add", function(model) {console.log(model);});
            }
        });
        return InputFieldModel;
    }
);
