define(
    [
        "jQuery",
        "underscore",
        "Backbone",
        "renderTemplate",
        "hbs!templates/test"
    ],
    function($, underscore, Backbone, renderTemplate, template) {
        var AnimationCreatorView = Backbone.View.extend({
            className: "animation-creator",

            tagName: "canvas",

            initialize: function() {
                this.el.setAttribute("id", this.model.get("id"));
                this.el.setAttribute("width", this.model.get("width"));
                this.el.setAttribute("height", this.model.get("height"));

                this.subProcess = new Worker("./worker.js");
                this.context = this.el.getContext("2d");
                this.loadIcon = document.createElement("div");

                // line up the target
                this.model.get("target").css({width: this.el.width});
                this.model.get("target").css({height: this.el.height});

                var templateConfig = {
                    name:"fred",
                    age: 59,
                    food: "cheese sticks"
                }   

                var stuff = renderTemplate(template, templateConfig);
                $("#mybox").html(stuff);

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
                console.log('rendering');
                this.model.get("target").html(this.el);
                this.drawAxes();
                document.body.appendChild(this.loadIcon);
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

            spinerIcon: {
                on:function(){
                    $(this.loadIcon).addClass("animation-creator-loading"); 
                },
                off: function(){
                    $(this.loadIcon).removeClass("animation-creator-loading"); 
                }
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

            generateCSS: function() {
                var transformations = this.model.get("transformations"),
                    tLen = transformations.length;
                var styleSheet = document.getElementById("styleSheet");
                var styleSheetHelper = document.getElementById("styleSheetHelper");
                var tInitial = transformations[0].time
                var duration = transformations[tLen-1].time - tInitial;
                var matrix = transformations[0].cssMatrix;
                var percentage = 0;
                var vendors = ["-webkit-", "-moz-", ""],
                    vLen=vendors.length;
                var that = this;

                var workerData = {
                    vLen: vLen,
                    tLen: tLen,
                    transformations: transformations,
                    vendors: vendors,
                }

                function processCSS (d) {
                    styleSheet.innerHTML = d.data[0];
                    styleSheetHelper.innerHTML = d.data[1];
                    that.spinerIcon.off.call(that);
                    $("#test").addClass("animate");
                    $("#testhelper").addClass("testhelper");
                    document.getElementById("text").innerHTML = styleSheet.innerHTML;
                    document.getElementById("text").innerHTML += styleSheetHelper.innerHTML;
                    this.removeEventListener("message", processCSS);
                }

                // TODO: testing...
                this.spinerIcon.on.call(this);
                this.subProcess.addEventListener("message", processCSS);
                this.subProcess.postMessage({message:"generateCSS", workerData:workerData});
                $("#test").removeClass("animate");
                $("#testhelper").removeClass("testhelper");

                this.styleSheet = styleSheet;
                this.styleSheetHelper = styleSheetHelper;
            },

            query: function() {
                var styleSheetHelper = this.styleSheetHelper;
                var styleSheet = this.styleSheet;
                var percentage = parseFloat($("#testhelper").css("opacity"));

                cssPercentage = (percentage.toFixed(4)*100).toPrecision(4)
                opacityPercentage = ((percentage.toFixed(4)*100).toPrecision(4)/100).toPrecision(4);
                opacityPercentage = parseFloat(opacityPercentage);

                if (styleSheet.innerHTML.match(cssPercentage)) {
                    console.log('matched!');
                }
                else {
                    console.log("failed match");
                    console.log("your query: "+cssPercentage);
                    console.log(styleSheetHelper.innerHTML);
                    throw new Error("failed query");
                }
                return cssPercentage;
            },

            animationEnd: function(e) {
                if (this.model.get("transformations")[0]) this.generateCSS();
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
            },
            
            matrixMultiplication: function(A, B) {
                /* defined as:
                 *
                 *     [ a11 a12 a13 ]       [ b11 b12 b13 ]
                 * A = [ a21 a22 a23 ] , B = [ b21 b22 b23 ]
                 *
                 *      [ a11b11+a12b21   a11b12+a12b22   a13+b13]
                 * AB = [ a21b11+a22b21   a21b12+a22b22   a23+b23]
                 *  
                 *  where the mapping to the argument A is A := [a11,a12,a21,a22,a13,a23], or indexed A := [0,1,4,2,3,5]
                 *  note: first 2 columns treated as standard 2x2 matrix -- multiplication as usual, 3rd columns add
                */

                return [ (A[0]*B[0]+A[1]*B[2]), (A[0]*B[1]+A[1]*B[3]), (A[2]*B[0]+A[3]*B[2]), (A[2]*B[1]+A[3]*B[3]), (A[4]+B[4]), (A[5]+B[5]) ];
            }


        });
        return AnimationCreatorView;
    }
);
