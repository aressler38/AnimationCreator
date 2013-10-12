define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {

        var Tools = Backbone.View.extend({

            tagName:"div",

            initialize: function() {
                this.collection = new Backbone.Collection();
                this.collection.on("change", this.collectionChange);
                this.collection.on("add", this.addTool);
            },

            render: function() {
                var that = this;
                // render any current
                this.collection.each(function(model) {

                });
                return this.el;
            },

            collectionChange: function() {
                console.log(arguments);
            },

            addTool: function(model) {

            }
        });

        return Tools;
    }
);
