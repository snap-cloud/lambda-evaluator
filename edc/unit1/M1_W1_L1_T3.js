/* This script is made to test a non-custom block in the exercise "Using the Random Block" which can be found here:
 * https://bjc.edc.org/bjc-r/cur/programming/1-introduction/1-building-an-app/4-using-the-random-block.html?topic=nyc_bjc%2F1-intro-loops.topic. 
 * Author: Soham Kudtarkar for BJC
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = null;
var courseID = "edc";
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
var taskID = "_M1_W1_L1_T3s";
var id = courseID + taskID;
var isEDX = isEDXurl();
var graded = true;
var showFeedback = true;
var regradeOn = true;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//             Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
	var fb = new FeedbackLog(world, id, "Using the Random Block");
	var chunk_1 = fb.newChunk("Move Alonzo to a random position within the given parameters and turn him around.");

	/* The correct answer in JSON  format. */
	var expected = '\
	[\
		{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
		{"blockSp":"next costume", "inputs":[]},\
		{"blockSp":"go to x: %n y: %n", "inputs":[\
			{"blockSp":"pick random %n to %n", "inputs":["-190", "190"]},\
			{"blockSp":"pick random %n to %n", "inputs":["-130", "130"]}\
		]}\
	]';

	var tip_1_1a = chunk_1.newTip("Make sure you use the correct blocks.", "The correct blocks exist.");
	tip_1_1a.newAssertTest(
		spriteContainsBlock("when I am %interaction"),
		"Testing if the 'when I am clicked' block is in the scripting area.",
		"The 'when I am clicked' block is in the scripting area.",
		"Make sure that the 'when I am clicked' block is in the scripting area.",
		1
	);

	tip_1_1a.newAssertTest(
		spriteContainsBlock("next costume"),
		"Testing if the 'next costume' block is in the scripting area.",
		"The 'next costume' block is in the scripting area.",
		"Make sure that the 'next costume' block is in the scripting area.",
		1
	);

	tip_1_1a.newAssertTest(
		spriteContainsBlock("go to x: % y: %"),
		"Testing if the 'go to x: % y: %' block is in the scripting area.",
		"The 'go to x: % y: %' block is in the scripting area.",
		"Make sure that the 'go to x: % y: %' block is in the scripting area.",
		1
	);

	tip_1_1a.newAssertTest(
		spriteContainsBlock("pick random % to %") && occurancesOfBlockInSprite("pick random % to %", 2),
		"Testing if the 'pick random % to %' block is in the scripting area and that it is used in two different areas.",
		"The 'pick random % to %' block is in the scripting area and is used in two different areas.",
		"Make sure that the 'pick random % to %' block is in the scripting area and is used in two different areas.",
		1
	);

	/* The assert test that checks for whether the correct answer is in the scripting area. */
	var tip_1_1 = chunk_1.newTip("Make sure the blocks are in the correct order and have the correct parameters.", "The correct script exists.");
	tip_1_1.newAssertTest(
		scriptPresentInSprite(expected, 0, []),
		"Testing if the correct script is in the scripting area.",
		"The script is in the scripting area and the blocks are in the correct order with the correct parameters.",
		"Make sure that the blocks in your script are in the correct order and have the correct parameters.",
		1
	);

	return fb;
}
