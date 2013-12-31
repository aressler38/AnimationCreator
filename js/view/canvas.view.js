define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, underscore, Backbone) {
        var CanvasView = Backbone.View.extend({

            tagName: "canvas",

            initialize: function() {
                this.el.setAttribute("id", this.model.get("id"));
                this.el.setAttribute("width", this.model.get("width"));
                this.el.setAttribute("height", this.model.get("height"));

                this.context = this.el.getContext("2d");
            },
            
            events: function() {
                var events = new Object();
                events["touchstart"] = "animationStart";
                events["touchend"]   = "animationEnd";
                events["mousedown"]  = "animationStart";
                events["mouseup"]    = "animationEnd";
                return events;
            },

            render: function(target) {
                this.drawAxes();
                return this.el;
            },

            drawAxes: function() {
                var width = this.model.get("width");
                var height = this.model.get("height");
                // first clear the canvas
                this.el.setAttribute("width", width); 

                this.context.beginPath();
                this.context.moveTo(width/2.0, height);
                this.context.lineTo(width/2.0, 0);
                this.context.stroke();
                this.context.beginPath();
                this.context.moveTo(0, height/2.0);
                this.context.lineTo(width, height/2.0);
                this.context.stroke();
                var img = this.el.toDataURL()

                // make the axes permanent by setting the background-image
                this.$el.css({
                    "background-image" : "url("+img+")",
                    "background-repeat": "no-repeat"
                });
            },

            animationEnd: function(e) {
                this.model.trigger("change:transformations", this.model.get("transformations"));
                this.$el.removeClass("animation-creator-canvas-active");
                return null;
            },

            // defaults for moving box on canvas
            boxDefaults: {
                width   : 5,
                height  : 5
            },

            animationStart: function(e) {
                var model = this.model;
                var transformations = model.get("transformations");
                var transformation = model.get("transformation");
                var context = this.context;
                var el = this.el;
                var boxWidth = this.boxDefaults.width;
                var boxHeight = this.boxDefaults.height;
                var offsets = $(el).offset();
                var xRelative = e.pageX - offsets.left - el.width/2.0;
                var yRelative = e.pageY - offsets.top - el.height/2.0;

                function drawBox(x,y) {
                    // reset canvas    
                    el.width = el.width;
                    context.fillRect((x - boxWidth/2.0), (y - boxHeight/2.0), boxWidth, boxHeight);
                }

                function mouseMove (e) {
                    e.preventDefault();
                    var time = new Date().getTime();
                    var offsets = $(this).offset();
                    var x = e.pageX - offsets.left;
                    var y = e.pageY - offsets.top;
                    var centerX = el.width/2.0;
                    var centerY = el.height/2.0;
                    var xRelative = x - centerX;
                    var yRelative = y - centerY;

                    drawBox(x,y);
                    savePath(xRelative,yRelative,time);
                    renderPath();
                }
                function touchMove (e) {
                    e.preventDefault();
                    var time = new Date().getTime();
                    var offsets = $(this).offset();
                    var x = e.touches[0].pageX - offsets.left;
                    var y = e.touches[0].pageY - offsets.top;
                    var centerX = el.width/2.0
                    var centerY = el.height/2.0
                    var xRelative = x - centerX;
                    var yRelative = y - centerY;

                    drawBox(x,y);
                    savePath(xRelative,yRelative,time);
                    renderPath();
                }
                function renderPath(x,y) {
                    var len = transformations.length;
                    var centerX = el.width/2.0
                    var centerY = el.height/2.0
                    
                    context.beginPath();
                    for (var i=0; i<len-1; i++) {
                        context[transformations[i].type](
                            centerX+transformations[i].matrix[12], 
                            centerY+transformations[i].matrix[13]
                        );
                    }
                    context.stroke();
                }

                function savePath(x,y,t) {
                    transformations.push(new transformation(
                        [1,0,0,0, 
                         0,1,0,0,
                         0,0,1,0, // interesting.. I require a 1 in this row3col3... det != 0
                         x,y,0,1], t, "lineTo"));
                }

                e.preventDefault();
                this.$el.addClass("animation-creator-canvas-active");

                transformations.push(new transformation(
                    [1,0,0,0, 
                     0,1,0,0,
                     0,0,1,0,
                     xRelative,yRelative,0,1], new Date().getTime(), "moveTo"));

                el.addEventListener("mousemove", mouseMove);
                el.addEventListener("touchmove", touchMove);
                el.addEventListener("mouseup", function() {
                    el.removeEventListener("mousemove", mouseMove);    
                });
            }
        });
        return CanvasView;
    }
);
