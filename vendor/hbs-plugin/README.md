# hbs-plugin

A [RequireJS](http://requirejs.org)/AMD loader plugin for loading handlebars template
resources.

This is based on the text plugin here: https://github.com/requirejs/text

Example:

require(
["hbs!templates/mytemplate.hbs"],
function(template){

    var templateConfig = {test:"test"};
    document.write(template(templateConfig));
});


## License

Dual-licensed -- new BSD or MIT.

