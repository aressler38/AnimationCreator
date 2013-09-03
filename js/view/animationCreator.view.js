define(
    [
        "jQuery",
        "underscore",
        "Backbone",
    ],
    function($, underscore ,Backbone) {
        var AnimationCreatorView = Backbone.View.extend({
            className: "animation-creator",

            tagName: "canvas",
            
            initialize: function() {
                this.el.setAttribute("id", this.model.get("id"));
                this.el.setAttribute("width", this.model.get("width"));
                this.el.setAttribute("height", this.model.get("height"));

                this.context = this.el.getContext("2d");

                // line up the target
                this.model.get("target").css({width: this.el.width});
                this.model.get("target").css({height: this.el.height});
            },
            
            events: function() {
                var events = new Object();
                events["touchstart"] = "touchStart";               
                events["mousedown"] = "mouseStart";
                events["mouseup"] = "mouseEnd";
                return events;
            },
            
            render: function() {
                console.log('rendering');
                this.model.get("target").html(this.el);
                this.drawAxes();
                return this.$el;
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

            generateCSS: function() {
                var transformations = this.model.get("transformations");
                var len = transformations.length;
                var styleSheet = document.getElementById("styleTest");
                var tInitial = transformations[0].time
                var duration = transformations[len-1].time - tInitial;                
                var matrix = transformations[0].cssMatrix;
                var percentage = 0;
                
                styleSheet.innerHTML  = "";


                styleSheet.innerHTML = "div {border:2px solid red;}";
                styleSheet.innerHTML += "\n@-webkit-keyframes mymove {";

                for (var i=0; i<len; i++) {
                    percentage = (transformations[i].time - tInitial) / duration;
                    percentage = (percentage.toFixed(4)*100).toPrecision(4);
                    matrix = transformations[i].cssMatrix;
                    styleSheet.innerHTML += "\n"+percentage+"% {-webkit-transform:matrix("+matrix+");}"
                }
                styleSheet.innerHTML += "\n}";
                styleSheet.innerHTML += "\n\n.animate {\n-webkit-animation: mymove "+duration/1000+"s \n}";


                // TODO: testing...
                document.body.appendChild(styleSheet);
                var test =  document.getElementById("test");
                $(test).addClass("animate");
                document.getElementById("text").innerHTML = styleSheet.innerHTML;
                this.model.set("transformations", []);
                console.log(styleSheet.innerHTML);
            },

            mouseEnd: function(e) {
                this.generateCSS();
            },
            
            // defaults for moving box on canvas
            boxDefaults: {
                width   : 50,
                height  : 50
            }, 
            
            touchStart: function(e) {
                console.log(e);
            },

            mouseStart: function(e) {
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
                el.addEventListener("mouseup", function() {
                    el.removeEventListener("mousemove", mouseMove);    
                });
            }


        });
        return AnimationCreatorView;
    }
);
