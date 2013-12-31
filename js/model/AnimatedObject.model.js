// Name         : AnimatedObjectModel
// Description  : defines a view module for an animated object.

define(
    [
        "jQuery",
        "underscore",
        "Backbone"
    ],
    function($, _, Backbone) {
        var AnimatedObjectModel = Backbone.Model.extend({
            defaults: function() {
                var that = this;
                return ({
                    transformation: function() {
                        this.matrix  = arguments[0];
                        this.time    = arguments[1];
                        return this;
                    },
                    transformations: [],
                    tCounter: new function() {
                        var counter = 0;
                        return function(skip) {
                            counter = (counter + skip) % that.get("transformations").length;
                            return counter;
                        }
                    }
                });
            },
            initialize: function() {

            }
        });
    
        return AnimatedObjectModel;
    }
);
