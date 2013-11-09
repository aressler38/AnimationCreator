function response(type, data) {
    postMessage({type:type, data:data});
    return null;
}

var vendors = ["-webkit-", "-moz-", ""],
    vLen=vendors.length;

onmessage = function(d) {
    var parsedD = (d.data && d.data.message ) ? d.data.message : "error";

    switch (parsedD) {
        case "generateCSS": 
            response("generateCSS", generateCSS(d.data.workerData));
            break;
        default:
            response("error", "no event handler");
    }
}

//TODO seperate the code that generates the animation for the query element. 
function generateCSS(data) {
    var cssText = "";
    var cssQueryText = "";
    var animationName = (data.animationName) ? data.animationName : "mymove";
    var animationClassName = (data.animationClassName) ? data.animationClassName : "animate";
    var animationIterationCount = (data.animationIterationCount) ? data.animationIterationCount : "infinite";//"1";
    var transformations = data.transformations;
    var tLen = transformations.length;
    var percentage = 0;
    var tInitial = transformations[0].time;
    var matrix = transformations[0].cssMatrix;
    var duration = transformations[tLen-1].time - tInitial;

    for (var j=0; j<vLen; j++) {
        cssText += "\n@"+vendors[j]+"keyframes "+animationName+ " {";
        for (var i=0; i<tLen; i++) {
            percentage = (transformations[i].time - tInitial) / duration;
            percentage = (percentage.toFixed(4)*100).toPrecision(4);
            matrix = transformations[i].cssMatrix;
            cssText += "\n    "+percentage+"% {\n        "
                               +vendors[j]+"transform: matrix3d("+matrix+");\n"
                               +"    }";
        }
        cssText += "\n}";
    }

    for (var j=0; j<vLen; j++) {
        cssQueryText += "\n@"+vendors[j]+"keyframes queryPercentage {";
        for (var i=0; i<tLen; i++) {
            percentage = (transformations[i].time - tInitial) / duration;
            percentage = (percentage.toFixed(4)*100).toPrecision(4);
            cssQueryText += "\n    "+percentage+"% {\n"
                               +"        opacity: "+parseFloat((percentage/100).toPrecision(4))+";"
                               +"\n    }";
        }
        cssQueryText += "\n}";
    }

    cssQueryText += "\n\n.animation-creator-query {\n";
    for(var j=0; j<vLen; j++) {
        cssQueryText += "\n    "+vendors[j]+"animation: queryPercentage "
            +duration/1000+"s step-end "+"infinite;"
            +"\n    "+vendors[j]+"transform: matrix3d("+matrix+");";
    }
    cssQueryText += "\n}\n";
    
    cssText += "\n\n."+animationClassName+" {";
    for(var j=0; j<vLen; j++) {
        cssText += "\n    "+vendors[j]+"animation: "+animationName+" "
                            +duration/1000+"s "+animationIterationCount+";"
                            +"\n    "+vendors[j]+"transform: matrix3d("+matrix+");";
    }
    cssText += "\n}\n\n";

    return [cssText, cssQueryText];
}
