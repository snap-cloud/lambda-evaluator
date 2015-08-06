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
	this.totalPoints = 0;
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
	sessionStorage.setItem(this.taskID + "_test_log", log_string);
	if (this.allCorrect) { // If all tests passed.
		// Store the correct log in localStorage
		sessionStorage.setItem(this.taskID + "_c_test_log", log_string);
	}

}
/* 
 * Save the gradingLog.snapWorld into localStorage with the
 * specified key. Does nothing if 'store_key' or
 * gradingLog.snapWorld are unspecified (null or undefined).
 * @param {String} store_key
 */
gradingLog.prototype.saveSnapXML = function(store_key) {
	if (this.snapWorld !== null && store_key !== undefined) {
        sessionStorage.setItem(store_key, this.stringifySnapXML());
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
gradingLog.prototype.addTest = function(testClass, blockSpec, input, expOut, timeOut, isolate, point) {
	this.testCount += 1;
	this.totalPoints += point;
	this["" + this.testCount] = {"testClass": testClass,
								 "blockSpec": blockSpec,
								 "input": input,
								 "expOut": expOut,
								 "output": null,
								 "correct": false,
								 "feedback": null,
								 "timeOut": timeOut,
								 "proc": null,
								 'graded': false,
								 "isolated": isolate || false,
								 "pointValue": point,
								 "sprite": 0};
	//if thie expected output is an array, convert it to  snap list so snapEquals works

	return this.testCount;
};

gradingLog.prototype.addAssert = function(testClass, statement, feedback, text, pos_fb, neg_fb, point) {
	this.testCount += 1;
	this.totalPoints += point;
	this[this.testCount] = {'testClass': "a",
							'text': text,
							'correct': statement(),
							'assertion': statement,
							'feedback': feedback,
							'graded': true,
							'pos_fb': pos_fb,
							'neg_fb': neg_fb,
							'pointValue': point};
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
	test.output = "INVALID";
	//Retrieve the block from the stage TODO: Handle Errors
	try {
		var block = null;
		if (test.isolated) {
			block = setUpIsolatedTest(test.blockSpec, this, testID);
		} else {
			block = getScript(test.blockSpec);
		}
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
		var myself = this;
		//Launch timeout to handle Snap errors and infinitely looping scripts
		var timeout_id = setTimeout(function() {
			var stage = outputLog.snapWorld.children[0].stage;
			if (test['proc'].errorFlag) {
				test['feedback'] = "Snap Error." //TODO: Find error message from process or block
			} else {
				test['feedback'] = "Test Timeout Occurred."
			}
			test.output = "INVALID";
			stage.threads.stopProcess(getScript(outputLog[testID]["blockSpec"], test.sprite));
			test.correct = false;
			//Set the graded flag to true for this test.
			console.log(timeout);
			test.graded = true;
			// if (test.isolated) {
			// 	myself.snapWorld.children[0].sprites.contents[test.sprite].remove();
			// }
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

	//Added a variable "expOut" to check for snap Lists correctly
	var expOut = test.expOut;
	
	if (output === undefined) {
		test.output = null;
	} else {
		if (output instanceof List) {
			test.output = output.asArray();
		} else {
			test.output = output;
		}
	}
	console.log('TEST OUTPUT')
	console.log(test.output)

	if (expOut instanceof Array) {
		expOut = new List(expOut);
	}

	if (expOut instanceof Array) {
		expOut = new List(expOut);
	}

	//Update feedback and 'correct' flag depending on output.
	if (snapEquals(output, expOut)) {
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
		if (test.isolated) {
			console.log("removing sprite");
			this.snapWorld.children[0].sprites.contents[test.sprite].remove();
		} else {
			var block = getScript(test.blockSpec);
			setValues(block, Array(test['input'].length).join('a').split('a'));
		}
		// var block = getScript(test.blockSpec);
		// setValues(block, Array(test['input'].length).join('a').split('a'));
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
	var partial_points = 0;
	var test;
	for (var id of testIDs) {
		test = this[id];
		//If the test is correct, increase the tests_passed counter.
		if (test.correct) {
			tests_passed += 1;
			partial_points += test.pointValue;
		} else {	//One failed test flips the allCorrect flag.
			this.allCorrect = false;
		}
		// if (test.isolate) {
		// 	console.log("removing sprite");
		// 	var temp = test.sprite;
		// 	test.sprite = null;
		// 	this.snapWorld.children[0].removeSprite(temp);
		// }
	}

	//Calculate the pScore
	this.numCorrect = tests_passed;
	this.pScore = partial_points / this.totalPoints;
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
			testDict["blockSpec"] = "(" + outputLog[i]["blockSpec"].replace(/%[a-z]/g, "[]") + ")";
		}
		testDict["input"] = outputLog[i]["input"];
		testDict["expOut"] = outputLog[i]["expOut"];
		if (outputLog[i]["output"] instanceof List) {
			testDict["output"] = outputLog[i]["output"].contents
		} else {
			testDict["output"] = outputLog[i]["output"];
		}
		testDict["output"] = outputLog[i]["output"];
		testDict["correct"] = outputLog[i]["correct"];
		testDict["feedback"] = outputLog[i]["feedback"];
		testDict["pointValue"] = outputLog[i]["pointValue"];
		outDict[i] = testDict;
	}
	//Populate outDict with outputLog instantiation variables.
	outDict["testCount"] = outputLog.testCount;
	outDict["allCorrect"] = outputLog.allCorrect;
	outDict["taskID"] = outputLog.taskID;
	outDict["pScore"] = outputLog.pScore;
	outDict["totalPoints"] = outputLog.totalPoints;
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
function testAssert(outputLog, assertion, pos_fb, neg_fb, ass_text, point) {
	if (assertion()) {
		outputLog.addAssert("a", assertion, pos_fb, ass_text, pos_fb, neg_fb, point);
	} else {
		outputLog.addAssert("a", assertion, neg_fb, ass_text, pos_fb, neg_fb, point);
	}
	return outputLog;
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

function multiTestBlock(outputLog, blockSpec, inputs, expOuts, timeOuts, isolated, points) {

	if (outputLog === undefined) {
		outputLog = new gradingLog(world);
	}
	if (inputs.length !== expOuts.length && inputs.length !== timeOuts.length) {
		throw "multiTestBlock: Mismatched arguments";
	}

	var pointsArray = points;
	if (!Array.isArray(points)) {
		pointsArray = Array(inputs.length + 1).join(points).split("");
	}

	var testIDs = new Array(inputs.length);
	//TODO: Handle this error in startSnapTest
	//var scripts = getScript(blockSpec);

	for (var i=0;i<inputs.length; i++) {
		//checkArrayForList(inputs[i]);
		testIDs[i] = outputLog.addTest("r", blockSpec, inputs[i], expOuts[i], timeOuts[i], isolated[i], parseInt(pointsArray[i]));
	}
	// testBlock(outputLog, testIDs[0]);
	// outputLog.currentTimeout = infLoopCheck(outputLog, testIDs[0]);
	return outputLog;
}

//David's code for checking an array for inner arrays
//then converting them to snap lists
//a - the JS Array you want to check for inner Arrays
// PROBABLY USELES AT THE MOMENT
function checkArrayForList(a) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] instanceof Array) {
			a[i] = new List(a[i]);
		}
	}
}

//David added in a way to populate a list in the
//set values. Does not yet work for variables!
function setValues(block, values) {
	var valIndex = 0,
		morphIndex = 0;

	var morphList = block.children;

	for (var morph of morphList) {
		if (morph.constructor.name === "InputSlotMorph") {
			if (values[valIndex] instanceof Array) {
				setNewListToArg(values[valIndex], block, morphIndex);
			} else {
				morph.setContents(values[valIndex]);
			}
			valIndex += 1;
		} else if (morph instanceof ArgMorph && morph.type === "list") {
			setNewListToArg(values[valIndex], block, morphIndex);
			valIndex += 1;
		}
		morphIndex++;
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