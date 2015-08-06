var starter_path = "starter.xml";

// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "AG_D1_T1";
var id = courseID + taskID;
var isEDX = isEDXurl();

// Add tests to the outputLog. Function is called by runAGTest(id, outputLog)
// var testLog;
function AGTest(outputLog) {
    /* Factorial */
    var assert1 = function assert1() {
        return scriptPresentInSprite('[{"blockSp":"factorial %s","inputs":["A"]}]',0,["A"]);
    }

    var assert2 = function assert2() {
        return customBlockContains('factorial %s', 'factorial %s');
    }

    var assert3 = function assert3() {
        return blockPrecedes('factorial %s', "%n − %n", getCustomBody('factorial %s', 0));
    }
    testAssert(outputLog, assert1,//isScriptPresent('factorial %s',0),
        "The 'factorial' block is present.", 
        "The 'factorial %num' block was not found on-screen.", 
        "Make sure you name your custom block, 'factorial %num'.", 1);
    testAssert(outputLog, assert2,//customBlockContains('factorial %s', 'factorial %s'),
        "The 'factorial' block has a recursive call to itself.",
        "There is no recursive call to 'factorial.",
        "Make sure you have a recursive call inside of 'factorial.", 1);
    testAssert(outputLog, assert3,//blockPrecedes('factorial %s', "%n − %n", getCustomBody('factorial %s', 0)),
        "The recursive call to'factorial' block contains a minus block",
        "There is no minus block in the recursive call to 'factorial'.",
        "Make sure you have a minus block inside of the recursive call.", 1);
    multiTestBlock(outputLog, 'factorial %s', 
        [[0],[1],[2],[4],[5],[10]],
        [1,1,2,24,120,3628800],
        [-1,-1,-1,-1,-1,-1],
        [true,true,true,true,true,true], 2);
    
    // /* KScopeTest */
    // testAssert(outputLog, 
    //     spriteContainsBlock('when %keyHat key pressed', 0, ['space']) &&
    //     spriteContainsBlock('when %keyHat key pressed', 1, ['space']) &&
    //     spriteContainsBlock('when %keyHat key pressed', 2, ['space']) &&
    //     spriteContainsBlock('when %keyHat key pressed', 3, ['space']),
    //     "All sprites have the 'when [space] key pressed' hat-block.",
    //     "All sprites must have a 'when [space] key pressed' hat-block.",
    //     "The Kaleidoscope should begin drawing when the 'space' key is pressed.");
    // testAssert(outputLog,
    //     spriteContainsBlock('forever %c', 0) &&
    //     spriteContainsBlock('forever %c', 1) &&
    //     spriteContainsBlock('forever %c', 2) &&
    //     spriteContainsBlock('forever %c', 3),
    //     "All sprites have a forever loop",
    //     "All sprites must have a 'forever' loop.",
    //     "The 'forever' loop is required.");
    // testAssert(outputLog,
    //     spriteContainsBlock('go to x: %n y: %n', 0) &&
    //     spriteContainsBlock('go to x: %n y: %n', 1) &&
    //     spriteContainsBlock('go to x: %n y: %n', 2) &&
    //     spriteContainsBlock('go to x: %n y: %n', 3),
    //     "All sprites have a 'go to' motion-block",
    //     "All sprites must have a 'go to' motion-block",
    //     "The 'go to' motion-block is required.");
    // testAssert(outputLog,
    //     spriteContainsBlock('pen down', 0) &&
    //     spriteContainsBlock('pen down', 1) &&
    //     spriteContainsBlock('pen down', 2) &&
    //     spriteContainsBlock('pen down', 3),
    //     "All sprites have a 'pen down' pen-block",
    //     "All sprites must have a 'pen down' pen-block",
    //     "The 'pen down' pen-block is required.");
    // testKScope(outputLog);
    /**/
    return outputLog;
}