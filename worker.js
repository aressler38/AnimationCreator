
postMessage("loading worker...");

onmessage = function(d) {
    //postMessage(JSON.stringify(d));
    if (d.data.message) {
        switch (d.data.message) {
            case "generateCSS": 
                postMessage(generateCSS(d.data.workerData));
                break;

            default:
                test();
        }
    }
}
function test() {
    postMessage("testing the default!");
}

function generateCSS(data) {
    var cssText = "";
    var vLen = data.vLen;
    var tLen = data.tLen;
    var transformations = data.transformations;
    var vendors = data.vendors;
    var percentage = 0;
    var tInitial = transformations[0].time;
    var matrix = transformations[0].cssMatrix;
    var duration = transformations[tLen-1].time - tInitial;                
    
    cssText += "div {border:2px solid red;}";
    for (var j=0; j<vLen; j++) {
        cssText += "\n@"+vendors[j]+"keyframes mymove {";
        for (var i=0; i<tLen; i++) {
            percentage = (transformations[i].time - tInitial) / duration;
            percentage = (percentage.toFixed(4)*100).toPrecision(4);
            matrix = transformations[i].cssMatrix;
            cssText += "\n    "+percentage+"% {"+vendors[j]+"transform: matrix("+matrix+");}";
        }
        cssText += "\n}";
    }

    
    cssText += "\n\n.animate {";
    for(var j=0; j<vLen; j++) {
        cssText += "\n    "+vendors[j]+"animation: mymove "+duration/1000+"s infinite;";
        cssText += "\n    "+vendors[j]+"transform: matrix("+matrix+");";
    }
    cssText += "\n}\n\n";

    return cssText;
}
