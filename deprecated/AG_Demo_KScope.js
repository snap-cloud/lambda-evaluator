var starter_path = null;

// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "AG_D1_K";
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
    // /* Factorial */
    /* Create 'draw square' command motion */
    // var testFunc = function(i, t) {t.expOut = true; if (i == 1) {return true;} return false;};

    // multiTestBlock(outputLog, 'factorial %s', 
    //     [[0],[1],[2],[4],[5],[10]],
    //     //[1,1,2,24,120,3628800],
    //     [testFunc,testFunc,testFunc,testFunc,testFunc,testFunc],
    //     [-1,-1,-1,-1,-1,-1],
    //     [true,true,true,true,true,true], 2);

    /* KScopeTest */
    
    var func1 = function() {
        return spriteContainsBlock('when %keyHat key pressed', 0, ['space']) &&
        spriteContainsBlock('when %keyHat key pressed', 1, ['space']) &&
        spriteContainsBlock('when %keyHat key pressed', 2, ['space']) &&
        spriteContainsBlock('when %keyHat key pressed', 3, ['space']);
    }
    /*testAssert(outputLog, 
        func1,
        "All sprites have the 'when [space] key pressed' hat-block.",
        "All sprites must have a 'when [space] key pressed' hat-block.",
        "The Kaleidoscope should begin drawing when the 'space' key is pressed.",1);*/
    var func2 = function() {
        return spriteContainsBlock('forever %c', 0) &&
        spriteContainsBlock('forever %c', 1) &&
        spriteContainsBlock('forever %c', 2) &&
        spriteContainsBlock('forever %c', 3);
    }
    /*testAssert(outputLog,
        func2,
        "All sprites have a forever loop",
        "All sprites must have a 'forever' loop.",
        "The 'forever' loop is required.",1);*/
    var func3 = function() {
        return spriteContainsBlock('go to x: %n y: %n', 0) &&
        spriteContainsBlock('go to x: %n y: %n', 1) &&
        spriteContainsBlock('go to x: %n y: %n', 2) &&
        spriteContainsBlock('go to x: %n y: %n', 3);
    }
    /*testAssert(outputLog,
        func3,
        "All sprites have a 'go to' motion-block",
        "All sprites must have a 'go to' motion-block",
        "The 'go to' motion-block is required.",2);*/
    var func4 = function() {
        return spriteContainsBlock('pen down', 0) &&
        spriteContainsBlock('pen down', 1) &&
        spriteContainsBlock('pen down', 2) &&
        spriteContainsBlock('pen down', 3);
    }
    /*testAssert(outputLog,
        func4,
        "All sprites have a 'pen down' pen-block",
        "All sprites must have a 'pen down' pen-block",
        "The 'pen down' pen-block is required.",1);*/
    /*testKScope(outputLog,3, 3);
    console.log(outputLog);
    return outputLog;*/

    var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    fb.snapWorld = world;
    var test_chunk = fb.newChunk('Kaleidoscope');
    var test_tip = test_chunk.newTip('Make sure your script starts drawing when the space key is pressed, and that there is a "Go To" block.',
                'Great job starting the script!');
    

    var ass_test1 = test_tip.newAssertTest( 
                func1,
                "All sprites must have a 'when [space] key pressed' hat-block.",
                "All sprites have the 'when [space] key pressed' hat-block.",
                "The Kaleidoscope should begin drawing when the 'space' key is pressed.",
                1); 
    var ass_test2 = test_tip.newAssertTest( 
                func3,
                "All sprites must have a 'go to' motion-block",
                "All sprites have a 'go to' motion-block",
                "The 'go to' motion-block is required.",
                1); 

    var second_tip = test_chunk.newTip('Make sure you use a loop so that your sprite moves continuously.',
                'Great job on the loop!');

    var ass_test3 = second_tip.newAssertTest(
                func2,
                "All sprites must have a 'forever' loop.",
                "All sprites have a forever loop",
                "The 'forever' loop is required.",
                1);

    var third_tip = test_chunk.newTip('Make sure your sprite is drawing its kaleidoscope',
                'Your sprite is drawing its kaleidoscope!');

    var ass_test4 = third_tip.newAssertTest(
                func4,
                "All sprites must have a 'pen down' pen-block",
                "All sprites have a 'pen down' pen-block",
                "The 'pen down' pen-block is required.",
                1);

   // testKScope(outputLog,3, 3);
    return fb;
}

// Example of using a function in expOut
    // var testFunc = function(i, t) {t.expOut = true; if (i == 1) {return true;} return false;};

    // multiTestBlock(outputLog, 'factorial %s', 
    //     [[0],[1],[2],[4],[5],[10]],
    //     //[1,1,2,24,120,3628800],
    //     [testFunc,testFunc,testFunc,testFunc,testFunc,testFunc],
    //     [-1,-1,-1,-1,-1,-1],
    //     [true,true,true,true,true,true], 2);
    
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