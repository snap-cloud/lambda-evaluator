
//Snap Protocol Language Enabler


/*
	gradingLog is initialized when a block is tested.
	Tests are added to the log and the output value is
	updated when the Snap! process finishes. Finishing
	the last test causes the grading log to be evaluated.
*/
function gradingLog() {
	this.testCount = 0;
	this.qID = null;
	this.allCorrect = false;
	this.currentTimeout = null;
}

/*
*  Add a test to the gradingLog object
*  tests are tracked by a test ID number. 
*  Access specific parts of each test by:
*  		gradingLog.[""+(testID)]["testDesciption"]
*/
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

/*
*  Asyncronysly runs the input tests
*  Initiates a test, sets the time out for the test and
*  evaluates the test log once the last test has ran.
*  Uses a series of setTimeouts to make sure the asyncronous 
*  test threads do not clash with one another on setup.
*/
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
		clearTimeout(this.currentTimeout);
		setTimeout(function() {testBlock(glog, testID+1)},1);
		//TODO: generalize for all sprites?
		//TODO: Figure out a good default timeout NOW -> 1000ms
		this.currentTimeout = infLoopCheck(glog, testID+1);
	} else {
		setTimeout(function() {evaluateLog(glog)},1);
	}
	// return this["" + testID];
};

//Unused function that makes sure the test exisits in the log
//and updates the output and feedback accordingly
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

function setValues(block, values) {
	var valIndex = 0;

	var morphList = block.children;

	for (var morph in morphList) {
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
	try {
	var proc = stage.threads.startProcess(block, 
					stage.isThreadSafe,
					false,
					function() {
						outputLog.finishTest(testID, readValue(proc));
					});
	} catch(e) {
		var proc = "Error!";
		outputLog.finishTest(testID, proc, e);
	}
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
	for (var id in testIDs) {
		//Changed === snapEquals() to better evaluate snap output
		if (snapEquals(outputLog[id]["output"], outputLog[id]["expOut"])) {
			outputLog[id]["feedback"] = "Correct!";
		} else if (outputLog[id]["output"] === undefined) {
			outputLog.allCorrect = false;
			outputLog[id]["output"] = "Timeout error.";
			outputLog[id]["feedback"] = "Timeout error: Function did not finish before " + 
				((outputLog[id]["timeOut"] < 0) ? 1000 : outputLog[id]["timeOut"]) + " ms.";
		} else if (outputLog[id]["output"] === "Error!") {
			outputLog.allCorrect = false;
		} else {
			outputLog.allCorrect = false;
			outputLog[id]["feedback"] = "Incorrect Answer; Expected: " + 
				outputLog[id]["expOut"] + " , Got: " + outputLog[id]["output"];
		}
	}
	return outputLog;
}

/*
*  JSONify the output log 
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

/*
*  print out the output log in a nice format
*/
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
