define(
    [
        "jQuery",
        "underscore",
        "Backbone", 
        "renderTemplate",
        "hbs!templates/modal"
    ],
    function($, _, Backbone, renderTemplate, modalTemplate) {
        var ModalView = Backbone.View.extend({
            initialize: function() {
                return renderTemplate(modalTemplate, this.options);
            },
            events: {}
            
            
        });
        return ModalView;
    }
);

