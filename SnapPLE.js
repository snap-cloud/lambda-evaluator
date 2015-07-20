
//Snap Protocol Language Enabler


/*
	gradingLog is initialized when a block is tested.
	Tests are added to the log and the output value is
	updated when the Snap! process finishes. Finishing
	the last test causes the grading log to be evaluated.
*/
function gradingLog(snapWorld, taskID, numAttempts) {
	this.testCount = 0;
	this.allCorrect = false;
	this.currentTimeout = null;
	this.taskID = taskID || null;
	this.pScore = null;
	this.snapWorld = snapWorld || null;
	this.graded = false;
	this.numCorrect = 0;
	/*var prev_log = localStorage.getItem(taskID + "_test_log");
	if (prev_log !== null && JSON.parse(prev_log).numAttempts !== undefined) {
		this.numAttempts = JSON.parse(prev_log).numAttempts;
	} else {
		this.numAttempts = 0;
	}*/
	this.numAttempts = numAttempts;
	this.timeStamp = new Date().toUTCString();
}

/* Save the gradingLog in localStorage.
 * 	- key = gradingLog.taskID + "_test_log"
 * If the state is correct, save it separately.
 * 	- key = gradingLog.taskID + "_c_test_log"
 * 	- This is used to restore a corrected log if the Snap! state is
 *    reverted.
 */
gradingLog.prototype.saveLog = function() {
	// Save the JSON string of the gradingLog,
	// without the Snap 'world' reference [To minimize stored data]
	var world_ref = this.snapWorld;
	this.snapWorld = null;
	var log_string = JSON.stringify(this);
	this.snapWorld = world_ref;

	// Store the log string in localStorage
	localStorage.setItem(this.taskID + "_test_log", log_string);
	if (this.allCorrect) { // If all tests passed.
		// Store the correct log in localStorage
		localStorage.setItem(this.taskID + "_c_test_log", log_string);
	}

}
/* Save the gradingLog.snapWorld into localStorage with the
 * specified key. Does nothing if 'store_key' or
 * gradingLog.snapWorld are unspecified (null or undefined).
 * @param {String} store_key
 */
gradingLog.prototype.saveSnapXML = function(store_key) {
	if (this.snapWorld !== null && store_key !== undefined) {
        localStorage.setItem(store_key, this.stringifySnapXML());
	}
}

gradingLog.prototype.stringifySnapXML = function() {
	if (this.snapWorld !== null) {
		var ide = this.snapWorld.children[0];
		var world_string = ide.serializer.serialize(ide.stage);
		return world_string;
	}
}

/*
*  Add a test to the gradingLog object
*  tests are tracked by a test ID number.
*  Access specific parts of each test by:
*  		gradingLog.[""+(testID)]
*  Test Class include:
*		"a" - assertion
*		"p" - presence test
*		"r" - reporter test
*		"s" - stage event test
*/
gradingLog.prototype.addTest = function(testClass, blockSpec, input, expOut, timeOut) {
	this.testCount += 1;
	this["" + this.testCount] = {"testClass": testClass,
								 "blockSpec": blockSpec,
								 "input": input,
								 "expOut": expOut,
								 "output": null,
								 "correct": false,
								 "feedback": null,
								 "timeOut": timeOut,
								 "proc": null,
								 'graded': false};
	return this.testCount;
};

gradingLog.prototype.addAssert = function(testClass, statement, feedback, text, pos_fb, neg_fb) {
	this.testCount += 1;
	this[this.testCount] = {'testClass': "a",
							'text': text,
							'correct': statement(),
							'assertion': statement,
							'feedback': feedback,
							'graded': true,
							'pos_fb': pos_fb,
							'neg_fb': neg_fb};
							//'assertion': statement};
	return this.testCount;

}


/*
 * Initiates Reporter tests if they exist, and returns true in such a case,
 * false otherwise.
 */
gradingLog.prototype.runSnapTests = function() {

	//Find the first reporter test and start it.
	for (var id = 1; id <= this.testCount; id++) {
		var test = this[id];
		if (test.testClass === 'r') {
			this.startSnapTest(id);
			return true;
		}
		if (test.testClass === 's') {
			return true;
		}
	}
	//return this gradingLog
	return false;
}

gradingLog.prototype.startSnapTest = function(testID) {
	var test = this[testID];
	if (test === undefined) {
		throw 'startSnapTest: OutputLog Contains no test with ID: ' + testID;
	} else if (test.testClass !== 'r') {

	}

	//Retrieve the block from the stage TODO: Handle Errors
	try {
		var block = getScript(test.blockSpec);
	//Set the selected block's inputs for the test
		setValues(block, test['input']);
	//Initiate the Snap Process with a callback to .finishSnapTest

		var stage = this.snapWorld.children[0].stage;
		var outputLog = this; //Reference for the anonymouse function to follow
		var proc = stage.threads.startProcess(block,
			stage.isThreadSafe,
			false,
			function() {
				outputLog.finishSnapTest(testID, readValue(proc));

		});
	//Add reference to proc in gradingLog for error handling
		test.proc = proc;
	//Timeouts for infinitely looping script or an Error.
		var timeout = test.timeOut;
	//Set default time if none is specified
		if (timeout < 0) {
			timeout = 1000;
		}
		//Launch timeout to handle Snap errors and infinitely looping scripts
		var timeout_id = setTimeout(function() {
			var stage = outputLog.snapWorld.children[0].stage;
			if (test['proc'].errorFlag) {
				test['feedback'] = "Snap Error." //TODO: Find error message from process or block
			} else {
				test['feedback'] = "Test Timeout Occurred."
			}
			stage.threads.stopProcess(getScript(outputLog[testID]["blockSpec"]));
			test.correct = false;
			//Set the graded flag to true for this test.
			console.log(timeout);
			test.graded = true;
		},timeout);
		//Save timeout id, to stop error handling timeout if test succeeds.
		this.currentTimeout = timeout_id;

		return this;
	} catch(e) {
		test.feedback = e;
		test.correct = false;
		test.graded = true;
		test.proc = null;
		var outputLog = this;
		//Find the next Snap reporter test
		for (var id = testID+1; id <= this.testCount;id++) {
			var next_test = this[id];
			//Continue to the next test if not a 'reporter' test type
			if (next_test.testClass === 'r' && !next_test.graded) {
				setTimeout(function() {
					outputLog.startSnapTest(id);
				},1);
				return;
			}
		}
		this.scoreLog();
		return;
	}
}

/*
*  Asyncronysly runs the input tests
*  Initiates a test, sets the time out for the test and
*  evaluates the test log once the last test has ran.
*  Uses a series of setTimeouts to make sure the asyncronous
*  test threads do not clash with one another on setup.
*/
gradingLog.prototype.finishSnapTest = function(testID, output) {

	//Populate Grade Log //May be DEPRICATED.
	var test = this[testID];
	if (test === undefined) {
		throw "gradingLog.finishSnapTest: TestID: " + testID + ", is invalid.";
	}
	
	if (output === undefined) {
		test.output = null;
	} else {
		test.output = output;
	}

	//Update feedback and 'correct' flag depending on output.
	if (snapEquals(test.output, test.expOut)) {
		test.correct = true;
		//test.feedback = test.feedback || "Test Passed.";
		test.feedback = "Test Passed." || test.feedback;
	} else {
		test.correct = false;
		//test.feedback = test.feedback || "Unexpected Output: " + String(output);
		test.feedback = "Unexpected Output: " + String(output) || test.feedback;
	}
	//Set test graded flag to true, for gradingLog.gradeLog()

	test.graded = true;
	//Kill error handling timeout
	clearTimeout(this.currentTimeout);
	test.proc = null;
	//Reference this gradingLog for the anonymous function
	this[testID] = test;
	//Clear the input values.
	try {
		var block = getScript(test.blockSpec);
		setValues(block, Array(test['input'].length).join('a').split('a'));
	} catch(e) {
		throw "gradingLog.finishSnapTest: Trying to clear values of block that does not exist.";
	}
	var outputLog = this;
	//Find the next Snap reporter test
	for (var id = testID+1; id <= this.testCount;id++) {
		var next_test = this[id];
		//Continue to the next test if not a 'reporter' test type
		if (next_test.testClass === 'r' && !next_test.graded) {
			setTimeout(function() {
				outputLog.startSnapTest(id);
			},1);
			return;
		}
	}
	//If this was the last test, grade the log
	// console.log(this);
	this.scoreLog();
};

/*
 * Modifies an entry of the gradingLog without calling subsequent tests
 * as with .finishTest
 * Used to update the log in the event of a timeout, error,
 * or entry modification.
 */
gradingLog.prototype.updateLog = function(testID, output, feedback, correct) {
	var test = this[testID];
	try {
		test.graded = true;
		test.output = output;
		test.feedback = feedback || test.feedback;
		test.correct = correct || test.correct;

	} catch(e) {
		throw "gradingLog.finishTest: TestID is invalid.";
	}

}

/*
 * Evaluate the gradingLog, match the expected output with the recieved output
 * Add relevant feedback with associated issue. (Timeout, Error, bad output)
 * Additional processing occurs if all tests are evaluated:
 *	- pScore is calculated
 *  - Store the gradingLog in localStorage //TODO: Move this to a separate function?
 *  - Store the Snap! state in localStorage
 *  - Update the AG_status_bar, AGFinish()
*/
gradingLog.prototype.evaluateLog = function(testIDs) {
	// Evaluate all tests if no specific testIDs are specified.
	var outputLog = this;
	if (gradingLog.testCount === 0) {
		return gradingLog;
	}
	if (testIDs === undefined) {
		testIDs = [];
		for (var i = 1; i <= outputLog.testCount; i++) {
		   testIDs.push(i);
		}
	}
	// .allCorrect is initially true, and set to false if a test has failed.
	outputLog.allCorrect = true;
	// Passed test counter.
	var tests_passed = 0;
	//Set 'correct' and 'feedback' fields for all in testIDs
	for (var id of testIDs) {
		
		// if (outputLog[id]["output"] instanceof List) {
		//	console.log(outputLog[id]["output"].contents);
		// 	outputLog[id]["output"] = outputLog[id]["output"].asArray();
		// }
		//TODO: Terribly ugly. This should be abstracted.
		if (outputLog[id]['testClass'] === "a") {
			if (outputLog[id]['correct']) {
				tests_passed += 1;
			}
			continue;
		}
		if (outputLog[id]["correct"] === true) {
			tests_passed += 1;
			continue;
		}
		if (outputLog[id]["feedback"] === "Error!") {
			outputLog.allCorrect = false;
			outputLog[id]["output"] = "Error!";
		} else if (outputLog["" + id]["output"] === undefined) {
			outputLog.allCorrect = false;
			outputLog[id]["output"] = "Timeout error.";
			outputLog[id]["feedback"] = "Timeout error: Function did not finish before " +
				((outputLog[id]["timeOut"] < 0) ? 1000 : outputLog[id]["timeOut"]) + " ms.";
		} else if (snapEquals(outputLog[id]["output"], outputLog[id]["expOut"])) {
			//Changed === snapEquals() to better evaluate snap output
			outputLog[id]["feedback"] = "Correct!";
			outputLog[id]["correct"] = true;
		} else {
			outputLog.allCorrect = false;
			if (outputLog[id]["testClass"] === "r") {
				outputLog[id]["feedback"] = "Expected: " +
					outputLog[id]["expOut"] + " , Got: " + outputLog[id]["output"];
			} else if (outputLog[id]["testClass"] === "p") {
				//outputLog[id]["feedback"] = "Script is not"
			}
			outputLog[id]["correct"] = false;
		}
	}
	//Additional gradingLog fields are updated if all tests are evaluated.
	if (outputLog.testCount === testIDs.length) {
		// Calculate the pScore, the percentage of tests that have passed.
		outputLog.pScore = tests_passed / outputLog.testCount;
		//Save the output log to localStorage.
		//Saves _c_ 'correct' log if all tests passed.
		outputLog.saveLog();

		if (outputLog.allCorrect) {
			//TODO: Consider saving the XML in runAGTest()
			//Save the passing evaluated Log. key = taskID + "_c_test_log"
			//Save the passing Snap! XML string. key = taskID + "_c_test_state"
		}
	}

	//Update the AG status bar when the gradingLog is complete.
	AGFinish(this);
}

gradingLog.prototype.scoreLog = function() {
	if (this.testCount === 0) {
		return this;
	}
	var testIDs = [];
	for (var i = 1; i <= this.testCount; i++) {
		//If any tests are incomplete, return the log and prevent updating.
		if (!this[i].graded) { 
			console.log("scoreLog: The log is not yet complete.");
			return this; 
		}
	   	testIDs.push(i);
	}
	// .allCorrect is initially true, and set to false if a test has failed.
	this.allCorrect = true;
	// Passed test counter.
	var tests_passed = 0;
	var test;
	for (var id of testIDs) {
		test = this[id];
		//If the test is correct, increase the tests_passed counter.
		if (test.correct) {
			tests_passed += 1;
		} else {	//One failed test flips the allCorrect flag.
			this.allCorrect = false;
		}
	}

	//Calculate the pScore
	this.numCorrect = tests_passed;
	this.pScore = tests_passed / this.testCount;
	//this.numAttempts += 1;
	//Save the log in localStorage
	this.saveLog();

	//flip gradingLog.graded flag to true.
	this.graded = true;
	//Update the Autograder Status Bar
	AGFinish(this);
	return this;
}

/*
 * Convert the gradingLog into a dictionary that is returned by
 * edX getGrade().
 */
function dictLog(outputLog) {
	var outDict = {};
	//Populate tests
	for (var i = 1; i <=outputLog.testCount;i++) {
		var testDict = {};
		testDict["id"] = i;
		testDict["testClass"] = outputLog[i]["testClass"];
		if (outputLog[i]["blockSpec"] !== undefined) {
			testDict["blockSpec"] = "'(" + outputLog[i]["blockSpec"].replace(/%[a-z]/g, "[]") + ")'";
		}
		testDict["input"] = outputLog[i]["input"];
		testDict["expOut"] = outputLog[i]["expOut"];
		testDict["output"] = outputLog[i]["output"];
		testDict["correct"] = outputLog[i]["correct"];
		testDict["feedback"] = outputLog[i]["feedback"];
		outDict[i] = testDict;
	}
	//Populate outDict with outputLog instantiation variables.
	outDict["testCount"] = outputLog.testCount;
	outDict["allCorrect"] = outputLog.allCorrect;
	outDict["taskID"] = outputLog.taskID;
	outDict["pScore"] = outputLog.pScore;
	return outDict;
}

/*
*  print out the output log in a nice format
*/
function printLog(outputLog) {
	var testString = ""; //TODO: Consider putting Output Header
	for (var i = 1; i<=outputLog.testCount;i++) {
		testString += "[Test " + i + "]";
		testString += "Class: " + outputLog[i]["correct"];
		testString += " Block: '(" + outputLog[i]["blockSpec"].replace(/%[a-z]/g, "[]") + ")'";
		testString += " Input: " + outputLog[i]["input"];
		testString += " Expected Ans: " + outputLog[i]["expOut"];
		testString += " Got: " + outputLog[i]["output"];
		testString += " Correct: " + outputLog[i]["correct"];
		testString += " Feedback: " + outputLog[i]["feedback"] + "\n";
	}
	return testString;
}

/* Wrap the outputLog in an AG_State format. Used by AG_EDX.getGrade().
 * The 'checkState' is equivalent to gradingLog.allCorrect.
 * The 'feedback' is a copy of the gradingLog.
 * The 'comment' is updated if the gradeLog.evaluateLog() has been run.
 * @param {gradingLog} outputLog
 */
function AG_log(outputLog, snapXMLString) {
 	var AG_state = {
	    'checkState': outputLog.allCorrect,
	    'comment': "Please run the Snap Autograder before clicking the 'Submit' button.",
	    'feedback': dictLog(outputLog),
	    'snapXML' : snapXMLString
	};
	//Only update the
	if (outputLog.pScore !== null) {
		var percent_score = Number((outputLog.pScore * 100).toFixed(1));
		AG_state['comment'] = "Autograder Score: " + percent_score + "%"
	}
	return AG_state;

}

/* Add a test case to the outputLog if the assertion fails.
 * Currently does not add a test if the assertion succeeds.
 * TODO: Consider separating assertions into two classes
 * WARNING: DOES NOT EVALUATE LOG
 */
function testAssert(outputLog, assertion, pos_fb, neg_fb, ass_text) {
	if (assertion()) {
		outputLog.addAssert("a", assertion, pos_fb, ass_text, pos_fb, neg_fb);
	} else {
		outputLog.addAssert("a", assertion, neg_fb, ass_text, pos_fb, neg_fb);
	}
	return outputLog;
}

/* Snap block getters and setters used to retrieve blocks,
 * set values, and initiates blocks.
 */

function getSprite(index) {
	try {
		return world.children[0].sprites.contents[index];
	} catch(e) {
		throw "Sprite: " + index + " was not found."
	}
}

//Returns the scripts of the sprite at 'index', undefined otherwise.
function getScripts(index) {
	var sprite = getSprite(index);
	return sprite.scripts.children;
}
//Get just the most recently touched block that matches
function getScript(blockSpec, spriteIndex) {
	return getAllScripts(blockSpec, spriteIndex)[0];
}
function getAllScripts(blockSpec, spriteIndex) {
	//TODO: Consider expanding to grab from additional sprites
	//Try to get a sprite's scripts
	//Throw exception if none exist.
	spriteIndex = spriteIndex || 0;
	var scripts = getScripts(spriteIndex);
	//If no scripts, throw an exception.
	if (scripts.length === 0) {
		throw "No blocks/scripts were found."
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
		throw "The target block/script (" +
			blockSpec.replace(/%[a-z]/g, "[]") +
			") is not in script window.";
	}
	return validScripts;
}

function testScriptPresent(scriptString, scriptVariables, spriteIndex, outputLog) {
	//Populate optional parameters
	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	var JSONtemplate = stringToJSON(scriptString);
	var blockSpec = JSONtemplate[0].blockSp;
	var testID = outputLog.addTest("p", blockSpec, "n/a", true, -1);
	//Handle case when no scripts present on stage.
	try {
		var JSONtarget;
		var scriptsOnScreen = getAllScripts(blockSpec, spriteIndex);
		var isPresent;
		for (var i = 0; i < scriptsOnScreen.length; i++) {
			JSONtarget = JSONscript(scriptsOnScreen[i]);
			if (JSONtarget[0].blockSp === blockSpec) {
				isPresent = checkTemplate(JSONtemplate, JSONtarget, scriptVariables);
				if (isPresent) {
					break;
				}
			}
		}
	} catch(e) {
		var isPresent = false;
		var feedback = "Script Missing: The target script was not found in the scripts tab"
		outputLog.updateLog(testID, isPresent, feedback, isPresent);
		outputLog.evaluateLog();
		// return outputLog
		//Return undefined so the grade state doesn't change when no script is present.
		return outputLog;
	}
	//test that scripts match
	if (isPresent) {
		feedback = "The targeted script is present in the scripts tab.";
	} else {
		feedback = "The tested script did not match the target.";
	}
	outputLog.updateLog(testID, isPresent, feedback, isPresent);
	return outputLog;

}

function testBlockPresent(blockSpec, spriteIndex, outputLog) {
	//Populate optional parameters
	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	//Generate Log
	var testID = outputLog.addTest("p", blockSpec, "n/a", true, -1);
	var isPresent = isScriptPresent(blockSpec, spriteIndex);
	var feedback = null;
	if (isPresent) {
		feedback = "" + blockSpec + " is in the scripts tab.";
	} else {
		feedback = "Block Missing: " + blockSpec + " , was not found in the scripts tab";
	}
	outputLog.updateLog(testID, isPresent, feedback, isPresent);
	evaluateLog(outputLog);
	return outputLog;
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
	outputLog["" + testID]["proc"] = proc;
	return testID;
}

function multiTestBlock(blockSpec, inputs, expOuts, timeOuts, outputLog) {

	if (outputLog === undefined) {
		outputLog = new gradingLog(world);
	}
	if (inputs.length !== expOuts.length && inputs.length !== timeOuts.length) {
		throw "multiTestBlock: Mismatched arguments";
	}

	var testIDs = new Array(inputs.length);
	//TODO: Handle this error in startSnapTest
	//var scripts = getScript(blockSpec);
	//checkArrayForList(expOuts);

	for (var i=0;i<inputs.length; i++) {
		//checkArrayForList(inputs[i]);
		testIDs[i] = outputLog.addTest("r", blockSpec, inputs[i], expOuts[i], timeOuts[i]);
	}
	// testBlock(outputLog, testIDs[0]);
	// outputLog.currentTimeout = infLoopCheck(outputLog, testIDs[0]);
	return outputLog;
}

//David's code for checking an array for inner arrays
//then converting them to snap lists
//a - the JS Array you want to check for inner Arrays
function checkArrayForList(a) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] instanceof Array) {
			a[i] = new List(a[i]);
		}
	}
}

function setValues(block, values) {
	var valIndex = 0;

	var morphList = block.children;

	for (var morph of morphList) {
		if (morph.constructor.name === "InputSlotMorph") {
			morph.setContents(values[valIndex]);
			valIndex += 1;
		}
		if (morph instanceof ArgMorph) {

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

/* Read the return value of a Snap! process. The process
 * is an evaluating reporter block that updates a field in the
 * process on completion.
 */
function readValue(proc) {
	return proc.homeContext.inputs[0];
}

function prettyBlockString(blockSpec, inputs) {
	var pString = blockSpec;
	for (var inp in inputs) {
		pString = pString.replace(/%[a-z]/, inp);
	}
	return pString;
}

/*
*  Set a timeout for the test specified by testID and wait the appropriate time.
*  If the test does not finish by the specified time out, find the process
*  and kill it.
*/
function infLoopCheck(outputLog, testID) {
	var timeout = outputLog["" + testID]["timeOut"];

	if (timeout < 0) {
		timeout = 1000;
	}
	return setTimeout(function() {
			var stage = world.children[0].stage;
			if (outputLog["" + testID]["proc"].errorFlag) {
				outputLog["" + testID]["feedback"] = "Error!";
			}
			stage.threads.stopProcess(getScript(outputLog["" + testID]["blockSpec"]));
		}, timeout);
}


/* ------ START DAVID'S MESS ------ */

//SpriteEvent.prototype = new SpriteEvent();
SpriteEvent.prototype.constructor = SpriteEvent;

//SpriteEvent constructor
function SpriteEvent(sprite, index) {
	this.init(sprite, index);
}

//SpriteEvent constructor helper
SpriteEvent.prototype.init = function(_sprite, index) {
	this.sprite = index;
	this.x = _sprite.xPosition();
	this.y = _sprite.yPosition();
	this.direction = _sprite.direction();
	this.penDown = _sprite.isDown;
	this.scale = _sprite.parent.scale;
	this.ignore = false;
	this.bubble = _sprite.talkBubble();
	this.bubbleData = (this.bubble && this.bubble.data) || "nothing...";
}

//compares another SpriteEvent to this one for "equality"
SpriteEvent.prototype.equals = function(sEvent) {
	if (this.sprite === sEvent.sprite &&
		this.x === sEvent.x &&
		this.y === sEvent.y &&
		this.direction === sEvent.direction &&
		this.penDown === sEvent.penDown &&
		this.bubbleData === sEvent.bubbleData) {
		return true;
	}
	return false;
}

//SpriteEventLog constructor
function SpriteEventLog() {
	this.numSprites = 0;
	this.callVal = null;
}

//adds events to the event log
//_sprite is the sprite object and index is its index in the world array
//creates an array for each _sprite using its index as an identifier
//this method gets called every snap cycle
SpriteEventLog.prototype.addEvent = function(_sprite, index) {
	if (this["" + index] === undefined) {
		this["" + index] = [];
		this.numSprites++;
	}
	this["" + index].push(new SpriteEvent(_sprite, index));
	this.checkDup(index);
}

//Checks for a changed event state
//if the event is unchanged then remove it from the log
SpriteEventLog.prototype.checkDup = function(index) {
	var len = this["" + index].length;
	if (len < 2) {
		return;
	}
	if (this["" + index][len - 1].equals(this["" + index][len - 2])) {
		this["" + index].pop();
	} else if (this["" + index][len - 1]["scale"] !== this["" + index][len - 2]["scale"]) {
		this["" + index][len - 1].ignore = true;
	} 
}

//takes out all of the "ignored" events from the event log
//Warning! Modifies object!
//cascadeable
SpriteEventLog.prototype.spliceIgnores = function() {
	function helper(ary) {
		var newAry = [];
		for (var i = 0; i < ary.length; i++) {
			if (!ary[i].ignore) {
				newAry.push(ary[i]);
			}
		}
		return newAry;
	}

	for (var j = 0; j < this.numSprites; j++) {
		this["" + j] = helper(this["" + j]);
	}

	return this;
}

//Caompares one or more sprites according to an input function
//the input function must take care of all event errors and
//base cases (ex: must be 4 sprites)
SpriteEventLog.prototype.compareSprites = function(f) {
	if (this["" + 0] === undefined) {
		return false;
	}

	for (var i = 0; i < this["0"].length; i++) {
		if (!f.call(this, i)) {
			return false;
		}
	}

	return true;
}

//Prints out the event log
//ignore is an optional parameter that defaults to true
//ignore is used to ignore/not ignore those events with the ignore flag of true
function printEventLog(eventLog, ignore) {
	ignore = ignore || true;
	for (var j = 0; j < eventLog.numSprites; j++) {
		console.log(j + "\n");
		console.log("------------\n");
		for (var i = 0; i < eventLog["" + j].length; i++) {
			if (ignore && eventLog["" + j][i].ignore) {
				continue;
			}
			console.log("X pos: " + eventLog["" + j][i].x + "\n");
			console.log("Y pos: " + eventLog["" + j][i].y + "\n");
			console.log("Direction: " + eventLog["" + j][i].direction + "\n");
			console.log("Pen Down: " + eventLog["" + j][i].penDown + "\n");
			console.log("Stage Scale: " + eventLog["" + j][i].scale + "\n");
			console.log("Sprite says: " + eventLog["" + j][i].bubbleData);
		}
	}
}


//Very specific test for kalidiscope
//Does not test "clear"/"penup"/"pendown"
//Only tests for prescence of 4 sprites and
//proper sprite movements
function testKScope(outputLog, iter) {
	var snapWorld = outputLog.snapWorld;
	var taskID = outputLog.taskID;
	var gLog = outputLog;
	var eLog = new SpriteEventLog(),
		testID = gLog.addTest("s", undefined, null, true, -1),
		iterations = iter || 3,
		spriteList = snapWorld.children[0].sprites.contents;

	//creating this too early has caused issues with getting incorect data
	var collect = setInterval(function() {
        for (var i = 0; i < spriteList.length; i++) {
            eLog.addEvent(spriteList[i], i);
        }
	}, 5);

	var callback = function() {
		clearInterval(collect);
		//this loop hacky fixes the above issue
		for (var i = 0; i < eLog.numSprites; i++) {
			eLog["" + i][0].ignore = true;
		}
		eLog.callVal = eLog.spliceIgnores().compareSprites(function(i) {
			var log = this;
			gLog[testID].graded = true;
			gLog[testID]["feedback"] = gLog[testID]["feedback"] || "Test Passed.";
			gLog[testID].output = gLog[testID].correct = true;
			if (log && log.numSprites !== 4) {
				gLog[testID]["feedback"] = "You do not have the correct amount of Sprites." +
												"Make sure you have four different sprites.";
				gLog[testID].output = gLog[testID].correct = false;
				return false;
			}

			var x1 = eLog["0"][i].x, penDown1 = eLog["0"][i].penDown,
				x2 = eLog["1"][i].x, penDown2 = eLog["1"][i].penDown,
				x3 = eLog["2"][i].x, penDown3 = eLog["2"][i].penDown,
				x4 = eLog["3"][i].x, penDown4 = eLog["3"][i].penDown,
				y1 = eLog["0"][i].y,
				y2 = eLog["1"][i].y,
				y3 = eLog["2"][i].y,
				y4 = eLog["3"][i].y;

			if (penDown1 !== penDown2 !== penDown3 !== penDown4) {
				gLog[testID]["feedback"] = "One of your sprites did not draw to the stage. " +
												"Make sure your sprites all call pen down before " +
												"following the mouse.";
				gLog[testID].output = gLog[testID].correct = false;
				return false;
			}

			if (x1 + x2 + x3 + x4 !== 0 ||
				y1 + y2 + y3 + y4 !== 0) {
				gLog[testID]["feedback"] = "One or more sprite X, Y values are incorrect. " +
												"Make sure your sprites all go to the correct " +
												"mouse x, y values.";

				gLog[testID].output = gLog[testID].correct = false;
				return false;
			}
			return true;
		});
		gLog.scoreLog();
	};

	makeDragon(iterations, callback);
	return gLog;

}

//Get the distance between two points
//x1, y1 - from point coordinates
//x2, y2 - to point coordinates
function distance(x1, x2, y1, y2) {
	return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

//check to see if a number is within a tolerance +/-
//actual - the actual value you want to check
//projected - the value that you want to check actual against
//tolerance - the tolerance you are willing to accept
function inTolerance(actual, projected, tolerance) {
	return projected - tolerance < actual && projected + tolerance > actual;
}

//Get the smallest measured angle between two directions in degrees
//a, b - the directions in degrees to measure
function getAngle(a, b) {
	var result = Math.min(Math.abs(a - b), Math.abs(b - a));

	if (result > 180) {
		return 360 - result;
	}
	return result;
}

//find out if we can force the user to use the green flag top block
//test a script for drawing a simple uniform shape
//sides - the number of sides of the shape
//angle - the inner angle of the shape
//length - the length the sides should be
//blockSpec - not required at this time
//gradeLog - the grading log this test will be added to
function testUniformShapeInLoop(sides, angle, length, gradeLog, blockSpec) {
	var gLog = gradeLog || new gradingLog(),
		testID = gLog.addTest("s", blockSpec, null, true, -1),
		eLog = new SpriteEventLog(),
		block = blockSpec && getScript(blockSpec),
		//this collects the sprite log data
		collect = setInterval(function() {
        	for (var i = 0; i < spriteList.length; i++) {
            	eLog.addEvent(spriteList[i], i);
        	}
		}, 1),
		//the keyboard input spoof. Kicks off the test and does the final checks.
		spoof = new createInputSpoof(100, function() {
			var sidesCounted = 0,
				flag = false,
				result = true,
				feedback = "Correct!";

			clearInterval(collect);

			eLog.spliceIgnores();

			if (eLog["0"].length < 2) {
				gLog.updateLog(testID, result, "Not enough data points. Please run autograder again. " +
					"If this problem persists please contact the faculty.", result);
				console.log("not enough data points!");
				return;
			} else if (eLog["0"].length <= sides) {
				gLog.updateLog(testID, result, "Not enough sides in your shape. " +
					"Try raising your repeat loop iterations.", result);
				console.log("not enough sides!");
				return;
			} else if (eLog["0"].length > sides + 1) {
				gLog.updateLog(testID, result, "Too many sides in your shape. " +
					"Try lowering your repeat loop iterations.", result);
				console.log("too many sides!");
				return;
			}

			var initPos = eLog["0"][0],
				nextPos = eLog["0"][1],
				tol = 0.01;
				dist = 0,
				checkAngle = 0,
				i = 2;

			while (flag === false) {
				dist = distance(initPos.x, nextPos.x, initPos.y, nextPos.y);
				checkAngle = getAngle(initPos.direction, nextPos.direction);
				if (!inTolerance(dist, length, tol)) {
					flag = true;
					result = false;
					feedback = "Side length not correct! Make sure you are moving the sprite " +
						"the correct distance.";
					console.log("side not correct length");
				} else if (checkAngle !== angle) {
					flag = true;
					result = false;
					feedback = "Shape angle not correct! Make sure you are turning the sprite " +
						"the correct angle.";
					console.log("angle not correct");
				} else if (sidesCounted >= sides) {
					flag = true;
				} else {
					initPos = nextPos;
					if (i === eLog["0"].length) {
						i = 1;
					}
					nextPos = eLog["0"][i];
					sidesCounted += 1;
					i += 1;
				}
			}
			gLog.updateLog(testID, result, feedback, result);
			//setTimeout(gLog.scoreLog, 50);
		});

	spoof("green flag");
	spoof("callback");

	return gLog;

}

//turn an x coordinate into an x coordinate realitive to the
//drawing area in snap
function realitiveX(coord) {
	var centerStage = world.children[0].stage;
	var stageSize = centerStage.scale;
	return centerStage.center().x + coord / stageSize;
}

//turn an y coordinate into a y coordinate realitive to the
//drawing area in snap
function realitiveY(coord) {
	var centerStage = world.children[0].stage;
	var stageSize = centerStage.scale;
	return centerStage.center().y + coord / stageSize;
}

//Creates a protected function used to spoof user input
//timeout is how many milliseconds you want each action to take
//callback is an optional paramiter for a callback function
//element is an optional paramiter for a DOM element
function createInputSpoof(timeout, callback, element) {
	var timeoutCount = 0,
		timeoutInc = timeout,
		callB = callback || function() {return null;},
		element = element || "canvas";

	return (function(action, x, y) {
		var relX = x || 0,
			relY = y || 0,
			callVal = null,
			evt = null;

		relX = realitiveX(relX);
		relY = realitiveY(relY);

		switch(action){
			case "mousemove":
				evt = new MouseEvent(action, {clientX: relX, clientY: relY});
				setTimeout(function() {world.hand.processMouseMove(evt)}, timeoutCount);
				break;
			case "stop all":
				setTimeout(function() {world.children[0].stage.fireStopAllEvent()}, timeoutCount);
				break;
			case "green flag":
				setTimeout(function() {world.children[0].stage.fireGreenFlagEvent()}, timeoutCount);
				break;
			case "callback":
				setTimeout(function() {callB();}, timeoutCount);
				break;
			case "time":
				return timeoutCount;
			default:
				setTimeout(function() {world.children[0].stage.fireKeyEvent(action)}, timeoutCount);
		}
		timeoutCount += timeoutInc;
	});
}

//Demo for *GreenFlag Hat -> pen down -> forever(go to mouse x, y)*
function doTheThing() {
	var act = createInputSpoof(50);
	act("mousemove", 0, 0);
	act("green flag");
	act("mousemove", -10, 10);
	act("mousemove", 0, 20);
	act("mousemove", 10, 10);
	act("mousemove", 0, 0);
	act("stop all");
}

//Demo for *When space pressed Hat -> pen down -> forever(go to mouse x, y)*
function doTheOtherThing() {
var act = createInputSpoof(50);
	act("mousemove", 0, 0);
	act("space");
	act("mousemove", -10, -10);
	act("mousemove", 0, -20);
	act("mousemove", 10, -10);
	act("mousemove", 0, 0);
	act("stop all");
}

//The following functions will create a dragon fractal
//using spoofed mouse movements and the correct
//Snap! code

//Creates the dragon curve
function createCurve(iterations) {
	var ret = [],
		temp = [];
	for (var i = 0; i < iterations; i++) {
		for (var j = ret.length - 1; j >= 0; j--) {
			if (ret[j] === "R") {
				temp.push("L");
			} else {
				temp.push("R");
			}
		}
		ret.push("R");
		for (var k = 0; k < temp.length; k++) {
			ret.push(temp[k]);
		}
		temp = [];
	}
	return ret;
}

//Draws the dragon curve with spoofed mouse movemnets
//takes in the array of turns and the spoof function
function drawDragon(turns, func) {
	var lastMove = "up",
		lastX = 0,
		lastY = 0,
		dist = 5;
	for (var turn of turns) {
		if (turn === "R"){
			if (lastMove === "up") {
				lastMove = "right";
				lastX += dist;
			} else if (lastMove === "down") {
				lastMove = "left";
				lastX -= dist;
			} else if (lastMove === "left") {
				lastMove = "up";
				lastY += dist;
			} else {
				lastMove = "down";
				lastY -= dist;
			}
		} else {
			if (lastMove === "up") {
				lastMove = "left";
				lastX -= dist;
			} else if (lastMove === "down") {
				lastMove = "right";
				lastX += dist;
			} else if (lastMove === "left") {
				lastMove = "down";
				lastY -= dist;
			} else {
				lastMove = "up";
				lastY += dist;
			}
		}
		func("mousemove", lastX, lastY);
	}
}

//the function that is called to create and draw the dragon
//iterations is the number of folds the dragon has and
//callback is an optional callback function
function makeDragon(iterations, callback) {
	var turns = createCurve(iterations);
	var act = createInputSpoof(100, callback);
	act("mousemove", 0, 0);
	act("c");
	act("space");
	drawDragon(turns, act);
	act("stop all");
	act("callback");
	return act("time");
}

/* ------ END DAVID'S MESS ------ */


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
			if (morph.children.length == 0) {
				blockArgs.push([]);
			} else {
				blockArgs.push(JSONscript(morph.children[0]));
			}
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

/* Takes in string CUSTOMBLOCK, the strings BLOCKSPEC1 (any block)
 * and BLOCKSPEC2 (a conditional block), and their respective
 * optional arg arrays ARGARRAY1 and ARGARRAY2. Returns true if BLOCKSPEC1 is
 * inside of the block represented by BLOCKSPEC2.
 */
function CBlockContainsInCustom(customBlockSpec, spriteIndex, blockSpec1, blockSpec2, argArray1, argArray2) {
	if (argArray1 === undefined) {
		argArray1 = [];
	}
	if (argArray2 === undefined) {
		argArray2 = [];
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	try {
		var customBlock = getScript(customBlockSpec, spriteIndex);
	}
	catch(e) {
		return false;
	}
	var jsonifiedCustomBlock = JSONcustomBlock(customBlock);
	var script = jsonifiedCustomBlock.body;
	var block1 = {blockSp: blockSpec1, inputs: argArray1};
	var block2 = {blockSp: blockSpec2, inputs: argArray2};

	return CBlockContains(block1, block2, script);

}

/* Takes in an entire Sprite's SCRIPT and checks recursively if it contains
 * the string BLOCKSPEC that we are looking for. Returns true only if it finds
 * the block we are looking for. ARGARRAY only matters if it is populated (not an empty array)
 * Returns true if BLOCKSPEC/ARGARRAY (if looking for them) are found, otherwise returns false.
 *
 * The SCRIPT can be obtained by running the command, which gives you the
 * first block and access to all the blocks connected to that block:
 *
 * JSONscript(...)
 */
function scriptContainsBlock(script, blockSpec, argArray) {
	if (argArray === undefined) {
		argArray = [];
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
			if (morph1.blockSp === blockSpec) {
				if (argArray.length == 0) {
					return true;
				}
				else if ((argArray.length > 0) && _.isEqual(morph1.inputs, argArray)) {
					return true;
				}
			}
			if (scriptContainsBlock(morph1.inputs, blockSpec, argArray)) {
				return true;
			}
		}
	}
	return false;
}

/* Wrapper function that returns true if the given block with string BLOCKSPEC is anywhere on the screen.
 * Otherwise returns false. If ARGARRAY is an array, then we check that all of the inputs
 * are correct in addition to the blockspec. Otherwise we will just check that the blockspec is fine.
 */
function spriteContainsBlock(blockSpec, spriteIndex, argArray) {
	if (argArray === undefined) {
		argArray = [];
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	var JSONtarget;
	var hasFound = false;
	var scriptsOnScreen = getScripts(spriteIndex);
	for (var i = 0; i < scriptsOnScreen.length; i++) {
		JSONtarget = JSONscript(scriptsOnScreen[i]);
		hasFound = scriptContainsBlock(JSONtarget, blockSpec, argArray);
		if (hasFound) {
			return true;
		}
	}

	return false;
}

/* Takes in a JavaScript CUSTOMBLOCK which is JSONified and a string BLOCKSPEC. */
function customBlockContains(customBlockSpec, blockSpec, argArray, spriteIndex) {
	if (argArray === undefined) {
		argArray = [];
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	var JSONtarget;
	var hasFound = false;
	var scriptsOnScreen = getScripts(spriteIndex);
	for (var i = 0; i < scriptsOnScreen.length; i++) {
		JSONtarget = JSONscript(scriptsOnScreen[i]);
		if (JSONtarget[0].blockSp === customBlockSpec) {
			customJSON = JSONcustomBlock(scriptsOnScreen[i]);
			hasFound = scriptContainsBlock(customJSON.body, blockSpec, argArray);
		}
		if (hasFound) {
			return true;
		}
	}

	return false;
}

/* Takes in two javascript objects (block1 and block2) and a script.
 * Returns true if the block represented by BLOCK1 occurs inside 
 * the C-shaped block represented by BLOCK2. SCRIPT can be
 * obtained by calling:
 *
 * JSONscript(...)
 *
 * The following 8 blocks are considered C-shaped:
 *  -repeat, repeat until, warp, forever, for loop, if, if else, for each
 *
 */
function CBlockContains(block1, block2, script) {
    var morph1, type1, CblockSpecs;
    CblockSpecs = ["repeat %n %c", "warp %c", "forever %c", "for %upvar = %n to %n %cs"];
    CblockSpecs = CblockSpecs.concat(["repeat until %b %c", "if %b %c", "if %b %c else %c"]);
    CblockSpecs = CblockSpecs.concat(["for each %upvar of %l %cs"]);
    
    if (CblockSpecs.indexOf(block2.blockSp) < 0) {
        var rValue = "The second input should be a C-shaped block. See CBlockContains";
        rValue += " definition for a list of the blocks designated as C-shaped blocks.";
        return rValue;
    }

    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') { 
            if (CBlockContains(block1, block2, morph1)) {
                return true;
            }
        } else if (morph1.blockSp === block2.blockSp) {
            if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1.blockSp, block1.inputs)) {
                return true;
            }
            if ((morph1.blockSp === "if %b %c else %c")
                && (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 2], block1.blockSp, block1.inputs))) {
                return true;
            }
        } else if (CblockSpecs.indexOf(morph1.blockSp) >= 0) {
            if (CBlockContains(block1, block2, morph1.inputs[morph1.inputs.length - 1])) {
                return true;
            }
            if ((morph1.blockSp === "if %b %c else %c")
                && (CBlockContains(block1, block2, morph1.inputs[morph1.inputs.length - 2]))) {
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
 * SCRIPT can be obtained by calling:
 *
 * JSONscript(...)
 */
function simpleCBlockContains(script, blockSpec1, block2Name, argArray1, argArray2) {
        if (argArray1 === undefined) {
            argArray1 = [];
        }
        if (argArray2 === undefined) {
            argArray2 = [];
        }
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
        var block2 = {blockSp: block2Spec, inputs: argArray2};
        var block1 = {blockSp: blockSpec1, inputs: argArray1};
        return CBlockContains(block1, block2, script);
}


/* Takes in two javascript objects (representating a block (block1) and a C-shaped block (block2)), a
* SPRITEINDEX, and the current state of the OUTPUTLOG. 
* 
* Records to the OUTPUTLOG if the block represented by BLOCK1 occurs inside 
* the C-shaped block represented by BLOCK2 in any script in 
* the Scripts tab of the given sprite. See documentation of CBlockContains for 
* details of what blocks are considered C-shaped.
*/
function testCBlockContains(block1, block2, spriteIndex, outputLog) {
    //Populate optional parameters
    if (outputLog === undefined) {
        outputLog = new gradingLog();
    }
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }

    var block1Spec = block1.blockSp;
    var block2Spec = block2.blockSp;
    var testID = outputLog.addTest("p", block1Spec + ", " + block2Spec, "n/a", true, -1); //needs changing?
    var feedback;
    try {
        var JSONtarget;
        var doesContain;
        var scriptsOnScreen = getScripts(spriteIndex);
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            doesContain = CBlockContains(block1, block2, JSONtarget);
            if (doesContain) {
                break; //if any script on the scripting area has block1
                    //occuring inside block2, then this test will pass.
            }
        }
    } catch(e) {
        doesContain = false;
        feedback = "Error when looking to see if " + block1Spec + " is inside of";
        feedback += " " + block2Spec + " in script.";
        outputLog.updateLog(testID, doesContain, feedback, doesContain);
        outputLog.evaluateLog();
        //Return undefined so the grade state doesn't change when no script is present??
        return outputLog;
    }
    if (doesContain) {
        feedback = "The " + block1Spec + " block occurs inside of the " + block2Spec + " block.";
    } else {
        feedback = "The " + block1Spec + " block does not occur inside of the " + block2Spec + " block.";
    }
    outputLog.updateLog(testID, doesContain, feedback, doesContain);
    outputLog.evaluateLog();
    return outputLog;
}

/* Takes in a script SCRIPT, a string that is either "if" or "else" named CLAUSE, a blockspec
 * such as "move %n steps" BLOCK1SPEC, and an optional argument array ARGARRAY1 belonging to block1.
 * Returns true if the block represented by BLOCK1SPEC occurs inside the clause represented 
 * by CLAUSE in an if-else block in the SCRIPT, which can be obtained by calling:
 *
 * JSONscript(...)
 */
function ifElseContains(script, clause, block1Spec, argArray1) {
    if (!scriptContainsBlock(script, "if %b %c else %c")) {
        return false;
    }
    if (!(clause === "if" || clause === "else")) {
        return false; //return false or return a string!??!?!
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


/* Takes in two BLOCKSTRINGs representating the two blocks to be searched for, a
* SPRITEINDEX, and the current state of the OUTPUTLOG.
*
* Records to the OUTPUTLOG if block1 precedes block2 in any script in
* the Scripts tab of the given sprite. See documentation of blockPrecedes for
* details of what "precedes" means.
*/
function testBlockPrecedes(block1String, block2String, spriteIndex, outputLog) {
	//Populate optional parameters
	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	var block1Spec = stringToJSON(block1String)[0].blockSp;
	var block2Spec = stringToJSON(block2String)[0].blockSp;
	var testID = outputLog.addTest("p", block1Spec + ", " + block2Spec, "n/a", true, -1); //needs changing?
	var feedback;
	try {
		var JSONtarget;
		var doesPrecede;
		var scriptsOnScreen = getScripts(spriteIndex);
		for (var i = 0; i < scriptsOnScreen.length; i++) {
			JSONtarget = JSONscript(scriptsOnScreen[i]);
			doesPrecede = blockPrecedes(block1Spec, block2Spec, JSONtarget, false);
			if (doesPrecede) {
				break; //if any script on the scripting area has block1
					//occuring before block2, then this test will pass.
			}
		}
	} catch(e) {
		doesPrecede = false;
		feedback = "Error when looking to see if " + block1Spec + " precedes";
		feedback += " " + block2Spec + " in script.";
		outputLog.updateLog(testID, doesPrecede, feedback, doesPrecede);
		outputLog.evaluateLog();
		//Return undefined so the grade state doesn't change when no script is present??
		return outputLog;
	}
	if (doesPrecede) {
		feedback = "The " + block1Spec + " block precedes the " + block2Spec + " block.";
	} else {
		feedback = "The " + block1Spec + " block does not precede the " + block2Spec + " block.";
	}
	outputLog.updateLog(testID, doesPrecede, feedback, doesPrecede);
	outputLog.evaluateLog();
	return outputLog;
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

/* Takes in a BLOCKSTRING representation of the block to be counted, an EXPECTED 
* number of occurances of said block, a SPRITEINDEX, and the current state of the
* OUTPUTLOG. 
* 
* Records to the OUTPUTLOG if the given block occurs EXPECTED times in any script in 
* the Scripts tab of the given sprite. EXPECTED should be the minimum number of 
* times the given block must occur in order for the answer to be correct (if the 
* block doesn't occur at least EXPECTED times in a script, the feedback will notify 
* the student that the block does not occur enough times for the solution to be correct.
*/
function testOccurancesOfBlock(blockString, expected, spriteIndex, outputLog) {
	//Populate optional parameters
	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	var script = stringToJSON(blockString);
	var blockSpec = script[0].blockSp;
	var testID = outputLog.addTest("p", blockSpec, "n/a", true, -1); //needs changing?
	var feedback;
	try {
		var JSONtarget;
		var actual;
		var isCorrect = false;
		var maxTimes = 0;
		var scriptsOnScreen = getScripts(spriteIndex);
		for (var i = 0; i < scriptsOnScreen.length; i++) {
			JSONtarget = JSONscript(scriptsOnScreen[i]);
			actual = occurancesOfBlockSpec(blockSpec, JSONtarget);
			if (actual === expected) {
				isCorrect = true;
				break; //if any script on the scripting area has EXPECTED
					//occurances of the block, then this test will pass.
			}
			if (actual > maxTimes) {
				maxTimes = actual;
			}
		}
	} catch(e) {
		isCorrect = false;
		feedback = "Script does not occur in the scripts tab."
		outputLog.updateLog(testID, isCorrect, feedback, isCorrect);
		outputLog.evaluateLog();
		//Return undefined so the grade state doesn't change when no script is present??
		return outputLog;
	}
	if (isCorrect) {
		feedback = "The " + blockSpec + " block occurs " + expected + " times in your script.";
	} else if (maxTimes < expected) {
		feedback = "The " + blockSpec + " block should occur more than";
		feedback += " " + maxTimes + " times in your script.";
	} else {
		feedback = "The " + blockSpec + " block does not occur the correct number of";
		feedback += " times in your script.";
	}
	outputLog.updateLog(testID, isCorrect, feedback, isCorrect);
	outputLog.evaluateLog();
	return outputLog;
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

/* Takes in a JavaScript object SCRIPT that is the result of calling JSONscript() on
 * a piece of Snap! code and converts it to a string. Use this to pass into
 * isScriptPresent() function for grading purposes.
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
	return getTemplate(script1, script2);
}

/* Takes in a TEMPLATE and a student's SCRIPT and grades it by checking the pattern
 * against the student's pattern. Also takes in TEMPLATEVARIABLES, which is an array
 * containing the variables in TEMPLATE. This is a wrapper function for scriptsMatch(...).
 * Must pass in a parameter for vars in scriptsMatch as {}. Returns true if pattern
 * matches, else false. If softMatch is false, then it will literally check exactly
 * the values in the student's SCRIPT.
 */
function checkTemplate(template, script, templateVariables) {
	var vars = {};
	var softMatch = true;
	return scriptsMatch(template, script, softMatch, vars, templateVariables);
}
