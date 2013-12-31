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
                return ({
                    transformation: function() {
                        this.matrix  = arguments[0];
                        this.time    = arguments[1];
                        return this;
                    },
                    transformations: []
                });
            },
            initialize: function() {

            }
        });
    
        return AnimatedObjectModel;
    }
);
