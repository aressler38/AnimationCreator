// Name         : AnimatedObjectView
// Description  : defines a view module for an animated object.

define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var vendors = ["-webkit-", "-moz-", ""];
        var AnimatedObjectView = Backbone.View.extend({
            tagName: function() {
                var tagName = this.model.get("tagName");
                if (tagName !== undefined) return tagName;
                else return "div";
            },
            initialize: function() {
                var DOMAttributes   = this.model.get("DOMAttributes");
                for (var attr in DOMAttributes)
                    if (DOMAttributes.hasOwnProperty(attr))
                        this.el.setAttribute(attr, DOMAttributes[attr]);
                if (this.options.offset !== undefined) {
                    this.$el.css({top: this.options.offset.y, left: this.options.offset.x});
                }
                this.$el.addClass("animated-object");
                this.matrixCounter = 0;
            },
            // Apply matrix to this.el
            apply3DMatrix: function(matrix) {
                vendors.forEach(function(vendor) {
                    this.$el.css(vendor+"transform", "matrix3d("+matrix+")");    
                }, this);
            },

            applyNextMatrix: function() {
                var transformations = this.model.get("transformations");
                this.apply3DMatrix(transformations[(this.matrixCounter++) % transformations.length]);
            },
            
            getMaxTransformTime: function() {
                var t = this.model.get("transformations"); 
                return t[t.length-1].time;
            },
            
            getMinTransformationTime: function() {
                return this.model.get("transformations")[0].time;
            },
            
            getDeltaTransformationTime: function() {
                return (this.getMaxTransformationTime() - this.getMinTransformationTime());
            }

        });
    
        return AnimatedObjectView;
    }
);
