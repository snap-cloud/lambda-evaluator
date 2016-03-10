/*
    Utility methods for Autograding. These are functions which could be used in
    a few different places and don't have any dependencies.
*/

/****************************************************************************/
// Polyfills for useful functions.
// These must come first to be useful in the Autograder!
/****************************************************************************/
// String::format polyfill thing.
// http://stackoverflow.com/a/18405800
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match;
    });
  };
}

// Array::find for use in block searching
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
/****************************************************************************/


var AG_UTIL = {};

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
    options = options || {};
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

AG_UTIL.getIDE = function () {
    return world.children[0];
}

/*
    Take in a Snap! block spec which inputs show as variable names
    and remove them.
    e.g. "word $arrowRight list %'word'" => "word $arrowRight list %"
*/
AG_UTIL.normalizeSpec = function (spec) {
    if (!spec) {
        return '';
    }
    return spec.replace(/%['"]\w+['"]/gi, '%');
};

// Take in a blockSpec and return a PNG image of the block
// This is a URL that can be used in other HTML elements.
AG_UTIL.specToImage = function (spec) {
    var block = findBlockInPalette(spec);
    // TODO: investigate whether blob URIs will work.
    if (block) {
        return block.scriptPic().toDataURL();
    }
    return null;
};

/*
    Return an image tag from a given block spec.
    If no block is found, use a simple <code> element.
*/
AG_UTIL.HTMLFormattedBlock = function (spec) {
    var data = AG_UTIL.specToImage(spec),
        outString;
    if (data) {
        outString = '<img src="DATA" />';
    } else {
        outString = '<code>DATA</code>';
        data = spec;
    }
    return outString.replace('DATA', data);
};




/*
    A basic form of pluralization. 
    Note that it returns a new word.
    @param {string} word - the base word to turn into a plural
    @param {integer} count - amount of items to base the plural
    @return {string} - a word which has been pluralized.
*/
function pluralize(word, count) {
    if (count == 1) {
        return word;
    }
    if (word.match(/y$/i)) {
        return word.replace(/y$/i, 'ies');
    }
    return word + 's';
}

/*
    Like `pluralize` above, but prepend the value to the output.
    This is a short helper function which calls pluralize.
*/
function pluralizeWithNum(word, count) {
    return count + ' ' + pluralize(word, count);
}

/*****************************************************************************/

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
