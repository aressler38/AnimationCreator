function response(e,t){return postMessage({type:e,data:t}),null}function generateCSS(e){var t="",n="",r=e.animationName?e.animationName:"mymove",i=e.animationIterationCount?e.animationIterationCount:"infinite",s=e.transformations,o=s.length,u=0,a=s[0].time,f=s[0].cssMatrix,l=s[o-1].time-a;for(var c=0;c<vLen;c++){t+="\n@"+vendors[c]+"keyframes "+r+" {";for(var h=0;h<o;h++)u=(s[h].time-a)/l,u=(u.toFixed(4)*100).toPrecision(4),f=s[h].cssMatrix,t+="\n    "+u+"% {\n        "+vendors[c]+"transform: matrix3d("+f+");\n"+"    }";t+="\n}"}for(var c=0;c<vLen;c++){n+="\n@"+vendors[c]+"keyframes queryPercentage {";for(var h=0;h<o;h++)u=(s[h].time-a)/l,u=(u.toFixed(4)*100).toPrecision(4),n+="\n    "+u+"% {\n"+"        opacity: "+parseFloat((u/100).toPrecision(4))+";"+"\n    }";n+="\n}"}n+="\n\n.animation-creator-query {\n";for(var c=0;c<vLen;c++)n+="\n    "+vendors[c]+"animation: queryPercentage "+l/1e3+"s step-end "+"infinite;"+"\n    "+vendors[c]+"transform: matrix3d("+f+");";n+="\n}\n",t+="\n\n.animate {";for(var c=0;c<vLen;c++)t+="\n    "+vendors[c]+"animation: "+r+" "+l/1e3+"s "+i+";"+"\n    "+vendors[c]+"transform: matrix3d("+f+");";return t+="\n}\n\n",[t,n]}var vendors=["-webkit-","-moz-",""],vLen=vendors.length;onmessage=function(e){var t=e.data&&e.data.message?e.data.message:"error";switch(t){case"generateCSS":response("generateCSS",generateCSS(e.data.workerData));break;default:response("error","no event handler")}};