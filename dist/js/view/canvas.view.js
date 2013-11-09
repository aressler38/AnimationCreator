AnimationCreator.define(["jQuery","underscore","Backbone"],function(e,t,n){var r=n.View.extend({tagName:"canvas",initialize:function(){this.el.setAttribute("id",this.model.get("id")),this.el.setAttribute("width",this.model.get("width")),this.el.setAttribute("height",this.model.get("height")),this.context=this.el.getContext("2d")},events:function(){var e=new Object;return e.touchstart="animationStart",e.touchend="animationEnd",e.mousedown="animationStart",e.mouseup="animationEnd",e},render:function(e){return this.drawAxes(),this.el},drawAxes:function(){var e=this.model.get("width"),t=this.model.get("height");this.context.beginPath(),this.context.moveTo(e/2,t),this.context.lineTo(e/2,0),this.context.stroke(),this.context.beginPath(),this.context.moveTo(0,t/2),this.context.lineTo(e,t/2),this.context.stroke();var n=this.el.toDataURL();this.$el.css({"background-image":"url("+n+")","background-repeat":"no-repeat"})},animationEnd:function(e){return this.model.trigger("change:transformations",this.model.get("transformations")),this.$el.removeClass("animation-creator-canvas-active"),null},boxDefaults:{width:5,height:5},animationStart:function(t){function h(e,t){o.width=o.width,s.fillRect(e-u/2,t-a/2,u,a)}function p(t){t.preventDefault();var n=(new Date).getTime(),r=e(this).offset(),i=t.pageX-r.left,s=t.pageY-r.top,u=o.width/2,a=o.height/2,f=i-u,l=s-a;h(i,s),m(f,l,n),v()}function d(t){t.preventDefault();var n=(new Date).getTime(),r=e(this).offset(),i=t.touches[0].pageX-r.left,s=t.touches[0].pageY-r.top,u=o.width/2,a=o.height/2,f=i-u,l=s-a;h(i,s),m(f,l,n),v()}function v(e,t){var n=r.length,i=o.width/2,u=o.height/2;s.beginPath();for(var a=0;a<n-1;a++)s[r[a].type](i+r[a].cssMatrix[12],u+r[a].cssMatrix[13]);s.stroke()}function m(e,t,n){r.push(new i([1,0,0,0,0,1,0,0,0,0,1,0,e,t,0,1],n,"lineTo"))}var n=this.model,r=n.get("transformations"),i=n.get("transformation"),s=this.context,o=this.el,u=this.boxDefaults.width,a=this.boxDefaults.height,f=e(o).offset(),l=t.pageX-f.left-o.width/2,c=t.pageY-f.top-o.height/2;t.preventDefault(),this.$el.addClass("animation-creator-canvas-active"),r.push(new i([1,0,0,0,0,1,0,0,0,0,1,0,l,c,0,1],(new Date).getTime(),"moveTo")),o.addEventListener("mousemove",p),o.addEventListener("touchmove",d),o.addEventListener("mouseup",function(){o.removeEventListener("mousemove",p)})}});return r});