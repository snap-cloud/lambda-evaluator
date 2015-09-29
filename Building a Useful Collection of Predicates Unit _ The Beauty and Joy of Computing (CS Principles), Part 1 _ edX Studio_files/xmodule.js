define(["jquery", "underscore", "codemirror", "tinymce",
        "jquery.tinymce", "jquery.qtip", "jquery.scrollTo", "jquery.flot",
        "jquery.cookie",
        "utility"],
       function($, _, CodeMirror, tinymce) {
    window.$ = $;
    window._ = _;
    require(['mathjax']);
    window.CodeMirror = CodeMirror;
    window.RequireJS = {
        'requirejs': requirejs,
        'require': require,
        'define': define
    };
    /**
     * Loads all modules one-by-one in exact order.
     * The module should be used until we'll use RequireJS for XModules.
     * @param {Array} modules A list of urls.
     * @return {jQuery Promise}
     **/
    var requireQueue = function(modules) {
        var deferred = $.Deferred();
        var loadScript = function (queue) {
            // Loads the next script if queue is not empty.
            if (queue.length) {
                require([queue.shift()], function() {
                    loadScript(queue);
                });
            } else {
                deferred.resolve();
            }
        };

        loadScript(modules.concat());
        return deferred.promise();
    };

    return requireQueue(['https://d37djvu3ytnwxt.cloudfront.net/static/d98510e/js/cms-modules.741dc7465f70.js']);
});
