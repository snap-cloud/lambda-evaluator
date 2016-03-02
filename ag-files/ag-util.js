/*
    Utility methods for Autograding. These are functions which could be used in
    a few different places and don't have any dependencies.
*/

// String::format polyfill thing.
// http://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript
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

/*
    This returns the instance of a Snap! block
    NOTE: this is different than findBlockInPalette
    This returns the `.definition` property.
    TODO: consolidate code between those functions.
*/
AG_UTIL.findCustomBlock = function (searchSpec) {
    var ide = AG_UTIL.getIDE(), blockInstance;
    
    // Takes in a Custom*BlockMorph object and tests against searchSpec
    // templateInstance() is a Snap! method that generates a 'copy'
    // of the block.
    function matchingBlock(block) {
        var spec, spriteBlocks, allCustom; 
        
        spec = AG_UTIL.normalizeSpec(block.spec);
        if (blockSpecMatch(spec, searchSpec)) {
            return true;
        }
        return false;
    }
    
    // Search Global Custom Blocks
    blockInstance = ide.stage.globalBlocks.find(matchingBlock);
    if (blockInstance) {
        return blockInstance.templateInstance();
    }
    spriteBlocks = ide.sprites.contents.map(function (sprite) {
        return sprite.customBlocks;
    });
    allCustom = Array.prototype.concat(
        [], ide.stage.customBlocks, spriteBlocks
    );
    blockInstance = allCustom.find(matchingBlock);
    if (blockInstance) {
        return blockInstance.templateInstance();
    }
    return null;
};

AG_UTIL.specToImage = function (spec) {
    var block = AG_UTIL.findCustomBlock(spec);
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
