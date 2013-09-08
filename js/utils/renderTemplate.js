define(
    [
        "Handlebars"
    ],
    function(Handlebars) {
        return function(template, config) {
            var buffer = {}
            if (typeof template == "string") {
                buffer = Handlebars.compile(template)     
                return buffer(config);
            }
            else {
                return template(config);
            }
        }
    }
);
