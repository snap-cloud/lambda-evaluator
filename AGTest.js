var starter_path = null;

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
    var realSquareBody = getCustomBody("draw square");
    var squarePresentTest = function squarePresentTest() {
        return spriteContainsBlock("draw square");
    }
    var squareBodyTest = function squareBodyTest() {
        return spriteContainsBlock("draw square");
    }
    var penDownPresent = function penDownPresent() {
        return (spriteContainsBlock("pen down") && !blockPrecedesInSprite("draw square", "pen down")) || blockPrecedes("pen down", "repeat % %", realSquareBody);
    }

    testAssert(outputLog, squarePresentTest,
        "The 'draw square' block is found.",
        "The 'draw square' block is not on the screen.",
        "Follow the directions to make a 'draw square' block",1);

    testAssert(outputLog, squareBodyTest,
        "The body of the 'draw square' block is correct.",
        "The body of the 'draw square' block is incorrect. Try checking the block order and inputs.",
        "Try making sure all of the correct blocks and inputs are in order.",1);

    testAssert(outputLog, penDownPresent,
        "The 'draw square' block contains the 'pen down' block.",
        "The 'draw square' block is not drawing anything. What block draws things?",
        "Try using blocks to draw things inside of the 'draw square'",1);

    /* Create 'draw triangle' command block */
    var realTriangleBody = getCustomBody("draw triangle");
    var trianglePresent = function trianglePresent() {
        return spriteContainsBlock("draw triangle");
    }
    var containsRepeat = function containsRepeat() {
        return scriptContainsBlock(realTriangleBody, "repeat % %");
    }
    var containsCorrectRepeat = function containsCorrectRepeat() {
        return scriptContainsBlock(realTriangleBody, "repeat % %", ["3", []], true);
    }
    var containsMove = function containsMove() {
        return simpleCBlockContains(realTriangleBody, "move % steps", "repeat");
    }
    var containsCorrectMove = function containsCorrectMove() {
        return simpleCBlockContains(realTriangleBody, "move % steps", "repeat", ["100"]);
    }
    var containsTurn = function containsTurn() {
        return simpleCBlockContains(realTriangleBody, "turn %counterclockwise % degrees", "repeat")
            || simpleCBlockContains(realTriangleBody, "turn %clockwise % degrees", "repeat");
    }
    var containsCorrectTurn = function containsCorrectTurn() {
        return simpleCBlockContains(realTriangleBody, "turn %counterclockwise % degrees", "repeat", ["120"])
            || simpleCBlockContains(realTriangleBody, "turn %clockwise % degrees", "repeat", ["120"]);
    }
    var penDownPresent = function penDownPresent() {
        return spriteContainsBlock("pen down") && (!blockPrecedesInSprite("draw triangle", "pen down") || blockPrecedes("pen down", "repeat % %", realTriangleBody);
    }

    testAssert(outputLog, trianglePresent,
        "The 'draw triangle' block is found.",
        "The 'draw triangle' block cannot be found.",
        "Make sure you name the block 'draw triangle'",1);

    testAssert(outputLog, containsRepeat,
        "The 'repeat' block is found inside 'draw triangle'.",
        "The 'repeat' block is not found inside 'draw triangle'.",
        "Make sure you use a repeat inside of 'draw triangle'",1);

    testAssert(outputLog, containsCorrectRepeat,
        "The 'repeat' block has a counter of 3.",
        "The 'repeat' block does not have the correct counter.",
        "How many times should we repeat to draw a triangle?",1);

    testAssert(outputLog, containsMove,
        "The 'draw triangle' block contains move inside of the repeat loop.",
        "The 'draw triangle' block is missing a move block.",
        "What blocks helps move the sprite?",1);

    testAssert(outputLog, containsCorrectMove,
        "The 'draw triangle' block contains move 100 inside of the repeat loop.",
        "The 'draw triangle' block is missing a correct move block.",
        "How far is the move supposed to be?",1);

    testAssert(outputLog, containsTurn,
        "The 'draw triangle' block contains a turn block.",
        "The 'draw triangle' block is missing a turn block",
        "Try turn clockwise or counterclockwise block",1);

    testAssert(outputLog, containsCorrectTurn,
        "The 'draw triangle' block contains turn block with 120 degrees.",
        "The 'draw triangle' block needs a turn block with correct inputs.",
        "Try using a turn block, how many degrees should we turn?",1);

    testAssert(outputLog, penDownPresent,
        "The 'draw triangle' block contains the 'pen down' block.",
        "The 'draw triangle' block is not drawing anything. What block draws things? Try placing it in a different place.",
        "Try using blocks to draw things inside of the 'draw triangle'",1);
    // Draw House
    /* Create 'draw house' command block */
    var realHouseBody = getCustomBody("draw house");
    var housePresent = function housePresent() {
        return spriteContainsBlock("draw house");
    }
    var trianglePresent = function trianglePresent() {
        return  occurancesOfBlockSpec("draw triangle", realHouseBody) === 1;
    }
    var squarePresent = function squarePresent() {
        return occurancesOfBlockSpec("draw square", realHouseBody) === 1;
    }
    var penDownPresent = function penDownPresent() {
        return (spriteContainsBlock("pen down") && !blockPrecedesInSprite("draw house", "pen down")) || ((blockPrecedes("pen down", "draw square", realHouseBody)) && (blockPrecedes("pen down", "draw triangle", realHouseBody)));
    }

    testAssert(outputLog, housePresent,
        "The 'draw house' block is found.",
        "The 'draw house' block cannot be found.",
        "Follow directions to make the 'draw house' block",1);

    testAssert(outputLog, trianglePresent,
        "The 'draw house' block contains the 'draw triangle' block.",
        "The 'draw house' is missing the roof. Try using blocks you have previously made.",
        "Try using previously made blocks inside the body of 'draw house",1);

    testAssert(outputLog, squarePresent,
        "The 'draw house' block contains the 'draw square' block.",
        "The 'draw house' is missing the walls. Try using blocks you have previously made.",
        "Try using previously made blocks inside the body of 'draw house",1);

    testAssert(outputLog, penDownPresent,
        "The 'draw house' block contains the 'pen down' block.",
        "The 'draw house' block is not drawing anything. What block draws things?",
        "Try using blocks to draw things inside of the 'draw house'",1);

    /**/
    return outputLog;
}