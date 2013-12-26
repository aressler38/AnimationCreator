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
                var $template = $(renderTemplate(modalTemplate, this.options));
                this.setElement($template[0]); 
                this.render();
                return null;
            },

            render: function() {
                document.body.appendChild(this.el);
                this.$el.find(".modal-body").on("scroll", this.scroll);
                $(document.body).addClass("noscroll");
                return null;
            },

            events: {
                "click .modal-close" : "closeModal"
            },
            
            closeModal: function() {
                this.remove();
                this.$el.find(".modal-body").off("scroll", this.scroll);
                $(document.body).removeClass("noscroll");
            },
            
            scroll: function(event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
        });
        return ModalView;
    }
);

