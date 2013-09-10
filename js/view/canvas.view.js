define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, underscore, Backbone, renderTemplate) {
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

            render: function() {
                this.model.get("target").html(this.el);
                this.drawAxes();
                return null;
            },

            drawAxes: function() {
                var width = this.model.get("width");
                var height = this.model.get("height");

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

            replay: function() {

                // requestAnimationFrame replay implementation 
                // currently no time checking is happening, but this method sucks anyway cause the animation
                // plays back slower..
                // suggest using the keyframe animation and listening to content changes

                var transformations = this.model.get("transformations"),
                    tLen = transformations.length;
                var tInitial = transformations[0].time
                var duration = transformations[tLen-1].time - tInitial;
                var matrix = transformations[0].cssMatrix;

                var $test = $(document.getElementById("test"));

                var counter = 0;
                console.log(tLen);

                var time;
                function draw(){
                    console.log(arguments)
                    var now = new Date().getTime(),
                        dt = now - (time || now);

                    time = now;

                    // Drawing code goes here... for example updating an 'x' position:
                   // this.x += 10 * dt; // Increase 'x' by 10 units per millisecond
                    $test.css({"-webkit-transform":"matrix("+transformations[counter].cssMatrix+")"});
                    counter++
                    if((counter<tLen)) 
                        window.requestAnimationFrame(draw);
                }
                draw();
            },

            animationEnd: function(e) {
            },

            // defaults for moving box on canvas
            boxDefaults: {
                width   : 50,
                height  : 50
            },

            animationStart: function(e) {
                this.model.set("transformations", []);
                var model = this.model;
                var transformations = model.get("transformations");
                var transformation = model.get("transformation");
                var context = this.context;
                var el = this.el;
                var boxWidth = this.boxDefaults.width;
                var boxHeight = this.boxDefaults.height;

                function drawBox(x,y) {
                    el.width = el.width; // reset canvas    
                    context.fillRect((x - boxWidth/2.0), (y - boxHeight/2.0) ,boxWidth, boxHeight);
                    context.lineTo(x,y);
                }
                function mouseMove (e) {
                    var time = new Date().getTime();
                    var offsets = $(this).offset();
                    var x = e.pageX - offsets.left;
                    var y = e.pageY - offsets.top;
                    var centerX = el.width/2.0
                    var centerY = el.height/2.0
                    drawBox(x,y);
                    // do more stuff!!!
                    savePath(x-centerX,y-centerY,time);
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
                    drawBox(x,y);
                    // do more stuff!!!
                    savePath(x-centerX,y-centerY,time);
                    renderPath();
                }
                function renderPath() {
                    var len = transformations.length;
                    var centerX = el.width/2.0
                    var centerY = el.height/2.0
                    context.beginPath();
                    for (var i=0; i<len; i++) {
                        context.lineTo(
                            centerX+transformations[i].cssMatrix[4], 
                            centerY+transformations[i].cssMatrix[5]
                        );
                    }
                    context.stroke();
                }
                function savePath(x,y,t) {
                    transformations.push(new transformation([1,0,0,1,x,y], t));
                }

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
