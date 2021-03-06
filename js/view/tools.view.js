define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "InputView",
        "ButtonView",
        "SliderView"
    ],
    function($, _, Backbone,
                InputView,
                ButtonView,
                SliderView)
    {

        var Tools = Backbone.View.extend({

            tagName:"div",
            className:"tools-container",
            views: [],

            initialize: function() {
                this.el.setAttribute("id", this.cid);
                this.collection = new Backbone.Collection();

            },

            events: function() {
                /* Collection Events */
                this.collection.on("add", this.addTool, this);

                /* View Events */
                var events = new Object();
                return events;
            },

            render: function() {
                var that = this;
                return this.el;
            },

            initializeToolView: function(toolModel) {
                var type = toolModel.get("type");
                var toolView;
                if (typeof type === "undefined")
                    throw new Error("missing tool type in the tool model");

                switch (type) {
                    case "button":
                       toolView = new ButtonView({model: toolModel});
                    break;
                    case "text":
                       toolView = new InputView({model: toolModel});
                    break;
                    case "slider":
                        toolView = new SliderView({model: toolModel});
                    break;
                    default:
                        throw new Error("unhandled tool type: "+type);
                }
                this.views.push(toolView);
                return toolView;
            },

            collectionChange: function() {
                console.log(arguments);
            },

            addTool: function(model) {
                var toolView = this.initializeToolView(model);
                var paddingDiv = document.createElement("div");

                paddingDiv.setAttribute("class", "tool");
                paddingDiv.appendChild(toolView.el);
                this.el.appendChild(paddingDiv);
                
                // make the padding draggable
                if (model.get("type") !== "slider")
                    $(paddingDiv).draggable({containment: "parent", axis:"x"});
            }
        });

        return Tools;
    }
);
