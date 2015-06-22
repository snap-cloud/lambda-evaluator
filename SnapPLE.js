
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
*  		gradingLog.[""+(testID)]
*  Test Class include:
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
								 "proc": null};
	return this.testCount;
};

/*
*  Asyncronysly runs the input tests
*  Initiates a test, sets the time out for the test and
*  evaluates the test log once the last test has ran.
*  Uses a series of setTimeouts to make sure the asyncronous 
*  test threads do not clash with one another on setup.
*/
gradingLog.prototype.finishTest = function(testID, output, feedback, correct) {

	//Populate Grade Log
	if (this["" + testID] !== undefined) {
		this["" + testID]["output"] = output;
		this["" + testID]["feedback"] = feedback || this["" + testID]["feedback"];
		this["" + testID]["correct"] = correct || this["" + testID]["correct"];
	} else {
		throw "gradingLog.finishTest: TestID is invalid.";
	}

	//Initiate next test, kill timeout function for previous test
	// if this is the last test, evaluate the log
	// TODO: Integrate evaluateLog into finishTest
	var glog = this;
	if (testID < this.testCount) {
		clearTimeout(this.currentTimeout);
		setTimeout(function() {testBlock(glog, testID+1)},1);
		this.currentTimeout = infLoopCheck(glog, testID+1);
	} else {
		setTimeout(function() {evaluateLog(glog)}, 1);
	}
};

/*
 * Modifies an entry of the gradingLog without calling subsequent tests
 * as with .finishTest
 * Used to update the log in the event of a timeout, error, 
 * or entry modification.
 */
gradingLog.prototype.updateLog = function(testID, output, feedback, correct) {
	if (this["" + testID] !== undefined) {
		this["" + testID]["output"] = output;
		this["" + testID]["feedback"] = feedback || this["" + testID]["feedback"]
		this["" + testID]["correct"] = correct || this["" + testID]["correct"]
	} else {
		throw "gradingLog.finishTest: TestID is invalid.";
	}

}

/*
 * Convert the gradingLog into a dictionary that is returned by 
 * edX getGrade(). 
 */
function dictLog(outputLog) {
	var outDict = {};
	for (var i = 1; i <=outputLog.testCount;i++) {
		var testDict = {};
		testDict["id"] = i;
		testDict["testClass"] = outputLog[i]["testClass"];
		testDict["blockSpec"] = "'(" + outputLog[i]["blockSpec"].replace(/%[a-z]/g, "[]") + ")'";
		testDict["input"] = outputLog[i]["input"];
		testDict["expOut"] = outputLog[i]["expOut"];
		testDict["output"] = outputLog[i]["output"];
		testDict["correct"] = outputLog[i]["correct"];
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

/* Snap block getters and setters used to retrieve blocks,
 * set values, and initiates blocks.
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
	var JSONtarget = JSONscript(getScript(blockSpec, spriteIndex));
	//test that scripts match
		//TODO: update scriptsMatch function to take block objects, not objects on screen
	//var isPresent = scriptsMatch(JSONtemplate, JSONtarget, false);
	var isPresent = checkTemplate(JSONtemplate, JSONtarget, scriptVariables);
	if (isPresent) {
		feedback = "The targeted script is present in the scripts tab.";
	} else {
		feedback = "Script Missing: The target script was not found in the scripts tab";
	}
	outputLog.updateLog(testID, isPresent, feedback, isPresent);
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

/* Read the return value of a Snap! process. The process
 * is an evaluating reporter block that updates a field in the
 * process on completion.
 */
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
	outputLog["" + testID]["proc"] = proc;
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
		testIDs[i] = outputLog.addTest("r", blockSpec, inputs[i], expOuts[i], timeOuts[i]);
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
			if (outputLog["" + testID]["proc"].errorFlag) {
				outputLog["" + testID]["feedback"] = "Error!";
			}
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
		//Changed === snapEquals() to better evaluate snap output
		//re ordered the conditionals to make more sense and reduce errors
		if (outputLog[id]["correct"] === true) {
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
	return outputLog;
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
}

//compares another SpriteEvent to this one for "equality"
SpriteEvent.prototype.equals = function(sEvent) {
	if (this.sprite === sEvent.sprite &&
		this.x === sEvent.x &&
		this.y === sEvent.y &&
		this.direction === sEvent.direction &&
		this.penDown === sEvent.penDown) {
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
		if (!f(this, i)) {
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
		}
	}
}


//Very specific test for kalidiscope
//Does not test "clear"/"penup"/"pendown"
//Only tests for prescence of 4 sprites and 
//proper sprite movements
function testKScope(iter) {
	var eLog = new SpriteEventLog(),
		iterations = iter || 5,
		spriteList = world.children[0].sprites.contents;

	var collect = setInterval(function() {
        for (var i = 0; i < spriteList.length; i++) {
            eLog.addEvent(spriteList[i], i);
        }
	}, 5);

	var callback = function() {
		clearInterval(collect);
		eLog.callVal = eLog.spliceIgnores().compareSprites(function(log, i) {
				if (log && log.numSprites !== 4) {
					return false;
				}
				var x1 = log["0"][i].x, penDown1 = log["0"][i].penDown,
					x2 = log["1"][i].x, penDown2 = log["1"][i].penDown,
					x3 = log["2"][i].x, penDown3 = log["2"][i].penDown,
					x4 = log["3"][i].x, penDown4 = log["3"][i].penDown,
					y1 = log["0"][i].y,
					y2 = log["1"][i].y,
					y3 = log["2"][i].y,
					y4 = log["3"][i].y;

				if (x1 + x2 + x3 + x4 !== 0 ||
					y1 + y2 + y3 + y4 !== 0 ||
					penDown1 !== penDown2 !== penDown3 !== penDown4) {
					return false;
				}

				return true;
		});
		// this is where we would add a callback to getGrade or whatevers
		console.log(eLog.callVal);
	};

	makeDragon(iterations, callback);
	return eLog;

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
		call = callback || function() {return null;},
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
				setTimeout(function() {world.keyboardReceiver.fireStopAllEvent()}, timeoutCount);
				break;
			case "green flag":
				setTimeout(function() {world.keyboardReceiver.fireGreenFlagEvent()}, timeoutCount);
				break;
			case "callback":
				setTimeout(function() {callVal = call();}, timeoutCount);
			default:
				setTimeout(function() {world.keyboardReceiver.fireKeyEvent(action)}, timeoutCount);
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
	act("space");
	drawDragon(turns, act);
	act("stop all");
	act("callback");
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

/* Takes in an entire Sprite's SCRIPT and checks recursively if it contains
 * the JavaScript object BLOCK that we are looking for with specific inputs.
 * Returns true if BLOCK is found, otherwise returns false.
 *
 * The SCRIPT can be obtained by running the command, which gives you the
 * first block and access to all the blocks connected to that block:
 *
 * JSONscript(...)
 */
function scriptContains(script, block) {
	var morph1, type1;
	for (var i = 0; i < script.length; i++) {
		morph1 = script[i];
		type1 = typeof(morph1);

		if ((type1 === "string")) {
			continue;
		} else if (Object.prototype.toString.call(morph1) === '[object Array]') {
			if (scriptContains(morph1, block)) {
				return true;
			}
		} else {
			if (morph1.blockSp === block.blockSp) {
				if (_.isEqual(morph1, block)) {
					return true;
				}
			}
			if (scriptContains(morph1.inputs, block)) {
				return true;
			}
		}
	}

	return false;
}

/* A wrapper function that calls scriptContainsBlock by taking in the BLOCKARRAY
 * which is the result of calling JSONscript(...) which gives you back an array
 * of JavaScript objects. Since we are only working with one block, and hence only
 * one JavaScript object, we will just extract the sole element of this array and
 * pass that into scriptContains to get check if SCRIPT (also the result of calling
 * JSONscript(...)) contains the given element in BLOCKARRAY. Returns true if we find
 * the element in BLOCKARRAY, else return false.
 */
function scriptContainsBlock(script, blockArray) {
	var block = blockArray[0];
	return scriptContains(script, block);
}

/* Takes in two blockSpecs and boolean SEEN1, which is initialized to false.
 * Returns true if blockSpec string BLOCK1 precedes the blockSpec string BLOCK2
 * in terms of the order that they appear in the script SCRIPT which can be
 * obtained by calling:
 *
 * JSONscript(...)
 *
 * For further clarification, a block this:
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
	var morph1, morph2, type1, type2;
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

/* Checks if scripts are identical. */
function testScriptIdentical(scriptString, spriteIndex, outputLog) {
	//Populate optional parameters
	if (outputLog === undefined) {
		outputLog = new gradingLog();
	}
	if (spriteIndex === undefined) {
		spriteIndex = 0;
	}

	var JSONtemplate = stringToJSON(scriptString);
	var blockSpec = JSONtemplate[0].blockSp;
	var testID = outputLog.addTest(blockSpec, "n/a", true, -1);
	var JSONtarget = JSONscript(getScript(blockSpec, spriteIndex));
	//test that scripts match
		//TODO: update scriptsMatch function to take block objects, not objects on screen
	//var isPresent = scriptsMatch(JSONtemplate, JSONtarget, false);
	var vars = {};
	var softMatch = false;
	var isPresent = scriptsMatch(JSONtemplate, JSONtarget, softMatch, vars);
	if (isPresent) {
		feedback = "The targeted script is present in the scripts tab.";
	} else {
		feedback = "Script Missing: The target script was not found in the scripts tab";
	}
	outputLog.updateLog(testID, isPresent, feedback);
	evaluateLog(outputLog);
	return outputLog;

}
