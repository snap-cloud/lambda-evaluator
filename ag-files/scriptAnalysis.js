/* Snap block getters and setters used to retrieve blocks,
 * set values, and initiates blocks.
 */

// TODO: Make this robut and use .at(), but changes indexing.
function getSprite(index) {
    try {
        return world.children[0].sprites.contents[index];
    } catch(e) {
        throw "Sprite: " + index + " was not found."
    }
}

// Returns the scripts of the sprite at 'index', undefined otherwise.
function getScripts(index) {
    var sprite = getSprite(index);
    return sprite.scripts.children;
}

// Get just the most recently touched block that matches
function getScript(blockSpec, spriteIndex) {
    return getAllScripts(blockSpec, spriteIndex)[0];
}

function getAllScripts(blockSpec, spriteIndex) {
    // TODO: Consider expanding to grab from additional sprites
    // Try to get a sprite's scripts
    // Throw exception if none exist.
    spriteIndex = spriteIndex === undefined ? 0 : spriteIndex;

    var scripts = getScripts(spriteIndex);
    // If no scripts, throw an exception.
    if (scripts.length === 0) {
        throw "Block/script not found."
    }

    // Try to return the first block matching 'blockSpec'.
    // Throw exception if none exist/
    var validScripts = scripts.filter(function (morph) {
        // if (morph.selector) {
        //    // TODO: consider adding selector type check (morph.selector === "evaluateCustomBlock")
        //     return (morph.blockSpec === blockSpec);
        // }
        if (morph.selector) {
            return blockSpecMatch(morph.blockSpec, blockSpec);
        }
    });

    if (validScripts.length === 0) {
        throw "The target block/script (" +
            blockSpec.replace(/%[a-z]/g, "[]") +
            ") is not in script window.";
    }
    return validScripts;
}

/* Takes in two strings TARGETBLOCKSPEC and TEMPLATEBLOCKSPEC. The only difference is that
 * TARGETBLOCKSPEC will be a more specific version. For example, if TEMPLATEBLOCKSPEC is
 * "factorial %", then TARGETBLOCKSPEC could be something like "factorial %n", where the
 * only difference is the "n" character following the "%" character.
 */
function blockSpecMatch(targetBlockSpec, templateBlockSpec) {
    var targetSplit = targetBlockSpec.split(" ");
    var templateSplit = templateBlockSpec.split(" ");
    var symbols = ["%s", "%n", "%b", "%c", "%p", "%txt", "%repRing", "%mult%L", "%mult%l", "%exp", "%l", "%words", "%idx", "%(ringified)", "%upvar", "%cs", "%scriptVars", "predRing", "delim"];
    if (targetSplit.length !== templateSplit.length) {
        return false;
    }
    for (var i = 0; i < templateSplit.length; i++) {
        var templateStr = templateSplit[i];
        var targetStr = targetSplit[i];
        if (templateStr !== targetStr) {
            if (templateStr.length > 1) {
                return false;
            }
            if (templateStr[0] !== targetStr[0]) {
                return false;
            }
            if (symbols.indexOf(targetStr) === -1) {
                return false;
            }
        }
    }
    return true;
}

/* Gets all of the indices of a certain character TARGET in a word WORD in an array.
 * I got this from StackOverflow at http://stackoverflow.com/questions/5034442/
 * indexes-of-all-occurrences-of-character-in-a-string
 */
function getCharIndices(target, word) {
    var result = [];
    var index = word.indexOf(target);
    while (index >= 0) {
        result.push(index);
        index = word.indexOf(target, index + 1);
    }
    return result;
}

/* Takes in a string version of a JSONified SCRIPT (JSONtoString), which can be 
* a general template or an exact script, a spriteIndex, and optional 
* SCRIPTVARIABLES (an array) (which along with SCRIPT can be obtained when 
* calling fastTemplate()).
*
* Returns true if the given SCRIPT is found in any script in the Scripts 
* tab of the given sprite. See documentation of checkTemplate for more details.
*/
function scriptPresentInSprite(script, spriteIndex, scriptVariables) {
   // Populate optional parameters
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    if (scriptVariables === undefined) {
        scriptVariables = [];
    }

    var JSONtemplate = stringToJSON(script);
    var blockSpec = JSONtemplate[0].blockSp;
   // Handle case when no scripts present on stage.
    try {
        var JSONtarget;
        var scriptsOnScreen = getAllScripts(blockSpec, spriteIndex);
        var isPresent;
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            if (JSONtarget[0].blockSp === blockSpec) {
                isPresent = checkTemplate(JSONtemplate, JSONtarget, scriptVariables);
                if (isPresent) {
                    return true;
                }
            }
        }
    } catch(e) {
        return false;
    }
    return false;
}

/* Returns true if a reporter block is composed of only text morphs. Takes in
 * BLOCK is the raw JavaScript morph that we will loop through to check all of
 * its children and make sure that all of its morphs are text morphs. */
function reporterHasNoInputs(block) {
    if (block === undefined) {
        return false;
    }
    if (!(block instanceof ReporterBlockMorph)) {
        return false;
    }
    var morph;
    try {
        for (var i = 0; i < block.children.length; i++) {
            morph = block.children[i];
            if (!(morph instanceof StringMorph)) {
                return false;
            }
        }
    } catch(e) {
        return false;
    }
    return true;
}

/* Takes in a single block and converts it into JSON format.
 * For example, will take in a block like:
 *
 * "move (23) steps"
 *
 * and will convert it into JSON format as:
 *
 * [{blockSp: "move %n steps",
 *   inputs: ["23"]}]
 *
 *
 *
 * Say we have an If/Else statement like so:
 *
 *  if (5 = (3 + 4)):
 *      move (4 + (2 x 3)) steps
 *  else:
 *      move (4 - 3) steps
 *
 *
 * This will get turned into the JSON format as follows:
 *
 * [{blockSp: "if %b %c else %c",
 *    inputs: [{blockSp: "%s = %s",
 *              inputs: ["5", {blockSp: "%n + %n",
 *                            inputs: ["3", "4"]}]},
 *             {blockSp: "move %n steps",
 *              inputs: ["4, {blockSp: "%n + %n",
 *                            inputs: ["2", "3"]}]},
 *
 *              {blockSp: "move %n steps",
 *              inputs: [{blockSp: "%n - %n",
 *                        inputs: ["4", "3"]}]}
 *            ]
 *  }
 * ]
 */
function JSONblock(block) {
    // TODO: Switch to `instanceof` instead of checking __proto__
    if ((block === undefined) || (block === null)) {
        throw "block is undefined";
    }
    var blockArgs = [];
    var morph;
    for (var i = 0; i < block.children.length; i++) {
        morph = block.children[i];
        if (morph.selector === "reportGetVar") {
            blockArgs.push(morph.blockSpec);
        } else if ((morph.__proto__.constructor.name === "RingReporterSlotMorph")
                    || (morph.__proto__.constructor.name === "RingCommandSlotMorph")) {
            if (morph.children[0].children.length === 0) {
                blockArgs.push("");
            } else {
                blockArgs.push(JSONblock(morph.children[0]));
            }
        } else if ((morph.hasOwnProperty("type")) && (morph.type === "list")) {
            blockArgs.push("");
         } else if (morph.__proto__.constructor.name === "MultiArgMorph") {
             for (var j = 1 ; j < morph.children.length - 1; j++) {
                 if (morph.children[j].__proto__.constructor.name === "InputSlotMorph") {
                     blockArgs.push(morph.children[j].children[0].text);
                } else if (morph.children[j].__proto__.constructor.name === "TemplateSlotMorph") {
                    if (reporterHasNoInputs(morph.children[j].children[0])) {
                        blockArgs.push(morph.children[j].children[0].blockSpec);
                    } else {
                        blockArgs.push(JSONblock(morph.children[j].children[0]));
                    }
                } else if (morph.children[j] instanceof ReporterBlockMorph) {
                    blockArgs.push(JSONblock(morph.children[j]));
                }
             }
         } else if (morph.selector === "reportTrue" || morph.selector === "reportFalse") {
            blockArgs.push(morph.blockSpec);
        } else if (morph.__proto__.constructor.name === "InputSlotMorph") {
            blockArgs.push(morph.children[0].text);
        } else if (morph instanceof CSlotMorph) {
            if (morph.children.length === 0) {
                blockArgs.push([]);
            } else {
                blockArgs.push(JSONscript(morph.children[0]));
            }
        } else if (morph instanceof ReporterBlockMorph) {
            if (reporterHasNoInputs(morph)) {
                blockArgs.push(morph.blockSpec);
            } else {
                blockArgs.push(JSONblock(morph));
            }
        }
    }

    return {
        blockSp: block.blockSpec,
        inputs: blockArgs
    };
}

/* Takes in a custom block and converts it to JSON format. For example,
 * if we have a factorial block like this on the screen:
 *
 * "factorial (5)"
 *
 * with a body like this:
 *
 * factorial (n) {
 *     if (n === 0) {
 *         return 1;
 *     }
 *     else {
 *         return n * factorial(n - 1);
 *     }
 *
 * Then we get a JavaScript object that looks like this:
 *
 * [{blockSp: "factorial %n",
 *   inputs: ["5"],
 *   body: [{blockSp: "if %b %c else %c",
 *    inputs: [{blockSp: "%s = %s",
 *              inputs: ["n", "1"]},
 *             {blockSp: "report %s",
 *              inputs: ["1"]},
 *              {blockSp: "report %s",
 *              inputs: [{blockSp: "%n x %n",
 *                        inputs: ["n", {blockSp: "factorial %n",
 *                                       inputs: ["n", 1]}]}]}]}
 * ]}]
 */
function JSONcustomBlock(block) {
    if ((block === undefined) || (block === null)) {
        // FIXME: throw new Error()
        throw "Custom block definition not found.";
    }
    var resultJSONblock = JSONblock(block);
    var JSONbody = JSONscript(block.definition.body.expression);
    var inputs = block.definition.body.inputs;
    var JSONinputs = [];
    for (var i = 0; i < inputs.length; i++) {
        JSONinputs[i] = inputs[i];
    }
    return {
        blockSp: resultJSONblock.blockSp,
        inputs: resultJSONblock.inputs,
        body: JSONbody,
        variables: JSONinputs
    };
}

/* Takes in a string BLOCKSPEC and returns the JSONified version of
 * the custom block's body.
 */
function getCustomBody(blockSpec, spriteIndex) {
    // TODO: Why is there here? It's not used? Fix or add comment.
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    try {
        return JSONcustomBlock(findBlockInPalette(blockSpec)).body;
    }
    catch(e) {
        return undefined;
    }
}

/* Takes in all blocks in a single script for a single Sprite in chronological order
 * and converts it into JSON format. You would need to run something like
 * var script = world.children[0].sprites.contents[0].scripts.children[0];
 * in the browser to get the first clone. For example, if we have consecutive
 * blocks for a Sprite on the screen like this:
 *
 * "move (10) steps"
 * "turn (20 + 30) degrees"
 *
 * then our output will be in JSON format as:
 *
 * [{blockSp: "move %n steps",
 *   inputs: [10]},
 *  {blockSp: "turn %n degrees",
 *   inputs: [{blockSpec: "%n + %n",
 *             inputs: ["3", "2"]}]}]
 *
 */
function JSONscript(blocks) {
    if (blocks.__proto__.constructor.name === "CommentMorph") {
        return [{blockSp: "_Comment_",
                 inputs: []}];
    }
    var currBlock = blocks;
    var scriptArr = [];
    var currJSONblock = JSONblock(currBlock);
    var childrenList = currBlock.children;
    var lastChild = childrenList[childrenList.length - 1];
    scriptArr.push(currJSONblock);
    while (lastChild instanceof CommandBlockMorph) {
        currBlock = lastChild;
        currJSONblock = JSONblock(currBlock);
        childrenList = currBlock.children;
        lastChild = childrenList[childrenList.length - 1];
        scriptArr.push(currJSONblock);
    }

    return scriptArr;
}

/* Returns a JavaScript object that contains all of the global variables with
 * their associated values.
 */
function getAllGlobalVars() {
    return world.children[0].globalVariables.vars;
}

/* Returns the value of a specific global variable. Takes in a string VARTOGET
 * that is the global variable to search for and a JavaScript object GLOBALVARS
 * that contains all of the global variables as keys and their values as the
 * corresponding values.
 */
function getGlobalVar(varToGet, globalVars) {
    if (!globalVars.hasOwnProperty(varToGet)) {
        throw varToGet + " is not a global variable.";
    }
    return globalVars[varToGet].value;
}

/* Takes in string CUSTOMBLOCKSPEC, the strings BLOCKSPEC1 (any block)
 * and BLOCKSPEC2 (a conditional block), and their respective
 * optional arg arrays ARGARRAY1 and ARGARRAY2. Returns true if BLOCKSPEC1 is
 * inside of the block represented by BLOCKSPEC2. Also has a SOFTMATCH input.
 */
function CBlockContainsInCustom(customBlockSpec, blockSpec1, blockSpec2, argArray1, argArray2, softMatch) {
    if (argArray1 === undefined) {
        argArray1 = [];
    }
    if (argArray2 === undefined) {
        argArray2 = [];
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    try {
        var script = getCustomBody(customBlockSpec);
    }
    catch(e) {
        return false;
    }
    return CBlockContains(blockSpec1, blockSpec2, script, argArray1, argArray2, softMatch);
}

/* Takes in a SCRIPT and checks recursively if it contains
 * the string BLOCKSPEC that we are looking for. Returns true only if it finds
 * the block we are looking for. ARGARRAY only matters if it is populated (not an empty array)
 * Returns true if BLOCKSPEC/ARGARRAY (if looking for them) are found, otherwise returns false.
 * SOFTMATCH is true if we want to match the inputs using checkArgArrays.
 *
 * BLOCKSPEC can be a general blockspec, such as "factorial %".
 * The SCRIPT can be obtained by running the command, which gives you the
 * first block and access to all the blocks connected to that block:
 *
 * JSONscript(...)
 *
 * BLOCKSPEC should not be "true" or "false".
 */
function scriptContainsBlock(script, blockSpec, argArray, softMatch) {
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (argArray === undefined) {
        argArray = [];
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    var morph1, type1;
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);

        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') {
            if (scriptContainsBlock(morph1, blockSpec, argArray)) {
                return true;
            }
        } else {
            if (blockSpecMatch(morph1.blockSp, blockSpec)) {
                if (argArray.length === 0 || ((argArray.length === 1 ) && (argArray[0] === ""))) {
                    return true;
                } else if ((argArray.length > 0) && _.isEqual(morph1.inputs, argArray)) {
                    return true;
                } else if (softMatch) {
                    return checkArgArrays(argArray, morph1.inputs);
                }
            }
            if (scriptContainsBlock(morph1.inputs, blockSpec, argArray)) {
                return true;
            }
        }
    }
    return false;
}

/* Takes in arrays TEMPLATE and ACTUAL, and returns false if TEMPLATE[i] !== ACTUAL[i] and
 * TEMPLATE[i] !== "" and TEMPLATE[i] !== [].
 */
function checkArgArrays(template, actual) {
    // TODO: Simplify, check against .constructor
    if (Object.prototype.toString.call(template) !== '[object Array]') {
        return false;
    }
    if (Object.prototype.toString.call(actual) !== '[object Array]') {
        return false;
    }
    if ((template.length > 0) && (template.length !== actual.length)) {
        return false;
    }
    for (var i = 0; i < template.length; i++) {
        var currArg = template[i];
        if ((currArg === "")
            || (Object.prototype.toString.call(currArg) === '[object Array]' && currArg.length === 0)) {
            continue;
        } else if (Object.prototype.toString.call(currArg) === '[object Object]') {
            try {
                if (blockSpecMatch(actual[i].blockSp, currArg.blockSp)) {
                    return checkArgArrays(currArg.inputs, actual[i].inputs);
                } else {
                    return false;
                }
            } catch(e) {
                return false;
            }
        } else if (!_.isEqual(currArg, actual[i])) {
            // maybe don't need _.isEqual, can just do basic comparison?
            return false;
        }
    }
    return true;
}

/* Wrapper function that returns true if the given block with string BLOCKSPEC (can be general, 
 * such as "factorial %", since this calls blockSpecMatch) is anywhere on the screen.
 * Otherwise returns false. If ARGARRAY is an array, then we check that all of the inputs
 * are correct in addition to the blockspec. Otherwise we will just check that the blockspec is fine.
 * If SOFTMATCH is true, then we will ignore empty inputs like "" or [].
 */
function spriteContainsBlock(blockSpec, spriteIndex, argArray, softMatch) {
    if (argArray === undefined) {
        argArray = [];
    }
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    if (softMatch === undefined) {
        softMatch = false;
    }

    var JSONtarget;
    var hasFound = false;
    var scriptsOnScreen = getScripts(spriteIndex);
    for (var i = 0; i < scriptsOnScreen.length; i++) {
        JSONtarget = JSONscript(scriptsOnScreen[i]);
        hasFound = scriptContainsBlock(JSONtarget, blockSpec, argArray, softMatch);
        if (hasFound) {
            return true;
        }
    }

    return false;
}

/* Takes in a CUSTOMBLOCKSPEC and a string BLOCKSPEC, both of which can be general 
* blockSpec such as "factorial %" since this calls blockSpecMatch. 
* SPRITEINDEX is not used... deprecated but left just in case it is called in an already 
* written test...
*/
function customBlockContains(customBlockSpec, blockSpec, argArray, spriteIndex, softMatch) {
    if (argArray === undefined) {
        argArray = [];
    }
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    var customBody = JSONcustomBlock(findBlockInPalette(customBlockSpec)).body;
    var hasFound = scriptContainsBlock(customBody, blockSpec, argArray, softMatch);
    return hasFound;
}

/* Takes in BLOCK1SPEC (any block) and BLOCK2SPEC (a C-block), 
 * a script, and respective inputs ARGARRAY1 and ARGARRAY2.
 * Returns true if the block represented by block1 occurs inside 
 * the C-shaped block represented by block2. SOFTMATCH is used in 
 * the call to scriptContainsBlock so that checkArgArrays will be 
 * called. SCRIPT can be obtained by calling:
 *
 * JSONscript(...)
 *
 * The following 8 blocks are considered C-shaped:
 *  -repeat, repeat until, warp, forever, for loop, if, if else, for each
 *  TODO: Add why we restricted to these blocks or add note to expand list.
 */
function CBlockContains(block1Spec, block2Spec, script, argArray1, argArray2, softMatch) {
    // TODO: Fix this condition
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (argArray1 === undefined) {
        argArray1 = [];
    }
    if (argArray2 === undefined) {
        argArray2 = [];
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    var morph1, type1, CblockSpecs;
    // TODO: Replace this with one list.
    // TODO: Write a function to find with inputs.
    CblockSpecs = ["repeat %n %c", "warp %c", "forever %c", "for %upvar = %n to %n %cs"];
    CblockSpecs = CblockSpecs.concat(["repeat until %b %c", "if %b %c", "if %b %c else %c"]);
    CblockSpecs = CblockSpecs.concat(["for each %upvar of %l %cs"]);

   // Added the below for loop to make checking for valid blockSpecs more robust using blockSpecMatch()
    var foundSpec = false;
    for (var i = 0; i < CblockSpecs.length; i++) {
        if (blockSpecMatch(CblockSpecs[i], block2Spec)) {
            foundSpec = true;
            break;
        }
    }

    if (!foundSpec) { return false; }

    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') { 
            if (CBlockContains(block1Spec, block2Spec, morph1, argArray1, argArray2, softMatch)) {
                return true;
            }
        } else if (blockSpecMatch(morph1.blockSp, block2Spec) && checkArgArrays(argArray2, morph1.inputs)) {
            if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
                return true;
            }
            if ((morph1.blockSp === "if %b %c else %c")
                && (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 2], block1Spec, argArray1, softMatch))) {
                return true;
            }
        } else if (CblockSpecs.indexOf(morph1.blockSp) >= 0) {
            if (CBlockContains(block1Spec, block2Spec, morph1.inputs[morph1.inputs.length - 1], argArray1, argArray2, softMatch)) {
                return true;
            }
            if ((morph1.blockSp === "if %b %c else %c")
                && (CBlockContains(block1Spec, block2Spec, morph1.inputs[morph1.inputs.length - 2], argArray1, argArray2, softMatch))) {
                return true;
            }
        }
    }
    return false;
}


/* Takes in a blockSpec BLOCKSPEC1, a nickname BLOCK2NAME, a javascript object SCRIPT,
 * and optional arguments ARGARRAY1 and ARGARRAY2.
 * Returns true if the block represented by BLOCKSPEC1 occurs inside 
 * the C-shaped block represented by BLOCK2NAME. Matches BLOCK2NAME to a blockspec. 
 * Also has a SOFTMATCH input to pass into CBlockContains.
 * SCRIPT can be obtained by calling:
 *
 * JSONscript(...)
 */
function simpleCBlockContains(script, blockSpec1, block2Name, argArray1, argArray2, softMatch) {
        if (argArray1 === undefined) {
            argArray1 = [];
        }
        if (argArray2 === undefined) {
            argArray2 = [];
        }
        if (softMatch === undefined) {
            softMatch = false;
        }
        // TODO: Extract this
        var nicknameDict = {
            "repeat" : "repeat %n %c",
            "warp" : "warp %c",
            "forever" : "forever %c",
            "for" : "for %upvar = %n to %n %cs",
            "repeat until" : "repeat until %b %c",
            "if" : "if %b %c",
            "if else" : "if %b %c else %c",
            "for each" : "for each %upvar of %l %cs"
        }
        if (!(block2Name in nicknameDict)) {
            throw "The given C-block nickname is invalid.";
        }
        var block2Spec = nicknameDict[block2Name];
        return CBlockContains(blockSpec1, block2Spec, script, argArray1, argArray2, softMatch);
}

/* Takes in two blockspecs and two argument arrays (representing a block and 
* a C-shaped block), and a SPRITEINDEX. 
* Returns true if the block represented by BLOCK1SPEC occurs inside 
* the C-shaped block represented by BLOCK2SPEC in any script in
* the Scripts tab of the given sprite. See documentation of CBlockContains for 
* details of what blocks are considered C-shaped.
*/
function CBlockContainsInSprite(block1Spec, block2Spec, spriteIndex, argArray1, argArray2, softMatch) {
   // Populate optional parameters
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    try {
        var JSONtarget;
        var doesContain;
        var scriptsOnScreen = getScripts(spriteIndex);
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            doesContain = CBlockContains(block1Spec, block2Spec, JSONtarget, argArray1, argArray2, softMatch);
            if (doesContain) {
                return true;
            }
        }
    } catch(e) {
        return false;
    }
    return false;
}

/* Takes in a script SCRIPT, a string that is either "if" or "else" named CLAUSE, a blockspec
 * such as "move %n steps" BLOCK1SPEC (can be general, such as "factorial %", 
 * since this calls blockSpecMatch), and an optional argument array ARGARRAY1 belonging to block1.
 * Returns true if the block represented by BLOCK1SPEC occurs inside the clause represented 
 * by CLAUSE in an if-else block in the SCRIPT, which can be obtained by calling:
 *
 * JSONscript(...)
 */
function ifElseContains(script, clause, block1Spec, argArray1) {
    // TODO: fix this
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (argArray1 === undefined) {
        argArray1 = [];
    }
    if (!scriptContainsBlock(script, "if %b %c else %c")) {
        return false;
    }
    if (!(clause === "if" || clause === "else")) {
        return false;// return false or return a string!??!?!
    }

    var morph1, type1;
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') { 
            if (ifElseContains(morph1, clause, block1Spec, argArray1)) {
                return true;
            }
        } else if (morph1.blockSp === "if %b %c else %c") {
            if (clause === "if") {
                if (scriptContainsBlock(morph1.inputs[0], block1Spec, argArray1)) {
                    return true;
                }
            } else if (clause === "else") {
                if (scriptContainsBlock(morph1.inputs[1], block1Spec, argArray1)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/* Takes in a string that is either "if" or "else" named CLAUSE, a blockspec
 * such as "move %n steps" BLOCK1SPEC, and an optional argument array ARGARRAY1 belonging to block1.
 * Returns true if the block represented by BLOCK1SPEC occurs inside the clause represented 
 * by CLAUSE in an if-else block in any script in the given sprite's scripts tab.
 */
function ifElseContainsInSprite(clause, block1Spec, argArray1, spriteIndex) {
    // Populate optional parameters
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    try {
        var JSONtarget;
        var doesContain;
        var scriptsOnScreen = getScripts(spriteIndex);
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            doesContain = ifElseContains(JSONtarget, clause, block1Spec, argArray1);
            if (doesContain) {
                return true;
            }
        }
    } catch(e) {
        return false;
    }
    return false;
}

/* Takes in two blockSpecs and boolean SEEN1, which is initialized to false.
 * Returns true if blockSpec string BLOCK1 precedes the blockSpec string BLOCK2
 * in terms of the order that they appear in the script SCRIPT which can be
 * obtained by calling:
 *
 * JSONscript(...)
 *
 * For further clarification, a block like this:
 *
 * "move (20 + (30 - 50)) steps"
 *
 * would count the (%n + %n) block as coming before the (%n - %n) block.
 */
function blockPrecedes(block1, block2, script, seen1) {
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (seen1 === undefined) {
        seen1 = false;
    }
    var morph1, type1;
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);

        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') {
            if (blockPrecedes(block1, block2, morph1, seen1)) {
                return true;
            }
        } else {
            if (blockSpecMatch(morph1.blockSp, block2)) {
                if (!seen1) {
                    return false;
                }
                return true;
            }
            if (blockSpecMatch(morph1.blockSp, block1)) {
                seen1 = true;
            }
            if (blockPrecedes(block1, block2, morph1.inputs, seen1)) {
                return true;
            }
            if (morph1.blockSp ===  "if %b %c else %c") {
                if (ifElseContains(script, "if", block1)
                    || ifElseContains(script, "else", block1)) {
                    seen1 = true;
                }
            }
        }
    }

    return false;
}


/* Takes in two BLOCKSPECs representating the two blocks to be searched for and a
* SPRITEINDEX. Both can be general, such as "factorial %", since this calls blockSpecMatch.
*
* Returns true if block1 precedes block2 in any script in
* the Scripts tab of the given sprite. See documentation of blockPrecedes for
* details of what "precedes" means.
*/
function blockPrecedesInSprite(block1Sp, block2Sp, spriteIndex) {
    // Populate optional parameters
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    try {
        var JSONtarget;
        var doesPrecede;
        var scriptsOnScreen = getScripts(spriteIndex);
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            doesPrecede = blockPrecedes(block1Sp, block2Sp, JSONtarget, false);
            if (doesPrecede) {
                return true;// if any script on the scripting area has block1
                   // occuring before block2, then this test will pass.
            }
        }
    } catch(e) {
        doesPrecede = false;
        feedback = "Error when looking to see if " + block1Spec + " precedes";
        feedback += " " + block2Spec + " in script.";
        // Return undefined so the grade state doesn't change when no script is present??
        console.log(feedback);
        return false;
    }
    return false;
}

/* Takes in a block BLOCK and returns the number of occurances
 * of the string BLOCKSPEC (which can be general, such as "factorial %", since 
 * this calls blockSpecMatch).
 *
 * Get the block by calling:
 *
 * JSONscript(...)
 */
function occurancesOfBlockSpec(blockSpec, block) {
    if (Object.prototype.toString.call(block) !== '[object Array]') {
        return 0;
    }
    var morph1, type1;
    var result = 0;
    for (var i = 0; i < block.length; i++) {
        morph1 = block[i];
        type1 = typeof(morph1);

        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') {
            result += occurancesOfBlockSpec(blockSpec, morph1);
        } else {
            if (blockSpecMatch(morph1.blockSp, blockSpec)) {
                result += 1;
            }
            result += occurancesOfBlockSpec(blockSpec, morph1.inputs);
        }
    }

    return result;
}

/* Takes in a BLOCKSPEC representation of the block to be counted (can be general, 
* such as "factorial %", since this calls blockSpecMatch), an EXPECTED 
* number of occurances of said block, and a SPRITEINDEX.
* 
* Returns true if the given block occurs EXPECTED times in any script in 
* the Scripts tab of the given sprite. EXPECTED should be the minimum number of 
* times the given block must occur in order for the answer to be correct (if the 
* block doesn't occur at least EXPECTED times in a script, the feedback will notify 
* the student that the block does not occur enough times for the solution to be correct).
*/
function occurancesOfBlockInSprite(blockSpec, expected, spriteIndex) {
    // Populate optional parameters
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    try {
        var JSONtarget;
        var actual;
        var isCorrect = false;
        var scriptsOnScreen = getScripts(spriteIndex);
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            actual = occurancesOfBlockSpec(blockSpec, JSONtarget);
            if (actual === expected) {
                return true;
            }
        }
    } catch(e) {
        return false;
    }
    return false;
}


/* Returns true if the two JSON scripts are exactly the same. Else returns false.
 * Takes in two scripts, TEMPLATE (our template) and SCRIPT (student's template).
 * Also takes in a boolean called SOFTMATCH, if this is true then we match the
 * pattern of the template with the student's answer. VARS is initially an empty
 * dictionary of mapping of variables in template to the actual values seen in the
 * script. Pattern must match up, else false. Can obtain sprite's script by calling:
 *
 * JSONscript(...)
 *
 */
function scriptsMatch(template, script, softMatch, vars, templateVariables) {
    // TODO: FIXME
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (Object.prototype.toString.call(template) !== '[object Array]') {
        return false;
    }
    var morph1, morph2, type1, type2, templateIsArray, scriptIsArray;
    templateIsArray = (Object.prototype.toString.call(template) === '[object Array]');
    scriptIsArray = (Object.prototype.toString.call(script) === '[object Array]');
    if (templateIsArray && scriptIsArray) {
        if (template.length !== script.length) {
            return false;
        }
    }
    for (var i = 0; i < template.length; i++) {
        morph1 = template[i];
        morph2 = script[i];
        type1 = typeof(morph1);
        type2 = typeof(morph2);


        if (type1 !== type2) {
            return false;
        }

        if ((type1 === "string") && (type2 === "string")) {
            if (softMatch && (morph1 !== morph2)) {
                if (vars.hasOwnProperty(morph1)) {
                    if (vars[morph1] !== morph2) {
                        return false;
                    }
                } else if (templateVariables.indexOf(morph1) === -1) {
                    return false;
                } else {
                    vars[morph1] = morph2;
                }
            } else if (!softMatch && (morph1 !== morph2)) {
                return false;
            }
        } else if ((Object.prototype.toString.call(morph1) === '[object Array]')
            && (Object.prototype.toString.call(morph2) === '[object Array]')) {

            if (!scriptsMatch(morph1, morph2, softMatch, vars, templateVariables)) {
                return false;
            }

        } else {
            if (morph1.blockSp !== morph2.blockSp) {
                return false;
            }
            if (morph1.inputs.length !== morph2.inputs.length) {
                return false;
            }
            if (!scriptsMatch(morph1.inputs, morph2.inputs, softMatch, vars, templateVariables)) {
                return false;
            }
        }
    }

    return true;
}

/* TODO: this isn't really necessary.
 * Takes in a JavaScript object SCRIPT that is the result of calling JSONscript() on
 * a piece of Snap! code and converts it to a string.
 */
function JSONtoString(script) {
    return JSON.stringify(script);
}

/* Takes in a string SCRIPT that is the representation of a JavaScript object and
 * converts it back into JSON format (the same format as a result of calling
 * JSONscript() on a piece of Snap! code).
 */
function stringToJSON(script) {
    return JSON.parse(script);
}

/* Returns the next character after C. Got this from StackOverflow at this link:
 * http://stackoverflow.com/questions/12504042/what-is-a-method-that-can-be-used-to-increment-letters
 * Put in a case where "Z" then goes to "a" and "z" goes to "A" to prevent weird
 * characters from being set to variables in our patterns like "[" or "}". Basically
 * only uses alphabeticaly characters, just increments using the character's unicode value.
 */
function nextChar(c) {
    if (c === "Z") {
        return "a";
    }
    if (c === "z") {
        return "A";
    }
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

/* Takes in two correct JSONscript(...) representations of answers, SCRIPT1 and SCRIPT2,
 * and constructs a general pattern template that we can use to grade other answers
 * to a given question. Also Takes in a deep copy of the first JSONscript(...) called RESULT,
 * which will be our template, and a NEWMAP JavaScript object (should be initialized to empty)
 * that maps values to variables and the CURRCHAR JavaScript object that keeps track of
 * the variable we are using for a given line in the template. This gets incremented bythe
 * nextChar() function. Also takes in TEMPLATEVARIABLES, which is an array of all of the
 * variables that will be in the returned template RESULT.
 */
function genPattern(script1, script2, result, newMap, currChar, templateVariables) {
    var morph1, morph2, type1, type2;
    for (var i = 0; i < script1.length; i++) {
        morph1 = script1[i];
        morph2 = script2[i];
        morphR = result[i];
        type1 = typeof(morph1);
        type2 = typeof(morph2);

        if ((type1 === "string") && (type2 === "string")) {
            if (morph1 !== morph2) {

                var newKey = JSONtoString([morph1, morph2]);
                if (newMap.hasOwnProperty(newKey)) {
                    result[i] = newMap[newKey];
                } else {
                    result[i] = currChar.val;
                    newMap[newKey] = currChar.val;
                    templateVariables.push(currChar.val);
                    currChar.val = nextChar(currChar.val);
                }
            }
        } else if ((Object.prototype.toString.call(morph1) === '[object Array]')
            && (Object.prototype.toString.call(morph2) === '[object Array]')) {

            genPattern(morph1, morph2, morphR, newMap, currChar, templateVariables);

        } else {
            genPattern(morph1.inputs, morph2.inputs, morphR.inputs, newMap, currChar, templateVariables);
        }
    }

    return result;
}

/* Takes in two JSONscripts, SCRIPT1 and SCRIPT2 from calling JSONscript(...)
 * and returns a two element array of the grading template and the variables
 * in the grading template. This is a wrapper function for genPattern().
 *
 * Get a deep copy by calling: var result = jQuery.extend(true, [], script1);
 *
 * We need this deep copy because we need a completely new object that doesn't
 * modify either of the original student's scripts.
 */
function getTemplate(script1, script2) {
    if ((Object.prototype.toString.call(script1) !== '[object Array]')
        || (Object.prototype.toString.call(script2) !== '[object Array]')) {
        return [[], []];
    }
    var result = jQuery.extend(true, [], script1);
    var newMap = {};
    var chars = {val: "A"};
    var newMap = {};
    var templateVariables = [];
    return [genPattern(script1, script2, result, newMap, chars, templateVariables), templateVariables];
}

/* Shortcut function initializes onscreen scripts for use with getTemplate.
 * This function can only be used if exactly 2 scripts of the expected form
 * are present in the scripts window.
 */
function fastTemplate() {
    var scripts = getScripts(0);
    var script1 = JSONscript(scripts[0]);
    var script2 = JSONscript(scripts[1]);
    return JSON.stringify(getTemplate(script1, script2));
}

/* Takes in a TEMPLATE and a student's SCRIPT and grades it by checking the pattern
 * against the student's pattern. Also takes in TEMPLATEVARIABLES, which is an array
 * containing the variables in TEMPLATE. This is a wrapper function for scriptsMatch(...).
 * Must pass in a parameter for vars in scriptsMatch as {}. Returns true if pattern
 * matches, else false. If softMatch is false, then it will literally check exactly
 * the values in the student's SCRIPT.
 */
function checkTemplate(template, script, templateVariables) {
    // TODO: Fix these to check the .constructor
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (Object.prototype.toString.call(template) !== '[object Array]') {
        return false;
    }
    var vars = {}, softMatch = true;
    return scriptsMatch(template, script, softMatch, vars, templateVariables);
}

/* Takes in a string blockspec and returns its type (reporter, predicate, command).
 * This only works for blocks IN THE PALETTE. NOT COMMENTS.
*/
function blockType(blockSpec) {
    return findBlockInPalette(blockSpec).__proto__.constructor.name;
}
