
//Snap Protocol Language Enabler


/*
	gradingLog is initialized when a block is tested.
	Tests are added to the log and the output value is
	updated when the Snap! process finishes. Finishing
	the last test causes the grading log to be evaluate.
	WARNING: Currently does not function for infitely
	looping scripts.
*/
function gradingLog() {
	this.testCount = 0;
	this.qID = null;
	this.allCorrect = false;
	this.currentTimeout = null;
}

gradingLog.prototype.addTest = function(blockSpec, input, expOut, timeOut) {
	this.testCount += 1;
	this["" + this.testCount] = {"blockSpec": blockSpec,
								 "input": input, 
								 "expOut": expOut, 
								 "output": null, 
								 "feedback": null,
								 "timeOut": timeOut};
	return this.testCount;
};

gradingLog.prototype.finishTest = function(testID, output, feedback) {
	if (this["" + testID] !== undefined) {
		this["" + testID]["output"] = output;
		if (feedback !== undefined) {
			this["" + testID]["feedback"] = feedback;
		}
	} else {
		throw "gradingLog.finishTest: TestID is invalid.";
	}
	var glog = this;
	if (testID < this.testCount) {
		//TODO: Track currently tested block evaluation with a second timeout.
		// Should check to see if the process has finished. If it hasn't,
		// terminate the process, update the log, launch the  next test.
		clearTimeout(this.currentTimeout);
		setTimeout(function() {testBlock(glog, testID+1)},1);
		//TODO: generalize for all sprites?
		//TODO: DO THIS FOR THE FIRST TEST ALSO!!
		//TODO: Figure out a good default timeout NOW -> 300ms
		// setTimeout(function() {
		// 	var stage = world.children[0].stage;
		// 	stage.threads.stopProcess(getScript(glog["" + (testID+1)]["blockSpec"]));
		// 	// glog.updateLog(testID+1,null,"Timeout error: Function did not finish before xxx ms");
		// }, 300);
		this.currentTimeout = infLoopCheck(glog, testID+1);
	} else {
		setTimeout(function() {evaluateLog(glog)},1);
	}
	// return this["" + testID];
};

gradingLog.prototype.updateLog = function(testID, output, feedback) {
	if (this["" + testID] !== undefined) {
		this["" + testID]["output"] = output;
		if (feedback !== undefined) {
			this["" + testID]["feedback"] = feedback;
		}
	} else {
		throw "gradingLog.finishTest: TestID is invalid.";
	}

}

/*
	Snap block getters and setters used to retrieve blocks,
	set values, and initiates blocks.
*/

function getSprite(index) {
	try {
		return world.children[0].sprites.contents[index];
	} catch(e) {
		throw "This Snap instance is very broken"
	}
}



//Returns the scripts of the script at 'index', undefined otherwise.
function getScripts(index) {

	var sprite = getSprite(index);

	if (sprite !== undefined) {
		return sprite.scripts.children;
	} else {
		return undefined;
	}
}

function getScript(blockSpec, spriteIndex) {
	//TODO: Consider expanding to grab from additional sprites

	//Try to get a sprite's scripts
	//Throw exception if none exist.
	try {
		//Does the sprite exist?
		if (spriteIndex === undefined) {
			var scripts = getScripts(0);
		} else {
			var scripts = getScripts(spriteIndex);
		}
		//If no sprites exist, throw an exception.
		if (scripts === undefined) {
			throw "No scripts"
		}
	} catch(e) {
		throw "getScript: No Sprite available."
	}

	//Try to return the first block matching 'blockSpec'.
	//Throw exception if none exist/
	var validScripts = scripts.filter(function (morph) {
		if (morph.selector) {
			//TODO: consider adding selector type check (morph.selector === "evaluateCustomBlock")
			return (morph.blockSpec === blockSpec);
		}
	});
	if (validScripts.length === 0) {
		throw "getScript: No block named: '" + blockSpec.replace(/%[a-z]/g, "[]") + "'" +" in script window.";
	}

	return validScripts[0]

}

function isScriptPresent(blockSpec, spriteIndex) {
	var script;
	try {
		script = getScript(blockSpec, spriteIndex);
		return true;
	} catch(e) {
		return false;
	}
}

function testScriptPresent(blockSpec, spriteIndex, outputLog) {
	//Populate optional parameters
	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	//Generate Log
	var testID = outputLog.addTest(blockSpec, "n/a", true, -1);
	var isPresent = isScriptPresent(blockSpec, spriteIndex);
	var feedback = null;
	if (isPresent) {
		feedback = "(" + blockSpec + ") is in the scripts tab.";
	} else {
		feedback = "Block Missing: (" + blockSpec + ") , was not found in the scripts tab";
	}
	outputLog.updateLog(testID, isPresent, feedback);
	evaluateLog(outputLog);
	return outputLog;
}


function setValues(block, values) {
	var valIndex = 0;

	var morphList = block.children;

	for (var morph of morphList) {
		if (morph.constructor.name === "InputSlotMorph") {
			morph.setContents(values[valIndex]);
			valIndex += 1;
		}
	}
	if (valIndex + 1 !== values.length) {
		//TODO: THROW ERROR FOR INVALID BLOCK DEFINITION
	}
}

function evalReporter(block, outputLog, testID) {
	var stage = world.children[0].stage;
	var proc = stage.threads.startProcess(block,
					stage.isThreadSafe,
					false,
					function() {
						outputLog.finishTest(testID, readValue(proc));
					});
	return proc
}

//FUNCTION NEEDS TO FIND THE PROCESS AND CHECK IF IT HAS COMPLETED
function readValue(proc) {
	return proc.homeContext.inputs[0];
}

/*
	Test and evaluate Snap! blocks. Uses a gradingLog to initilize tests,
	launch processes, and update the log, and launch the next test
*/


function testBlock(outputLog, testID) {
	if (outputLog[testID] === undefined) {
		throw "testBlock: Output Log Contains no test with ID: " + testID;
	}
	var test = outputLog[testID];
	var block = getScript(test["blockSpec"]);
	setValues(block, test["input"]);
	var proc = evalReporter(block, outputLog, testID);
	return testID;
}

function multiTestBlock(blockSpec, inputs, expOuts, timeOuts, outputLog) {

	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (inputs.length !== expOuts.length && inputs.length !== timeOuts.length) {
		return null;
	}

	var testIDs = new Array(inputs.length);
	try {
		var scripts = getScript(blockSpec);
	} catch(e) {
		throw e
	}

	for (var i=0;i<inputs.length; i++) {
		testIDs[i] = outputLog.addTest(blockSpec, inputs[i], expOuts[i], timeOuts[i]);
	}
	testBlock(outputLog, testIDs[0]);
	outputLog.currentTimeout = infLoopCheck(outputLog, testIDs[0]);
	return outputLog;
}

function prettyBlockString(blockSpec, inputs) {
	var pString = blockSpec;
	for (var inp in inputs) {
		pString = pString.replace(/%[a-z]/, inp);
	}
	return pString;
}

function infLoopCheck(outputLog, testID) {
	var timeout = outputLog["" + testID]["timeOut"]; //Make this = the incoming timeout value for the specific test
	if (timeout < 0) {
		timeout = 1000;
	}
	return setTimeout(function() {
			var stage = world.children[0].stage;
			stage.threads.stopProcess(getScript(outputLog["" + testID]["blockSpec"]));
		}, timeout);
}

/*
Evaluate the outputLog, match the expected output with the recieved output
Add relevant feedback with associated issue.
TODO: Explore input of conditional comments
*/
function evaluateLog(outputLog, testIDs) {

	//
	if (testIDs === undefined) {
		testIDs = [];
		for (var i = 1; i <= outputLog.testCount; i++) {
		   testIDs.push(i);
		}
	}
	outputLog.allCorrect = true;
	for (var id of testIDs) {
		if (outputLog[id]["output"] === outputLog[id]["expOut"]) {
			outputLog[id]["feedback"] = "Correct!";
		} else if (outputLog[id]["output"] === undefined) {
			outputLog[id]["output"] = "Timeout error.";
			//TODO: Add actual timeout variable from outputLog to the feedback
			outputLog[id]["feedback"] = "Timeout error: Function did not finish before " + 
				((outputLog[id]["timeOut"] < 0) ? 1000 : outputLog[id]["timeOut"]) + " ms.";
		} else {
			outputLog.allCorrect = false;
			outputLog[id]["feedback"] = "Incorrect Answer; Expected: " +
				outputLog[id]["expOut"] + " , Got: " + outputLog[id]["output"];
		}
	}
	return outputLog;
}

//Convert a gradingLog [object] into a dictionary or string for debugging and feedback
//handling for edX.

/* Takes a gradingLog object and converts it into a dictionary.
 *
 */
function dictLog(outputLog) {
	var outDict = {};
	for (var i = 1; i <=outputLog.testCount;i++) {
		var testDict = {};
		testDict["id"] = i;
		testDict["blockSpec"] = "'(" + outputLog[i]["blockSpec"].replace(/%[a-z]/g, "[]") + ")'";
		testDict["input"] = outputLog[i]["input"];
		testDict["expOut"] = outputLog[i]["expOut"];
		testDict["output"] = outputLog[i]["output"];
		testDict["feedback"] = outputLog[i]["feedback"];
		outDict[i] = testDict;
	}
	return outDict;
}

function printLog(outputLog) {
	var testString = ""; //TODO: Consider putting Output Header
	for (var i = 1; i<=outputLog.testCount;i++) {
		testString += "[Test " + i + "]";
		testString += " Block: '(" + outputLog[i]["blockSpec"].replace(/%[a-z]/g, "[]") + ")'";
		testString += " Input: " + outputLog[i]["input"];
		testString += " Expected Ans: " + outputLog[i]["expOut"];
		testString += " Got: " + outputLog[i]["output"];
		testString += " Feedback: " + outputLog[i]["feedback"] + "\n";
	}
	return testString;
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
	var blockArgs = [];
	var morph;
	for (var i = 0; i < block.children.length; i++) {
		morph = block.children[i];
		if (morph instanceof InputSlotMorph) {
			blockArgs.push(morph.children[0].text);
		} else if (morph instanceof CSlotMorph) {
			blockArgs.push(JSONscript(morph.children[0]));
		} else if (morph instanceof ReporterBlockMorph) {
			blockArgs.push(JSONblock(morph));
		}
	}

	return {blockSp: block.blockSpec, inputs: blockArgs};
}

/* Takes in a custom block and converts it to JSON format. For example,
 * if we have a factorial block like this on the screen:
 *
 * "factorial (5)"
 *
 * with a body like this:
 *
 * factorial (n) {
 *     if (n == 0) {
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
	var resultJSONblock = JSONblock(block);
	var JSONbody = JSONscript(block.definition.body.expression);
	var inputs = block.definition.body.inputs;
	var JSONinputs = [];
	for (var i = 0; i < inputs.length; i++) {
		JSONinputs[i] = inputs[i];
	}
	return {blockSp: resultJSONblock.blockSp,
		    inputs: resultJSONblock.inputs,
		    body: JSONbody,
		    variables: JSONinputs};
}

/* Takes in all scripts for a single Sprite in chronological order
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

/* Returns the value of a specific global variable. Takes in a string
 * that is the global variable to search for and a JavaScript object
 * that contains all of the global variables as keys and their values as the
 * corresponding values.
 */
function getGlobalVar(varToGet, globalVars) {
	if (!globalVars.hasOwnProperty(varToGet)) {
		throw varToGet + " is not a global variable.";
	}
	return globalVars[varToGet].value;
}

/* Takes in an entire Sprite's script and checks recursively if it contains
 * the string BLOCKSPEC that we are looking for. Returns true if BLOCKSPEC
 * is found, otherwise returns false.
 *
 * The script can be obtained by running the command, which gives you the
 * first block and access to all the blocks connected to that block:
 *
 * JSONscript(...)
 */
function scriptContainsBlockSpec(script, blockSpec) {
	var morph1, type1;
	for (var i = 0; i < script.length; i++) {
		morph1 = script[i];
		type1 = typeof(morph1);

		if ((type1 === "string")) {
			continue;
		} else if (Object.prototype.toString.call(morph1) === '[object Array]') {
			if (scriptContainsBlockSpec(morph1, blockSpec)) {
				return true;
			}
		} else {
			if (morph1.blockSp === blockSpec) {
				return true;
			}
			if (scriptContainsBlockSpec(morph1.inputs, blockSpec)) {
				return true;
			}
		}
	}

	return false;
}

/* Takes in two blockSpecs and returns true if blockSpec string BLOCK1
 * precedes the blockSpec string BLOCK2 in terms of the order that they
 * appear in the script SCRIPT which can be obtained by calling:
 *
 * JSONscript(...)
 *
 * seen1 is initialized to false
 */
function blockPrecedes(block1, block2, script, seen1) {
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
			if (morph1.blockSp === block2) {
				if (!seen1) {
					return false;
				}
				return true;
			}
			if ((morph1.blockSp === block1)) {
				seen1 = true;
			}
			if (blockPrecedes(block1, block2, morph1.inputs, seen1)) {
				return true;
			}
		}
	}

	return false;
}

/* Takes in a block BLOCK and returns the number of occurances
 * of the string BLOCKSPEC.
 *
 * Get the block by calling:
 *
 * JSONscript(...)
 */
function occurancesOfBlockSpec(blockSpec, block) {
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
			if (morph1.blockSp === blockSpec) {
				result += 1;
			}
			result += occurancesOfBlockSpec(blockSpec, morph1.inputs);
		}
	}

	return result;
}

/* Returns true if the two JSON scripts are exactly the same. Else returns false.
 * Takes in two scripts, SCRIPT1 and SCRIPT2. Also takes in a boolean called
 * SOFTMATCH, if this is true then we ignore the inputs and just match up the
 * blocks. Can obtain sprite's first script by calling:
 *
 * JSONscript(scripts...)
 *
 */
function scriptsMatch(script1, script2, softMatch) {
	var morph1, morph2, type1, type2;
	for (var i = 0; i < script1.length; i++) {
		morph1 = script1[i];
		morph2 = script2[i];
		type1 = typeof(morph1);
		type2 = typeof(morph2);


		if (type1 !== type2) {
			return false;
		}

		if ((type1 === "string") && (type2 === "string")) {
			if (!softMatch && (morph1 !== morph2)) {
				return false;
			}
		} else if ((Object.prototype.toString.call(morph1) === '[object Array]')
			&& (Object.prototype.toString.call(morph2) === '[object Array]')) {

			if (!scriptsMatch(morph1, morph2, softMatch)) {
				return false;
			}

		} else {
			if (morph1.blockSp !== morph2.blockSp) {
				return false;
			}
			if (morph1.inputs.length !== morph2.inputs.length) {
				return false;
			}
			if (!scriptsMatch(morph1.inputs, morph2.inputs, softMatch)) {
				return false;
			}
		}
	}

	return true;
}

/* Takes in a JavaScript object that is the result of calling JSONscript() on
 * a piece of Snap! code and converts it to a string. Use this to pass into
 * isScriptPresent() function for grading purposes.
 */
function JSONtoString(script) {
	return JSON.stringify(script);
}

/* Takes in a string that is the representation of a JavaScript object and
 * converts it back into JSON format (the same format as a result of calling
 * JSONscript() on a piece of Snap! code).
 */
function stringToJSON(script) {
	return JSON.parse(script);
}

/* Returns the next character. Got this from StackOverflow at this link:
 * http://stackoverflow.com/questions/12504042/what-is-a-method-that-can-be-used-to-increment-letters
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

/* Takes in two correct JSONscript(...) representations of answers and constructs a
 * general pattern template that we can use to grade other answers to a given
 * question. Also Takes in a copy of the first JSONscript(...) answer, which will
 * be our result, a vars JavaScript object (should be initialized to empty) that maps
 * values to variables and the currChar JavaScript object to be used as a
 * variable (should initialize to {val: "a"}).
 *
 * Parameters: script1, script2, result, vars, currChar like this:
 *
 * var final = genPattern(script1, script2, result, {}, {val: "a"});
 *
 * Get a deep copy by calling: var newObject = jQuery.extend(true, [], script1);
 */
function genPattern(script1, script2, result, vars, currChar) {
	var morph1, morph2, type1, type2;
	for (var i = 0; i < script1.length; i++) {
		morph1 = script1[i];
		morph2 = script2[i];
		morphR = result[i];
		type1 = typeof(morph1);
		type2 = typeof(morph2);

		if ((type1 === "string") && (type2 === "string")) {
			if (morph1 !== morph2) {
				result[i] = currChar.val;
				vars[currChar.val] = [morph1, morph2];
				currChar.val = nextChar(currChar.val);
			}
		} else if ((Object.prototype.toString.call(morph1) === '[object Array]')
			&& (Object.prototype.toString.call(morph2) === '[object Array]')) {

			genPattern(morph1, morph2, morphR, vars, currChar);

		} else {
			genPattern(morph1.inputs, morph2.inputs, morphR.inputs, vars, currChar);
		}
	}

	return result;
}

/* Takes in two arrays and check whether or not they are equal. Returns true if
 * the two arrays have the same elements in the same order, else false. This is
 * only a shallow comparison, NOT a deep comparison!
 *
 * took from StackOverflow at: http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
 */
function arraysEqual(arr1, arr2) {
	if (arr1 == arr2) {
		return true;
	}
	if ((arr1 == null) || (arr2 == null)) {
		return false;
	}
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true;
}

/* Replaces all of the variables in the given pattern (which is a JavaScript object)
 * like that returned from JSONscript(...) with the corresponding variable in newMap.
 * The keys in newMap are stringified, two-element arrays mapped to single character
 * variables. The keys in vars are single character variables mapped to two-element
 * arrays. Returns a new pattern, with the appropriate variables subbed-in.
 */
function replacePattern(script, vars, newMap) {
	var morph, type, newKey;
	for (var i = 0; i < script.length; i++) {
		morph = script[i];
		type = typeof(morph);

		if ((type === "string")) {
			if (vars.hasOwnProperty(morph)) {
				newKey = JSONtoString(vars[morph]);
				script[i] = newMap[newKey];
			}
		} else if (Object.prototype.toString.call(morph) === '[object Array]') {
			replacePattern(morph, vars, newMap);
		} else {
			replacePattern(morph.inputs, vars, newMap);
		}
	}

	return script;
}

/* Takes in the result of genPattern(...) and the variables object that contains
 * the mapping from variables in our pattern to the corresponding values in the
 * two scripts that were orginially passed into genPattern(...). Each variable in
 * vars maps to exactly 2 values (one from each original script). This function
 * basically collapses all of the variables that map to common values into one
 * common variable. For example,
 *
 * move "a" steps
 * turn 90 degrees  //is our code
 * move "b" steps
 *
 * {"a": ["100", "50"], "b": ["100", "50"]} //are our variables
 *
 * will result in:
 *
 * move "a" steps
 * turn 90 degrees
 * move "a" steps
 *
 * because "a" and "b" map to exactly the same values in the same order.
 * The result is a new template.
 */
function cleanPattern(result, vars) {
	var newMap = {};
	var currKeys = Object.keys(vars);
	var newKey;
	var finalPattern;

	for (var key in vars) {
		if (vars.hasOwnProperty(key)) {
			newKey = JSONtoString(vars[key]);
			if (newMap.hasOwnProperty(newKey)) {
				continue;
			} else {
				newMap[newKey] = key;
			}
		}
	}

	return replacePattern(result, vars, newMap);
}

// loop through all of the key/value pairs in vars
// 	if stringifed version of the value (the two element array) is in newMap
// 		dont do anything
// 	else
// 		add a new key value pair to newMap like this: stringifed value: key from vars

// 	after this, newMap will be a mapping of stringifed arrays to keys from vars, but newMap
// 	is a one-to-one relationship, so only one value per key.

// 	then call replacePattern() which will take in result, vars and newMap and go through and replace
// 	all the variables that map to common values with one unifiying variable.

// 	return the result of replacePattern()

/* Takes in two JSONscripts from calling JSONscript(...) and returns the grading
 * template. This is a wrapper function for genPattern().
 */
function getTemplate(script1, script2) {
	var result = jQuery.extend(true, [], script1);
	var vars = {};
	var chars = {val: "a"};
	var temp = genPattern(script1, script2, result, vars, chars);

	//call clean pattern that takes in result and vars
	//then return final result

	return cleanPattern(temp, vars);
}

