var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_W2_L1_T1_E5";
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

 /* Create 'draw square' command motion */
    var sqExists;
    var squareExists = function () {
        var exists = findBlockInPalette("draw square");
        if (exists !== null) {
            sqExists = true;
            return true;
        }
        sqExists = false;
        return false;
    }

    var realSquareBody = getCustomBody("draw square");

    var containsRepeat = function () {
        return scriptContainsBlock(realSquareBody, "repeat % %");
    }

    var containsCorrectRepeat = function () {
        return scriptContainsBlock(realSquareBody, "repeat % %", ["4", []], true);
    }

    var containsMove = function () {
        return simpleCBlockContains(realSquareBody, "move % steps", "repeat");
    }

    var containsTurn = function () {
        return simpleCBlockContains(realSquareBody, "turn %counterclockwise % degrees", "repeat")
            || simpleCBlockContains(realSquareBody, "turn %clockwise % degrees", "repeat");
    }

    var containsCorrectTurn = function () {
        return simpleCBlockContains(realSquareBody, "turn %counterclockwise % degrees", "repeat", ["90"])
            || simpleCBlockContains(realSquareBody, "turn %clockwise % degrees", "repeat", ["90"]);
    }

    var penDownPresent = function () {
        return (spriteContainsBlock("pen down") && !blockPrecedesInSprite("draw square", "pen down")) || blockPrecedes("pen down", "repeat % %", realSquareBody);
    }

    var fb = new FeedbackLog(world, id, 'this is a feedback log test', 0);


    // Create a first test chunk
    var first_chunk = fb.newChunk('Draw Square');
    // Add a first tip to that first test chunk
    var first_tip = first_chunk.newTip('Make sure you create the draw square block from exercise 5.',
        'Great job!');

    var ass_test1 = first_tip.newAssertTest(
        squareExists,
        "Testing if custom block from exercise 5 is present.",
        "The draw square block was found.",
        "Double check that you name the block 'draw square'",
        1);
    var ass_test2 = first_tip.newAssertTest(
        containsRepeat,
        "Testing if block contains a repeat block",
        "The draw square block has a repeat block.",
        "One approach is to try placing a repeat block inside of the definition. Hopefully that helps.",
        1);
    var ass_test3 = first_tip.newAssertTest(
        containsCorrectRepeat,
        "Testing if block contains a correct repeat block",
        "The draw square block has a correct repeat block.",
        "If you're having trouble about what to put into the input for the repeat, try thinking about how many times we would the command blocks to repeat so we can get a square.",
        1);
    var ass_test4 = first_tip.newAssertTest(
        containsMove,
        "Testing if block contains a move block",
        "The draw square block has a move block.",
        "If your sprite is not moving across the stage, what block can we use to do that? Hint: the block is in the blue tab",
        1);
    var ass_test5 = first_tip.newAssertTest(
        containsTurn,
        "Testing if block contains a turn block",
        "The draw square block has a turn block.",
        "If your sprite is only going striaght, we need to fix that. How can we redirect the spite's direction? Hint: the block is in the blue tab!",
        1);
    var ass_test6 = first_tip.newAssertTest(
        containsCorrectTurn,
        "Testing if block contains a correct turn block",
        "The draw square block has a correct turn block.",
        "If your sprite is turning at weird angles, think of the internal angles of a square. That is how much we need to turn by.",
        1);
    var ass_test7 = first_tip.newAssertTest(
        penDownPresent,
        "Testing if pen down block is present.",
        "There is a pen down block present.",
        "If the sprite is not drawing anything, it could be because we are missing a certain block. Hint: in the teal pen tab!",
        1);

    return fb;
}