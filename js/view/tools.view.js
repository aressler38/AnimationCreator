define( 
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {

        var Tools = Backbone.View.extend({

            initialize: function() {
                this.collection = new Backbone.Collection();
                this.collection.on("change", this.collectionChange);
            },

            render: function() {
                var that = this;
                this.collection.each(function(model) {
                     
                });
            },

            collectionChange: function() {
                console.log(arguments);
            }
            
        });

        return Tools;
    }
);
