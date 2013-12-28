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
                this.$template = $(renderTemplate(modalTemplate, this.options));
                // configure a partial if it exists in the options
                if (this.options.partial) {
                    this.$template.find(".modal-body").append(this.options.partial);
                }
                // run initialize from options
                if (typeof this.options.initialize === "function") this.options.initialize.call(this);
                // now render
                this.render();
                return null;
            },

            render: function() {
                // now that the this.$template is ready, set the backbone el
                this.setElement(this.$template[0]); 
                document.body.appendChild(this.el);
                // disallow background scrolling
                $(document.body).addClass("noscroll");
                return null;
            },

            events: {
                "click .modal-close" : "closeModal"
            },
            
            closeModal: function() {
                this.remove();
                $(document.body).removeClass("noscroll");
                return null;
            }
            
        });
        return ModalView;
    }
);

