/* This script is made to test the "draw triangle" block in the exercise "Designing Custom Blocks" which can be found here:
 * https://bjc.edc.org/bjc-r/cur/programming/1-introduction/4-building-and-debugging/1-custom-blocks.html?topic=nyc_bjc%2F1-intro-loops.topic. 
 * Author: BJC
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = null;
var courseID = "BJC.1x";
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
var taskID = "_M1_W2_L1_T1_ETIF1";
var id = courseID + taskID;
var isEDX = isEDXurl();
var graded = true;
var showFeedback = true;
var regradeOn = true;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//             Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
	/* Create 'draw triangle' command block */
    var triExists;
    var triangleExists = function () {
        var exists = findBlockInPalette("draw triangle");
        if (exists !== null) {
            triExists = true;
            return true;
        }
        triExists = false;
        return false;
    }

    var realTriangleBody = getCustomBody("draw triangle");
    var containsRepeat = function () {
        return scriptContainsBlock(realTriangleBody, "repeat % %");
    }
    var containsCorrectRepeat = function () {
        return scriptContainsBlock(realTriangleBody, "repeat % %", ["3", []], true);
    }
    var containsMove = function () {
        return simpleCBlockContains(realTriangleBody, "move % steps", "repeat");
    }
    var containsTurn = function () {
        return simpleCBlockContains(realTriangleBody, "turn %counterclockwise % degrees", "repeat")
            || simpleCBlockContains(realTriangleBody, "turn %clockwise % degrees", "repeat");
    }
    var containsCorrectTurn = function () {
        return simpleCBlockContains(realTriangleBody, "turn %counterclockwise % degrees", "repeat", ["120"])
            || simpleCBlockContains(realTriangleBody, "turn %clockwise % degrees", "repeat", ["120"]);
    }
    var penDownPresent = function () {
        return (spriteContainsBlock("pen down") && !blockPrecedesInSprite("draw triangle", "pen down")) || blockPrecedes("pen down", "repeat % %", realTriangleBody);
    }

    var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    fb.snapWorld = world;


    // Create a first test chunk
    var first_chunk = fb.newChunk('Draw triangle');
    // Add a first tip to that first test chunk
    var first_tip = first_chunk.newTip('Make sure you create the draw triangle block.',
        'Great job!');

    var ass_test1 = first_tip.newAssertTest(
        triangleExists,
        "Testing if triangle block is present.",
        "The draw triangle block was found.",
        "Make sure you name your block exactly 'draw triangle'.",
        1);
    var ass_test2 = first_tip.newAssertTest(
        containsRepeat,
        "Testing if block contains a repeat block",
        "The draw triangle block has a repeat block.",
        "One approach is to try placing a repeat block inside of the definition. Hopefully that helps.",
        1);
    var ass_test3 = first_tip.newAssertTest(
        containsCorrectRepeat,
        "Testing if block contains a correct repeat block",
        "The draw triangle block has a correct repeat block.",
        "If you're having trouble about what to put into the input for the repeat, try thinking about how many times we would the command blocks to repeat so we can get a triangle.",
        1);
    var ass_test4 = first_tip.newAssertTest(
        containsMove,
        "Testing if block contains a move block",
        "The draw triangle block has a move block.",
        "If your sprite is not moving across the stage, what block can we use to do that? Hint: the block is in the blue tab",
        1);
    var ass_test5 = first_tip.newAssertTest(
        containsTurn,
        "Testing if block contains a turn block",
        "The draw triangle block has a turn block.",
        "If your sprite is only going striaght, we need to fix that. How can we redirect the spite's direction? Hint: the block is in the blue tab!",
        1);
    var ass_test6 = first_tip.newAssertTest(
        containsCorrectTurn,
        "Testing if block contains a correct turn block",
        "The draw triangle block has a correct turn block.",
        "If your sprite is turning at weird angles, think of the internal angles of a triangle. That is how much we need to turn by.",
        1);
    var ass_test7 = first_tip.newAssertTest(
        penDownPresent,
        "Testing if pen down block is present.",
        "There is a pen down block present.",
        "If the sprite is not drawing anything, it could be because we are missing a certain block. Hint: in the teal pen tab!",
        1);

    return fb;
}