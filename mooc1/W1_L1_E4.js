var starter_path = null;

// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x"; // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_W1_L1_E4";
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

    /* Recreate the move/say/move/say script */
    var largeScriptExists = function largeScriptExists() {
        var json_script = JSON.stringify([{
            "blockSp": "move %n steps",
            "inputs": ["20"]
        }, {
            "blockSp": "say %s for %n secs",
            "inputs": ["Hello!", "2"]
        }, {
            "blockSp": "move %n steps",
            "inputs": ["20"]
        }, {
            "blockSp": "say %s for %n secs",
            "inputs": ["You\'ve just made a script!", "2"]
        }]);
        return scriptPresentInSprite(json_script);
    }
    testAssert(outputLog, largeScriptExists,
        "The move/say/move/say script was found on the screen.",
        "The move/say/move/say script was not found on the screen. Check your inputs.",
        "Make sure you have all of the correct inputs and the blocks are in order for the move/say/move/say script.", 1);

    /**/
    return outputLog;
}
