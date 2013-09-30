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

function generateCSS(data) {
    var cssText = "";
    var cssHelperText = "";
    var transformations = data.transformations;
    var tLen = transformations.length;
    var percentage = 0;
    var tInitial = transformations[0].time;
    var matrix = transformations[0].cssMatrix;
    var duration = transformations[tLen-1].time - tInitial;

    for (var j=0; j<vLen; j++) {
        cssText += "\n@"+vendors[j]+"keyframes mymove {";
        for (var i=0; i<tLen; i++) {
            percentage = (transformations[i].time - tInitial) / duration;
            percentage = (percentage.toFixed(4)*100).toPrecision(4);
            matrix = transformations[i].cssMatrix;
            cssText += "\n    "+percentage+"% {\n        "
                               +vendors[j]+"transform: matrix("+matrix+");\n"
                               +"    }";
        }
        cssText += "\n}";
    }

    for (var j=0; j<vLen; j++) {
        cssHelperText += "\n@"+vendors[j]+"keyframes testDuration {";
        for (var i=0; i<tLen; i++) {
            percentage = (transformations[i].time - tInitial) / duration;
            percentage = (percentage.toFixed(4)*100).toPrecision(4);
            cssHelperText += "\n    "+percentage+"% {\n"
                               +"        opacity: "+parseFloat((percentage/100).toPrecision(4))+";"
                               +"\n    }";
        }
        cssHelperText += "\n}";
    }

    cssHelperText += "\n\n.testhelper {\n";
    for(var j=0; j<vLen; j++) {
        cssHelperText += "\n    "+vendors[j]+"animation: testDuration "
                         +duration/1000+"s step-end "+"infinite;";
        cssHelperText += "\n    "+vendors[j]+"transform: matrix("+matrix+");";
    }
    cssHelperText += "\n}\n";
    
    cssText += "\n\n.animate {";
    for(var j=0; j<vLen; j++) {
        cssText += "\n    "+vendors[j]+"animation: mymove "+duration/1000+"s infinite;";
        cssText += "\n    "+vendors[j]+"transform: matrix("+matrix+");";
    }
    cssText += "\n}\n\n";

    return [cssText, cssHelperText];
}
