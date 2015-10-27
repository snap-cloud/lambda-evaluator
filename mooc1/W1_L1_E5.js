var starter_path = null;

// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_W1_L1_E5";
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
    
// /* Recreate the move/turn script */
var smallScriptExists = function smallScriptExists() {
    return scriptPresentInSprite('[{"blockSp":"move %n steps","inputs":["10"]},{"blockSp":"turn %clockwise %n degrees","inputs":["15"]}]');
}
testAssert(outputLog, smallScriptExists,
    "The move/turn was found on the screen.",
    "The move/turn was not found on the screen. Check your inputs.",
    "Make sure you have all of the correct inputs and the blocks are in order for the move/turn script.", 1);

    /**/
    return outputLog;
}