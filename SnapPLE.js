
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
		setTimeout(function() {evaluateLog(glog)}, 1);
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

function testScriptPresent(scriptString, spriteIndex, outputLog) {
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
	var isPresent = (JSONtoString(JSONtemplate) == JSONtoString(JSONtarget));
	if (isPresent) {
		feedback = "The targeted script is present in the scripts tab.";
	} else {
		feedback = "Script Missing: The target script was not found in the scripts tab";
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
	outputLog["" + testID]["proc"] = proc;
	evalSingleProc(block, outputLog, testID);
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
		} else {
			outputLog.allCorrect = false;
			outputLog[id]["feedback"] = "Incorrect Answer; Expected: " +
				outputLog[id]["expOut"] + " , Got: " + outputLog[id]["output"];
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

/* Takes in a blockMorph BLOCK and checks if its blockspec matches the input
 * string BLOCKSPEC. Returns true if the given block has the same blockSpec
 * as the input, else false.
 * To get the script for a sprite you run the command:
 *
 * world.children[0].sprites.contents[0].scripts.children[0]
 *
 * this command gives you the first block, and access to all the ensueing
 * blocks too.
 */
function blockContainsBlockSpec(block, blockSpec) {
	return (block.blockSpec === blockSpec);
}

/* Takes in an entire Sprite's script and checks recursively if it contains
 * the string BLOCKSPEC that we are looking for. Returns true if BLOCKSPEC
 * is found, otherwise returns false.
 *
 * The script can be obtained by running the command, which gives you the
 * first block and access to all the blocks connected to that block:
 *
 * world.children[0].sprites.contents[0].scripts.children[0]
 */
function scriptContainsBlockSpec(script, blockSpec) {
	if (blockContainsBlockSpec(script, blockSpec)) {
		return true;
	}

	var morph;
	for (var i = 0; i < script.children.length; i++) {
		morph = script.children[i];
		if ((morph instanceof CSlotMorph)
			&& scriptContainsBlockSpec(morph.children[0], blockSpec)) {
			return true;
		} else if ((morph instanceof ReporterBlockMorph)
			&& scriptContainsBlockSpec(morph, blockSpec)) {
			return true;
		}
	}

	if(!(script.children[script.children.length - 1] instanceof BlockMorph)) {
		return false;
	}

	return scriptContainsBlockSpec(script.children[script.children.length - 1], blockSpec);
}

/* Takes in a blockSpec string BLOCK and a script SCRIPT
 * (which consists of many blocks) and returns which number block BLOCK is
 * within the entire script for the first occurance. For example, if we had
 * the following lines in Snap!:
 *
 * "move (10) steps"
 * "go to x:(6) y:(44)"
 * "turn clockwise (90) degrees"
 *
 * then calling our function with the blockSpec "move %n steps" would return 0.
 * Returns -1 if the block is not in the script.
 *
 * DOES NOT HANDLE IF STATEMENTS. ONLY CONTINOUS BLOCKS.
 */
function getBlockIndex(blockSpec, script) {
	var index = 0;
	if (blockContainsBlockSpec(script, blockSpec)) {
		return index;
	}

	var childrenList = script.children;
	var lastChild = childrenList[childrenList.length - 1];
	while (lastChild instanceof BlockMorph) {
		index ++;
		if (blockContainsBlockSpec(lastChild, blockSpec)) {
			return index;
		}
		lastChild = lastChild.children[lastChild.children.length - 1];
	}

	return -1;
}

/* Takes in two blockSpecs and returns true if blockSpec string BLOCK1
 * precedes the blockSpec string BLOCK2 in terms of the order that they
 * appear in the script SCRIPT which can be obtained by calling:
 *
 * world.children[0].sprites.contents[0].scripts.children[0]
 *
 * DO WE NEED TO HANDLE IF STATEMENTS? HOW TO DO SO?
 */
function blockPrecedes(block1, block2, script) {
	var position1, position2;
	position1 = getBlockIndex(block1, script);
	position2 = getBlockIndex(block2, script);
	if (position1 < position2) {
		return true;
	}
	return false;
}

/* Takes in a block BLOCK and returns the number of occurances
 * of the string BLOCKSPEC.
 *
 * Get the block by calling:
 *
 * world.children[0].sprites.contents[0].scripts.children[0]
 */
function occurancesOfBlockSpec(blockSpec, block) {
	var result = 0;
	var morph;
	if (block.blockSpec === blockSpec) {
		result ++;
	}
	for (var i = 0; i < block.children.length; i++) {
		morph = block.children[i];
		if (morph instanceof CSlotMorph) {
			result += occurancesOfBlockSpec(blockSpec, morph.children[0]);
		} else if (morph instanceof BlockMorph) {
			result += occurancesOfBlockSpec(blockSpec, morph);
		}
	}

	return result;
}

/* Returns true if the two scripts are exactly the same. Else returns false.
 * Takes in two scripts, SCRIPT1 and SCRIPT2. Also takes in a boolean called
 * SOFTMATCH, if this is true then we ignore the inputs and just match up the
 * blocks. Can obtain sprite's first script by calling:
 *
 * world.children[0].sprites.contents[0].scripts.children[0]
 *
 */
function scriptsMatch(script1, script2, softMatch) {
	if (script1.blockSpec !== script2.blockSpec) {
		return false;
	}
	if (script1.children.length !== script2.children.length) {
		return false;
	}

	var morph1, morph2;
	for (var i = 0; i < script1.children.length; i++) {
		morph1 = script1.children[i];
		morph2 = script2.children[i];
		if (morph1.constructor !== morph2.constructor) {
			return false;
		} else if ((morph1 instanceof CSlotMorph) && !(scriptsMatch(morph1.children[0], morph2.children[0], softMatch))) {
			return false;
		} else if ((morph1 instanceof BlockMorph) && !(scriptsMatch(morph1, morph2, softMatch))) {
			return false;
		} else if (!softMatch && (morph1 instanceof InputSlotMorph)) {
			if (morph1.children[0].text !== morph2.children[0].text) {
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





//Everything below here is trying to get genPattern() to work, just ignore it for now.





// /* Checks the inputs for the scripts, assuming that they match in terms
//  * of the blocks and if/else statements. The input EXPECTED is a JavaScript
//  * that object is our version of the correct answer with variables for the
//  * input (because each student's answer could be different). The input
//  * ACTUAL is the student's given JavaScript object that we are checking.
//  * This function returns true if the EXPECTED variable pattern matches
//  * the student's ACTUAL value pattern throughout their script. Returns
//  * false otherwise. Also, EXPECTED and ACTUAL need to be the result of calling
//  * JSONscript(EXPECTED) and JSONscript(ACTUAL) so that they are in this format:
//  *
//  * [{blockSp: "move %n steps",
//  *   inputs: [10]},
//  *  {blockSp: "turn %n degrees",
//  *   inputs: [{blockSpec: "%n + %n",
//  *             inputs: ["3", "2"]}]}]
//  */
// function inputsMatch(expected, actual) {
// 	var args = {};

// 	for (var i = 0; i < expected.inputs.length; i++) {     //need to finish this!!!
// 		ourScript.inputs[i]
// 	}
// }

// /* Returns the next character. Got this from StackOverflow at this link:
//  * http://stackoverflow.com/questions/12504042/what-is-a-method-that-can-be-used-to-increment-letters
//  */
// function nextChar(c) {
//     return String.fromCharCode(c.charCodeAt(0) + 1);
// }

//  Takes in two scripts that are both correct (and in the JSON format as
//  * returned by JSONscript())and returns a general pattern of the script
//  * (also in JSONscript() format) Where the inputs are the same, those
//  * must be the same in the general pattern. Where the inputs differ,
//  * we replace with a variable. Say we have these two scripts:
//  *
//  * move 30 steps      and    move 50 steps
//  * turn 90 degrees           turn 90 degrees
//  *
//  * then we will return a JSON representation with the input for the move as a
//  * variable and the input for the turn block as the value "90":
//  *
//  * move x steps
//  * turn 90 degrees
//  *
//  * must also take in another copy of script 1 as result. Do not want to modify
//  * script 1 because JavaScript passes a copy of the reference to script1.
//  * Also need to pass in JavaScript object VARIABLES that contains a mapping of
//  * the differeing values to different variables
//  * that will be used in our general pattern, in order. Array starts with the
//  * object that maps val:currVar. CurrVar should start with "a". {val: "a"}.
 
// function genPattern(script1, script2, result, variables, currVar) {
// 	for (var block = 0; block < script1.length; block++) {
// 		var currBlock1 = script1[block];
// 		var currBlock2 = script2[block];
// 		var currBlockResult = result[block];
// 		if (Object.prototype.toString.call(currBlock1) === "[object Array]") {
// 			genPattern(currBlock1, currBlock2, currBlockResult, variables, currVar);
// 		} else {
// 			var args1 = currBlock1.inputs;
// 			var args2 = currBlock2.inputs;
// 			var argsResult = currBlockResult.inputs;
// 			for (var i = 0; i < args1.length; i++) {
// 				if ((typeof(args1[i]) === "string") && (typeof(args2[i]) === "string")) {
// 					if (args1[i] !== args2[i]) {
// 						if (variables.hasOwnProperty(args1[i])) {
// 							argsResult[i] = variables[args1[i]];
// 						} else {
// 							variables[args1[i]] = currVar.val;
// 							argsResult[i] = currVar.val;
// 							currVar.val = nextChar(currVar.val);
// 						}
// 					}
// 				} else {
// 					genPattern(args1, args2, argsResult, variables, currVar);
// 				}
// 			}
// 		}
// 	}

// 	//return $.extend(variables, currVars);
// 	return result;
// }



