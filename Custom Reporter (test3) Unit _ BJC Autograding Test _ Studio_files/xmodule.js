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

    return requireQueue(['https://d3vz9i37d3bazy.cloudfront.net/static/f9fe00f/js/cms-modules.4b71a115df03.js']);
});
