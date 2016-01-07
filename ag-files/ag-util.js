/*
    Utility methods for Autograding. These are functions which could be used in
    a few different places and don't have any dependencies.
*/


/** Give a nice visual display to a list, including showing nesting.
 *  The Default is for a console, but you can supply HTML strings for parameters
 *
 *  OPTIONS Defaults:
 *    {
 *        separator: ',',
 *        indent: '\t',
 *        newline: '\n',
 *        start: '[',
 *        end: ']'
 *    }
 *  For example [1, 2, 3] becomes: '[\n\t1,\n\t2,\n\t3\n]'
 *  Use `console.log` to see the output.
 *  @param {array} items - the array to format as a nice string
 *  @param {object} options - control paramters for separating elements
 */
function arrayFormattedString(items, options) {
    if (items.constructor !== Array) {
        return items;
    }
    var separator, indent, newline, start, end, content;
    
    separator = options.separator || ',';
    indent = options.indent || '\t';
    newline = (options.newline || '\n') + indent;
    start = options.start || '[';
    end = options.end || ']';
    
    content = items.map(function (item) {
        return arrayFormattedString(item, options);
    });
    return start + newline + content.join(separator + newline) +
        newline.replace(indent, '') + end; // replace(): un-indent 1 level.
}






/*!
    query-string
    Parse and stringify URL query strings
    https://github.com/sindresorhus/query-string
    by Sindre Sorhus
    MIT License
*/
var queryString = {};

queryString.parse = function (str) {
    if (typeof str !== 'string') {
        return {};
    }

    str = str.trim().replace(/^(\?|#)/, '');

    if (!str) {
        return {};
    }

    return str.trim().split('&').reduce(function (ret, param) {
        var parts = param.replace(/\+/g, ' ').split('=');
        var key = parts[0];
        var val = parts[1];

        key = decodeURIComponent(key);
        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);

        if (!ret.hasOwnProperty(key)) {
            ret[key] = val;
        } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
        } else {
            ret[key] = [ret[key], val];
        }

        return ret;
    }, {});
};

queryString.stringify = function (obj) {
    return obj ? Object.keys(obj).map(function (key) {
        var val = obj[key];

        if (Array.isArray(val)) {
            return val.map(function (val2) {
                if (!val2) { // Mod: Don't have =null values in URL params
                    return encodeURIComponent(key);
                }
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }

        if (!val) { // Mod: Don't have =null values in URL params
            return encodeURIComponent(key);
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
};

