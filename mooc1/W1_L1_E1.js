var starter_path = null;

// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_W1_L1_E1";
var id = courseID + taskID;
var isEDX = isEDXurl();

// if this question is not meant to be graded, change this flag to false
var graded = true;

// to hide feedback for this problem, change this flag to false
var showFeedback = true;

// to allow for the ability to regrade certain tests, change this flag to true
var regradeOn = false;

// Add tests to the outputLog. Function is called by runAGTest(id, outputLog)
// var testLog;
function AGTest(outputLog) {
    
    // /* Recreate pendown/repeat/move/turn */
    var firstScriptExists = function firstScriptExists() {
        return scriptPresentInSprite('[{"blockSp":"pen down","inputs":[]},{"blockSp":"repeat %n %c","inputs":["4",[{"blockSp":"move %n steps","inputs":["50"]},{"blockSp":"turn %clockwise %n degrees","inputs":["90"]}]]}]');
    }
    testAssert(outputLog, firstScriptExists,
        "The penDown/repeat/move/turn block was found on the screen",
        "The penDown/repeat/move/turn block was not found on the screen",
        "Make sure you recreate the exact script on the screen.", 1);

    /**/
    return outputLog;
}