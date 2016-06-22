// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = "M1_W1_L3_T1.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M1_W1_L3_T1"; //this should follow the name of the nomenclature document
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, set this to false
var showFeedback = true;
// to allow ability to regrade certain tests, set this to true
var regradeOn = true;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//           Actual Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
	var fb = new FeedbackLog(
		world,
		id,
		'Nesting Repeats'
	);

	var repeatSpec = "repeat % %";
	var triangleRepeatInputs = ["3", []];
	var triangleTurnInputs = ["120"];

	var turnClockwiseSpec = "turn %clockwise % degrees";
    var turnCounterClockwiseSpec = "turn %counterclockwise % degrees";

    var moveSpec = "move % steps";

	var correctNestedRepeats = function() {
		var largeTriangleRepeat = spriteContainsBlock(repeatSpec, 0, triangleRepeatInputs, true)
		if (largeTriangleRepeat) {
			var mediumTriangleRepeat = CBlockContainsInSprite(repeatSpec, repeatSpec, 0, triangleRepeatInputs, triangleRepeatInputs, true)
			if (mediumTriangleRepeat) {
				return true;
			}
		}
		return false;
	}

	var correctNumberOfRepeats = function() {
		return occurancesOfBlockInSprite(repeatSpec, 3, 0);
	}

	var correctNumberOfTurns = function() {
		return occurancesOfBlockInSprite(turnClockwiseSpec, 3, 0) || occurancesOfBlockInSprite(turnCounterClockwiseSpec, 3, 0)
	}

	var correctInputOfTurns = function() {
        var withClockwise = CBlockContainsInSprite(turnClockwiseSpec, repeatSpec, 0, triangleTurnInputs, triangleRepeatInputs);
        var withCounterClockwise = CBlockContainsInSprite(turnCounterClockwiseSpec, repeatSpec, 0, triangleTurnInputs, triangleRepeatInputs);
        return withClockwise || withCounterClockwise;
    }

    var correctNumberOfMoves = function() {
    	return occurancesOfBlockInSprite(moveSpec, 3, 0);
    }

    var penDown = function() {
    	return spriteContainsBlock("pen down");
    }

	var triangleChunk = fb.newChunk('Triangle Tests');

	var checkNestedRepeats = triangleChunk.newTip('Make sure your repeat counter is correct.', 'Repeat has correct counter');

	checkNestedRepeats.newAssertTest(
		correctNestedRepeats,
		"Tests for the correct repeat counter.",
		"The script for the triangle has the correct counter 3 for the repeat loop",
		"Try thinking about how we can use the repeat loop. How many times should the commands in the body of the repeat block be repeated?",
		1);

	var checkNumberOfRepeats = triangleChunk.newTip('Make sure you have the correct number of repeat blocks.', 'Correct number of repeat blocks.');

	checkNumberOfRepeats.newAssertTest(
		correctNumberOfRepeats,
		"Tests for the correct repeat blocks.",
		"The script for the triangle has the correct number of repeat blocks.",
		"Try thinking about how many triangles are being made and how many triangles of each size are being made.",
		1);

	var checkNumberOfTurns = triangleChunk.newTip('Make sure you have the correct number of turn blocks.', 'Correct number of turn blocks.');

	checkNumberOfTurns.newAssertTest(
		correctNumberOfTurns,
		"Tests for the correct number of turn blocks.",
		"The script for the triangle has the correct number of turn blocks.",
		"Try thinking about how many times you need to turn the pen when drawing a triangle.",
		1);

	var checkInputOfTurns = triangleChunk.newTip('Make sure your sprite turns the correct amount when drawing.', 'Correct turn degree.');

	checkInputOfTurns.newAssertTest(
		correctInputOfTurns,
		"Tests for the correct input on turn blocks.",
		"The script for drawing a triangle has a correct turn block.",
		"What turning degree can we use to help the sprite change direction?",
		1);

	var checkNumberOfMoves = triangleChunk.newTip('Make sure your sprite has the correct number of moves when drawing.', 'Correct number of move blocks.');

	checkNumberOfMoves.newAssertTest(
		correctNumberOfMoves,
		"Tests for the correct number of move blocks.",
		"The script for the triangle has the correct number of move blocks.",
		"Try thinking how many times you need to move the pen to create a triangle and how many different sized triangles you are creating.",
		1);

	var checkPenDown = triangleChunk.newTip('Make sure you are drawing the triangle.', 'Pen is down.');

	checkPenDown.newAssertTest(
		penDown,
		"Tests to see if the pen is down.",
		"The script for the triangle draws the triangle.",
		"Remember to put the pen down when drawing a triangle!",
		1);                            
	
	return fb;

};
