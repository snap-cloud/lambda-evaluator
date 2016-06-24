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
var taskID = "_M1_W2_L1_T1_ETIF2";
var id = courseID + taskID;
var isEDX = isEDXurl();
var graded = true;
var showFeedback = true;
var regradeOn = true;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//             Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
	/* Create 'draw house' command block */
    var houseExists;
    var drawHouseExists = function () {
        var housefound = findBlockInPalette("draw house");
        if (housefound !== null) {
            houseExists = true;
            return true;
        }
        houseExists = false;
        return false;
    }


    var realHouseBody = getCustomBody("draw house");
    var trianglePresent = function () {
        return  occurancesOfBlockSpec("draw triangle", realHouseBody) === 1;
    }
    var squarePresent = function () {
        return occurancesOfBlockSpec("draw square", realHouseBody) === 1;
    }
    var penDownPresent = function () {
        return (spriteContainsBlock("pen down") && !blockPrecedesInSprite("draw house", "pen down")) || ((blockPrecedes("pen down", "draw square", realHouseBody)) && (blockPrecedes("pen down", "draw house", realHouseBody)));
    }


    var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    fb.snapWorld = world;


    // Create a first test chunk
    var first_chunk = fb.newChunk('Draw house');
    // Add a first tip to that first test chunk
    var first_tip = first_chunk.newTip('Make sure you create the draw house block.',
        'Great job!');

    var ass_test1 = first_tip.newAssertTest(
        drawHouseExists,
        "Testing if draw house exists",
        "The draw house block was found.",
        "Make sure you name your block exactly 'draw house'.",
        1);
    var ass_test2 = first_tip.newAssertTest(
        trianglePresent,
        "Testing if block contains a draw house block",
        "The draw triangle block is inside of the draw house block.",
        "Try using previously made blocks inside the body of 'draw house' to draw the roof.",
        1);
    var ass_test3 = first_tip.newAssertTest(
        squarePresent,
        "Testing if block contains a correct repeat block",
        "The draw square block is inside of the draw house block.",
        "Try using previously made blocks inside the body of 'draw house' to draw the rest of the house.",
        1);
    var ass_test4 = first_tip.newAssertTest(
        penDownPresent,
        "Testing if pen down is present",
        "The pen down block is present.",
        "If the sprite is not drawing anything, it could be because we are missing a certain block. Hint: in the teal pen tab!",
        1);

    return fb;
}