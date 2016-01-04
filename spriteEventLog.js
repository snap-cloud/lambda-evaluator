/* ------ START DAVID'S MESS ------ */
// SpriteEvent.prototype = new SpriteEvent();
SpriteEvent.prototype.constructor = SpriteEvent;
// SpriteEvent constructor
function SpriteEvent(sprite, index) {
    this.init(sprite, index);
}
// SpriteEvent constructor helper
SpriteEvent.prototype.init = function(_sprite, index) {
    this.sprite = index;
    this.x = _sprite.xPosition();
    this.y = _sprite.yPosition();
    this.mouseX = _sprite.reportMouseX(),
    this.mouseY = _sprite.reportMouseY(),
    this.direction = _sprite.direction();
    this.penDown = _sprite.isDown;
    this.scale = _sprite.parent.scale;
    this.ignore = false;
    this.bubble = _sprite.talkBubble();
    this.bubbleData = (this.bubble && this.bubble.data) || "nothing...";
}
// compares another SpriteEvent to this one for "equality"
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
// SpriteEventLog constructor
function SpriteEventLog() {
    this.numSprites = 0;
    this.callVal = null;
}
// adds events to the event log// _sprite is the sprite object and index is its index in the world array// creates an array for each _sprite using its index as an identifier// this method gets called every snap cycle
SpriteEventLog.prototype.addEvent = function(_sprite, index) {
    if (this["" + index] === undefined) {
        this["" + index] = [];
        this.numSprites++;
    }
    this["" + index].push(new SpriteEvent(_sprite, index));
    this.checkDup(index);
}
// Checks for a changed event state// if the event is unchanged then remove it from the log
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
// takes out all of the "ignored" events from the event log// Warning! Modifies object!// cascadeable
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
// Caompares one or more sprites according to an input function// the input function must take care of all event errors and// base cases (ex: must be 4 sprites)
SpriteEventLog.prototype.compareSprites = function(f) {
    if (this["0"] === undefined) {
        return false;
    }

    for (var i = 0; i < this["0"].length; i++) {
        if (!f(i)) {
            return false;
        }
    }

    return true;
}
// Prints out the event log// ignore is an optional parameter that defaults to true// ignore is used to ignore/not ignore those events with the ignore flag of true
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
// THIS! is a way around making snap call a callback for EVERY process// I basically took the ThreadManager.prototype.removeTerminatedProcesses// and added a few lines// I temporarily replace ThreadManager.prototype.removeTerminatedProcesses// with this function for testing callbacks
function tempRemoveTP() {
    // and un-highlight their scripts
    var remaining = [];
    this.processes.forEach(function (proc) {
        if ((!proc.isRunning() && !proc.errorFlag) || proc.isDead) {
            if (proc.topBlock instanceof BlockMorph) {
                proc.topBlock.removeHighlight();
            }
            if (proc.prompter) {
                proc.prompter.destroy();
                if (proc.homeContext.receiver.stopTalking) {
                    proc.homeContext.receiver.stopTalking();
                }
            }

            if (proc.topBlock instanceof ReporterBlockMorph) {
                if (proc.onComplete instanceof Function) {
                    proc.onComplete(proc.homeContext.inputs[0]);
                } else {
                    if (proc.homeContext.inputs[0] instanceof List) {
                        proc.topBlock.showBubble(
                            new ListWatcherMorph(
                                proc.homeContext.inputs[0]
                            ),
                            proc.exportResult
                        );
                    } else {
                        proc.topBlock.showBubble(
                            proc.homeContext.inputs[0],
                            proc.exportResult
                        );
                    }
                }
           // This else block is the newly added code, it simply runs the callback
            } else {
                if (proc.onComplete instanceof Function) {
                    proc.onComplete();
                }
            }
        } else {
            remaining.push(proc);
        }
    });
    this.processes = remaining;
}
// Specific test function for snap autograder// Tests if a FOR block "says" 0 through 30 by even numbers// This test temporarily modifies Snap itself by using tempRemoveTP
//@param outputLog - the required test output Log
function testSayTo30(outputLog) {
    var backupOrigFunc = ThreadManager.prototype.removeTerminatedProcesses;
    ThreadManager.prototype.removeTerminatedProcesses = tempRemoveTP;

    var block = getScript("for %upvar = %n to %n %cs"),
        gLog = outputLog,
        eLog = new SpriteEventLog(),
        testID = gLog.addTest("s", undefined, null, true, -1),
        spriteList = gLog.snapWorld.children[0].sprites.contents,
        collect = setInterval(function() {
               eLog.addEvent(spriteList[0], 0);
        }, 5);

    var stage = gLog.snapWorld.children[0].stage;
    stage.threads.startProcess(block,
        stage.isThreadSafe,
        false,
        function() {
            clearInterval(collect);
           // this loop hacky fixes the above issue
            eLog["0"][0].ignore = true;
            eLog.spliceIgnores();
            gLog[testID].graded = true;
            gLog[testID]["feedback"] = gLog[testID]["feedback"] || "Beautiful!";
            gLog[testID].output = gLog[testID].correct = true;
            var num = 2;
            for (var i = 0; i < eLog["0"].length; i++) {
                if (eLog["0"][i].bubbleData === "nothing...") {
                    continue;
                }
                if (num !== eLog["0"][i].bubbleData) {
                    break;
                } else {
                    num += 2;
                }
            }

            if (num !== 32) {
                gLog[testID]["feedback"] = "You did not 'say' every even number from 0 to 30.";
                gLog[testID].output = gLog[testID].correct = false;
            }

        ThreadManager.prototype.removeTerminatedProcesses = backupOrigFunc;
            gLog.scoreLog();
        });

    return gLog;
}

function testStateOfWater(outputLog) {
   // add a catch for if the blockspec is not found!
    testContitionalSay(outputLog, "state of water %", "100", "gas");
    testContitionalSay(outputLog, "state of water %", "0", "solid");
    testContitionalSay(outputLog, "state of water %", "10", "liquid");
    return outputLog;
}

function testTrafficSignal(outputLog) {

    testContitionalSay(outputLog, "traffic signal %", "green", "go");
    testContitionalSay(outputLog, "traffic signal %", "red", "stop");
    return outputLog;
}

function testContitionalSay(outputLog, blockSpec, input, expOut, point) {
    var backupOrigFunc = ThreadManager.prototype.removeTerminatedProcesses;
    ThreadManager.prototype.removeTerminatedProcesses = tempRemoveTP;
    try {
        var gLog = outputLog,
            eLog = new SpriteEventLog(),
            testID = gLog.addTest("s", blockSpec, input, expOut, -1, point),
            block = setUpIsolatedTest(blockSpec, gLog, testID);

        if (!(input instanceof Array)) {
            input = [input];
        }

        setValues(block, input);

    } catch(e) {
        gLog[testID].graded = true;
        gLog[testID]["feedback"] = e;
        gLog[testID].correct = false;
        ThreadManager.prototype.removeTerminatedProcesses = backupOrigFunc;
        return outputLog;
    }

       // spriteList = gLog.snapWorld.children[0].sprites.contents,
    var collect = setInterval(function() {
               eLog.addEvent(gLog[testID].sprite, 0);
        }, 5);

    var stage = gLog.snapWorld.children[0].stage;
    stage.threads.startProcess(block,
        stage.isThreadSafe,
        false,
        function() {
            clearInterval(collect);
           // this loop hacky fixes the above issue
            eLog.spliceIgnores();
            gLog[testID].graded = true;
            gLog[testID]["feedback"] = gLog[testID]["feedback"] || "Beautiful!";
            gLog[testID].correct = true;

            for (var i = 0; i < eLog["0"].length; i++) {
                if (eLog["0"][i].bubbleData === "nothing...") {
                    continue;
                }
                if (eLog["0"][i].bubbleData.toLowerCase() !== expOut) {
                    gLog[testID]["feedback"] = "Did not 'say' the proper phrase for " + input[0];
                    gLog[testID].output = eLog["0"][i].bubbleData;
                    gLog[testID].correct = false;
                } else {
                    gLog[testID].output = eLog["0"][i].bubbleData;
                }
            }

            gLog[testID].sprite.remove();
            gLog[testID].sprite = null;
            var allGraded = true;
            for (var i = 1; i <= gLog.testCount; i++) {
                if (!gLog[i].graded) { 
                    allGraded = false;
                }
            }
            if (allGraded) {
                ThreadManager.prototype.removeTerminatedProcesses = backupOrigFunc;
                gLog.scoreLog();
            }
        });
}
// Specific test function for snap autograder// Checks for a sprite following the Y and -X of the user mouse input// Super similar to testKScope! // Does not check for PenDown however
function testMouseMove(outputLog, iter, point) {
    var snapWorld = outputLog.snapWorld;
    var taskID = outputLog.taskID;
    var gLog = outputLog;
    var eLog = new SpriteEventLog(),
        iterations = iter || 3,
        testID = gLog.addTest("s", undefined, null, true, -1, point),
        spriteList = snapWorld.children[0].sprites.contents;

   // creating this too early has caused issues with getting incorect data
    var collect = setInterval(function() {
        for (var i = 0; i < spriteList.length; i++) {
            eLog.addEvent(spriteList[i], i);
        }
    }, 5);

    var callback = function() {
        clearInterval(collect);
       // this loop hacky fixes the above issue
        eLog["0"][0].ignore = true;
        
        eLog.spliceIgnores();
        
        gLog[testID].graded = true;
        gLog[testID]["feedback"] = gLog[testID]["feedback"] || "Beautiful!";
        gLog[testID].output = gLog[testID].correct = true;

        for (var j = 0; j < eLog["0"].length; j++) {
            var spriteX = eLog["0"][i].x, mouseX = eLog["0"][i].mouseX,
                spriteY = eLog["0"][i].y, mouseY = eLog["0"][i].mouseY;

            if (spriteX !== -mouseX || spriteY !== mouseY) {
                gLog[testID]["feedback"] = "One or more sprite X, Y values are incorrect. " +
                                                "Make sure your sprites all go to the correct " +
                                                "mouse x, y values.";

                gLog[testID].output = gLog[testID].correct = false;
            }
        }

        gLog.scoreLog();
    };

    makeDragon(iterations, callback);
    return gLog;

}
// Very specific test for kalidiscope// Does not test "clear"/"penup"/"pendown"// Only tests for prescence of 4 sprites and// proper sprite movements
function testKScope(outputLog, iter, point) {
    var snapWorld = outputLog.snapWorld;
    var taskID = outputLog.taskID;
    var gLog = outputLog;
    var eLog = new SpriteEventLog(),
        testID = gLog.addTest("s", undefined, null, true, -1, false, point),
        iterations = iter || 3,
        spriteList = snapWorld.children[0].sprites.contents;
    console.log(gLog);

    gLog[testID].graded = true;
    gLog[testID]["feedback"] = gLog[testID]["feedback"] || "Beautiful Kaleidoscope!";
    gLog[testID].output = gLog[testID].correct = true;
    if (spriteList && spriteList.length !== 4) {
        gLog[testID]["feedback"] = "You do not have the correct amount of Sprites. " +
                                    "Make sure you have four different sprites.";
        gLog[testID].output = gLog[testID].correct = false;
        gLog.scoreLog();
        return gLog;
    }

   // creating this too early has caused issues with getting incorect data
    var collect = setInterval(function() {
        for (var i = 0; i < spriteList.length; i++) {
            eLog.addEvent(spriteList[i], i);
        }
    }, 5);

    var callback = function() {
        clearInterval(collect);
       // this loop hacky fixes the above issue
        for (var i = 0; i < eLog.numSprites; i++) {
            eLog["" + i][0].ignore = true;
        }
        
        eLog.spliceIgnores();
        console.log(eLog);

        for (var j = 0; j < eLog.numSprites; j++) {
            if (eLog["" + j].length < 3) {
                gLog[testID]["feedback"] = "One of your sprites did not move at all. " +
                                            "Make sure your sprites use the 'Go to X: Y:' " +
                                            "block to follow the mouse.";
                gLog[testID].output = gLog[testID].correct = false;
            }
        }

        if (gLog[testID].correct) {
            eLog.callVal = eLog.compareSprites(function(i) {
                var log = this;
                /*
                gLog[testID].graded = true;
                gLog[testID]["feedback"] = gLog[testID]["feedback"] || "Beautiful Kaleidoscope!";
                gLog[testID].output = gLog[testID].correct = true;
                if (log && log.numSprites !== 4) {
                    gLog[testID]["feedback"] = "You do not have the correct amount of Sprites." +
                                                "Make sure you have four different sprites.";
                    gLog[testID].output = gLog[testID].correct = false;
                    return false;
                }*/

                var x1 = eLog["0"][i].x, penDown1 = eLog["0"][i].penDown,
                    x2 = eLog["1"][i].x, penDown2 = eLog["1"][i].penDown,
                    x3 = eLog["2"][i].x, penDown3 = eLog["2"][i].penDown,
                    x4 = eLog["3"][i].x, penDown4 = eLog["3"][i].penDown,
                    y1 = eLog["0"][i].y,
                    y2 = eLog["1"][i].y,
                    y3 = eLog["2"][i].y,
                    y4 = eLog["3"][i].y;

                console.log(penDown1 + " " + penDown2 + " " + penDown3 + " " + penDown4);

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
        }
        gLog.scoreLog();
    };

    makeDragon(iterations, callback);
    return gLog;

}
// Get the distance between two points// x1, y1 - from point coordinates// x2, y2 - to point coordinates
function distance(x1, x2, y1, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}
// check to see if a number is within a tolerance +/-// actual - the actual value you want to check// projected - the value that you want to check actual against// tolerance - the tolerance you are willing to accept
function inTolerance(actual, projected, tolerance) {
    return projected - tolerance < actual && projected + tolerance > actual;
}
// Get the smallest measured angle between two directions in degrees// a, b - the directions in degrees to measure
function getAngle(a, b) {
    var result = Math.min(Math.abs(a - b), Math.abs(b - a));

    if (result > 180) {
        return 360 - result;
    }
    return result;
}
// find out if we can force the user to use the green flag top block// test a script for drawing a simple uniform shape// sides - the number of sides of the shape// angle - the inner angle of the shape// length - the length the sides should be// blockSpec - not required at this time// gradeLog - the grading log this test will be added to
function testUniformShapeInLoop(sides, angle, length, gradeLog, blockSpec, point) {
    var gLog = gradeLog || new gradingLog(),
        testID = gLog.addTest("s", blockSpec, null, true, -1, point),
        eLog = new SpriteEventLog(),
        block = blockSpec && getScript(blockSpec),
       // this collects the sprite log data
        collect = setInterval(function() {
            for (var i = 0; i < spriteList.length; i++) {
                eLog.addEvent(spriteList[i], i);
            }
        }, 1),
       // the keyboard input spoof. Kicks off the test and does the final checks.
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
           // setTimeout(gLog.scoreLog, 50);
        });

    spoof("green flag");
    spoof("callback");

    return gLog;

}
// turn an x coordinate into an x coordinate realitive to the// drawing area in snap
function realitiveX(coord) {
    var centerStage = world.children[0].stage;
    var stageSize = centerStage.scale;
    return centerStage.center().x + coord / stageSize;
}
// turn an y coordinate into a y coordinate realitive to the// drawing area in snap
function realitiveY(coord) {
    var centerStage = world.children[0].stage;
    var stageSize = centerStage.scale;
    return centerStage.center().y + coord / stageSize;
}
// Creates a protected function used to spoof user input// timeout is how many milliseconds you want each action to take// callback is an optional paramiter for a callback function// element is an optional paramiter for a DOM element
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
                setTimeout(function() {console.log("mouse Move"); world.hand.processMouseMove(evt)}, timeoutCount);
                break;
            case "stop all":
                setTimeout(function() {console.log("stop all"); world.children[0].stage.fireStopAllEvent()}, timeoutCount);
                break;
            case "green flag":
                setTimeout(function() {console.log("green flag"); world.children[0].stage.fireGreenFlagEvent()}, timeoutCount);
                break;
            case "callback":
                setTimeout(function() {console.log("callback"); callB();}, timeoutCount);
                break;
            case "time":
                return timeoutCount;
            default:
                setTimeout(function() {console.log("keypress"); world.children[0].stage.fireKeyEvent(action)}, timeoutCount);
        }
        timeoutCount += timeoutInc;
    });
}
// Demo for *GreenFlag Hat -> pen down -> forever(go to mouse x, y)*
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
// Demo for *When space pressed Hat -> pen down -> forever(go to mouse x, y)*
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
// The following functions will create a dragon fractal// using spoofed mouse movements and the correct// Snap! code
// Creates the dragon curve
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
// Draws the dragon curve with spoofed mouse movemnets// takes in the array of turns and the spoof function
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
// the function that is called to create and draw the dragon// iterations is the number of folds the dragon has and// callback is an optional callback function
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
// takes a block spec and attempts to get the input list for it// used for testing and demo purposes mostly
function getListBlock(blockSpec, spriteIndex) {
    var block = null,
        listArgs = [];
    if (isScriptPresent(blockSpec, spriteIndex)) { // This block is DEPRICATED, use ScriptPresentInSprite
        block = getScript(blockSpec);
    } else {
        return listArgs;
    }
    if (block && blockSpec === "list %exp") {
        listArgs.push(block);
    }
    for (var i = 0; i < block.children.length; i++) {
        if (block.children[i].blockSpec && block.children[i].blockSpec === "list %exp") {
            listArgs.push(block.children[i]);
        } else if (block.children[i].blockSpec && block.children[i].category === "variables") {
            var name = block.children[i].blockSpec,
                vars = world.children[0].globalVariables,
                variable = vars.silentFind(name),
                val = null;

            if (variable && (val = vars.getVar(name)) instanceof List) {
                listArgs.push(val);
            }
           // Find out how to handle variables!
        }
    }
    return listArgs;
}

function getPaletteScripts(pal, whichWorld) {
    if (whichWorld === undefined) {
        whichWorld = world;
    }
    return whichWorld.children[0].sprites.contents[0].palette(pal).children[0].children;
}





function simplifySpec(blockSpec) {
    var spec = blockSpec.split(" ");
    var newSpec = "";
    for (var i = 0; i < spec.length; i++) {
        if (spec[i] === "%l") {
            spec[i] = "%s";
        }
        newSpec += spec[i] + " ";
    }
    newSpec = newSpec.slice(0, -1);
    return newSpec;
}





// function createTestSprite(log, test) {
//    var ide = log.snapWorld.children[0];
//    var sprite = addInvisibleSprite(ide);
//    log[testID].sprite = sprite;
//    return sprite;
//}

function waitForAsk(gradingLogTest, timeout, callback) {
    var gLog = gradingLogTest,
        timeout = timeout || 5000;

    function wait() {
        var hasPrompt = gLog.proc && gLog.proc.prompter && !gLog.proc.prompter.isDone;

        if (!hasPrompt) {
            if (timeout < 0) {
                gLog.feedback = "Remember to use the 'Ask And Wait' block for user input.";
                gLog.correct = false;
                gLog.proc.stop();
            } else {
                timeout -= 100;
                console.log("waiting");
                setTimeout(wait, 100);
            }
        } else {
            console.log("prompter present!")
            callback();
        }
    }
    wait();
}

function inputAsk(gradingLogTest, input) {
    if (gradingLogTest.proc && gradingLogTest.proc.prompter) {
        console.log("ask was input");
        gradingLogTest.proc.prompter.inputField.setContents(input);
        gradingLogTest.proc.prompter.accept();
    } else {
        gLog.feedback = "We couldn't find a promt to input out guesses into.";
        gLog.correct = false;
        gLog.proc.stop();
    }
}

function checkVariable(proc, varname, val) {
    var variable = proc.homeContext.variables.vars[varname];
    console.log(variable);
    return variable && variable.value == val;
}

function testAskFun(gradingLog, blockSpec) {
    var gLog = gradingLog || new gradingLog(world);
    var block = getScript(blockSpec);
    var stage = gLog.snapWorld.children[0].stage;
    var testID = gLog.addTest("s", blockSpec, null, true, -1, 1);
    var backupOrigFunc = ThreadManager.prototype.removeTerminatedProcesses;
    ThreadManager.prototype.removeTerminatedProcesses = tempRemoveTP;

    gLog[testID].proc = stage.threads.startProcess(block,
                    stage.isThreadSafe,
                    false,
                    function() {
                        console.log("Proc ended");
                        ThreadManager.prototype.removeTerminatedProcesses = backupOrigFunc;
                        gLog[testID].proc = null;
                        gLog.scoreLog();
                    });

    gLog[testID].graded = true;

    waitForAsk(gLog[testID], 1000, function(){

        console.log("Input secret word.");

        if (!checkVariable(gLog[testID].proc, "guesses", "0")) {
            gLog[testID].feedback = "Make sure to initilize your 'guesses' variable with 0";
            gLog[testID].correct = false;
            stage.fireStopAllEvent();
            return;
        }
        if (!checkVariable(gLog[testID].proc, "guess", 0)) {
            gLog[testID].feedback = "Make sure to create a 'guess' variable.";
            gLog[testID].correct = false;
            stage.fireStopAllEvent();
            return;
        }
        if (!checkVariable(gLog[testID].proc, "secret", 0)) {
            gLog[testID].feedback = "Make sure to create a 'secret' variable.";
            gLog[testID].correct = false;
            stage.fireStopAllEvent();
            return;
        }

        inputAsk(gLog[testID], "supercalifragilistic");

        waitForAsk(gLog[testID], 5000, function(){

            console.log("Input first guess.");

            if (!checkVariable(gLog[testID].proc, "secret", "supercalifragilistic")) {
                gLog[testID].feedback = "Make sure to update the 'secret' variable with the first input.";
                gLog[testID].correct = false;
                stage.fireStopAllEvent();
                return;
            }

            inputAsk(gLog[testID], "suqeqcaqifrqgilqstiq");

            waitForAsk(gLog[testID], 5000, function(){

                console.log("Input second guess.");

                if (!checkVariable(gLog[testID].proc, "guess", "suqeqcaqifrqgilqstiq")) {
                    gLog[testID].feedback = "Make sure to update the 'guess' variable with the players guess.";
                    gLog[testID].correct = false;
                    stage.fireStopAllEvent();
                    return;
                }
                if (!checkVariable(gLog[testID].proc, "guesses", 1)) {
                    gLog[testID].feedback = "Make sure to add one to your 'guesses' variable with every input guess.";
                    gLog[testID].correct = false;
                    stage.fireStopAllEvent();
                    return;
                }            

                inputAsk(gLog[testID], "suqeqcaqifrqgil");

                waitForAsk(gLog[testID], 5000, function(){

                    console.log("Input correct guess.");

                    if (!checkVariable(gLog[testID].proc, "guess", "suqeqcaqifrqgil")) {
                        gLog[testID].feedback = "Make sure to update the 'guess' variable with the players guess.";
                        gLog[testID].correct = false;
                        stage.fireStopAllEvent();
                        return;
                    }
                    if (!checkVariable(gLog[testID].proc, "guesses", 2)) {
                        gLog[testID].feedback = "Make sure to add one to your 'guesses' variable with every input guess.";
                        gLog[testID].correct = false;
                        stage.fireStopAllEvent();
                        return;
                    }

                    inputAsk(gLog[testID], "supercalifragilistic");

                    gLog[testID].feedback = "Very nice job!";
                    gLog[testID].correct = true;

                });
            });
        });
    });

    return gLog;
}

/* ------ END DAVID'S MESS ------ */