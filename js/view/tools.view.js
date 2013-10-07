define( 
    [
        "jQuery",
        "underscore",
        "Backbone",
        "InputView",
        "ButtonView"
    ],
    function($, _, Backbone,
                InputView,
                ButtonView) 
    {

        var Tools = Backbone.View.extend({

            tagName:"div",

            views: [],

            initialize: function() {
                this.el.setAttribute("id", this.cid);
                this.collection = new Backbone.Collection();
    
    //            this.collection.on("change", this.collectionChange);
    //maybe set after it renders with initial stuff
 //               this.collection.on("add", this.addTool);
    
            },

            render: function() {
                var that = this;
                // render any current
                this.collection.each(function(model) {
                    that.initializeToolView(model);
                });
                _.each(this.views, function(view) {
                    console.log("rendering tool view: ");
                    console.log(view);
                    that.el.appendChild(view.el);                        
                });
                return this.el;
            },

            initializeToolView: function(toolModel) {
                var type = toolModel.get("type");
                if (typeof type === "undefined")
                    throw new Error("missing tool type in the tool model");
                 
                switch (type) {
                    case "button":
                       this.views.push(new ButtonView({model: toolModel}));
                    break;
                    case "text":
                       this.views.push(new InputView({model: toolModel}));
                    break;
                    default: 
                        throw new Error("unhandled tool type: "+type);
                }


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
