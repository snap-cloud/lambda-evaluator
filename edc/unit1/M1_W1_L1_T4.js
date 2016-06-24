/* This script is made to test a non-custom block in the exercise "Finishing Your First Snap! App" which can be found here:
 * https://bjc.edc.org/bjc-r/cur/programming/1-introduction/1-building-an-app/6-finish-your-first-snap-app.html?topic=nyc_bjc%2F1-intro-loops.topic. 
 * Author: Soham Kudtarkar for BJC
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = null;
var courseID = "edc";
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
var taskID = "_M1_W1_L1_T4";
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
	var chunk_1 = fb.newChunk("Build the script so that Alonzo gives a welcome message and moves correctly.");

	/* The correct answer to the first exercise in JSON  format.
	 * When (green flag) is clicked -> go to x: (190) y: (-130) -> say (message). */
	var expectedOne = '\
	[\
		{"blockSp":"when %greenflag clicked", "inputs":[]},\
		{"blockSp":"go to x: %n y: %n", "inputs":["190", "-130"]},\
		{"blockSp":"say %s", "inputs":["A"]}\
	]';

	/* The assert test that checks for whether the correct answer is in the scripting area. */
	var tip_1_1 = chunk_1.newTip("Make sure Alonzo moves then gives a welcome message.", "The correct script exists.");
	tip_1_1.newAssertTest(
		scriptPresentInSprite(expectedOne, 0, ["A"]),
		"Checking to see if Alonzo moves then gives a welcome message.",
		"The script is in the scripting area.",
		"Make sure Alonzo moves to (190, -130) and says a welcome message whenever the green flag is clicked.",
		1
	);

	/* One possible correct answer (within reasonable coding practices) to the second exercise in JSON format.
	 * When I am (clicked) -> say () -> next costume -> move to a random position. */
	var expectedTwoPointOne = '\
	[\
		{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
		{"blockSp":"say %s", "inputs":[""]},\
		{"blockSp":"next costume", "inputs":[]},\
		{"blockSp":"go to x: %n y: %n", "inputs":[\
			{"blockSp":"pick random %n to %n", "inputs":["A", "B"]},\
			{"blockSp":"pick random %n to %n", "inputs":["C", "D"]}\
		]}\
	]';

	/* One possible correct answer (within reasonable coding practices) to the second exercise in JSON format.
	 * When I am (clicked) -> say () -> move to a random position -> next costume. */
	var expectedTwoPointTwo = '\
	[\
		{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
		{"blockSp":"say %s", "inputs":[""]},\
		{"blockSp":"go to x: %n y: %n", "inputs":[\
			{"blockSp":"pick random %n to %n", "inputs":["A", "B"]},\
			{"blockSp":"pick random %n to %n", "inputs":["C", "D"]}\
		]},\
		{"blockSp":"next costume", "inputs":[]}\
	]';

	/* The assert test that checks for wheter the correct answer is in the scripting area. */
	var tip_1_2 = chunk_1.newTip("Make sure Alonzo moves when clicked.", "The correct script exists.");
	tip_1_2.newAssertTest(
		scriptPresentInSprite(expectedTwoPointOne, 0, ["A", "B", "C", "D"]) ||
		scriptPresentInSprite(expectedTwoPointTwo, 0, ["A", "B", "C", "D"]),
		"Checking to see if Alonzo says nothing when clicked.",
		"The script is in the scripting area.",
		"Make sure that when Alonzo is clicked, the message should disappear, and Alonzo should move to a random spot on the stage and face the other way.",
		1
	);

	/* One possible correct answer (within reasonable coding practices) correct answer to the third exercise in JSON format.
	 * When I am (clicked) -> say () -> move to a random position -> next costume
	 * -> forever (wait (2) secs -> move to a random position). */
	var expectedThreePointOne = '\
	[\
		{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
		{"blockSp":"say %s", "inputs":[""]},\
		{"blockSp":"go to x: %n y: %n", "inputs":[\
			{"blockSp":"pick random %n to %n", "inputs":["A", "B"]},\
			{"blockSp":"pick random %n to %n", "inputs":["C", "D"]}\
		]},\
		{"blockSp":"next costume", "inputs":[]},\
		{"blockSp":"forever %c", "inputs":[\
			{"blockSp":"wait %n secs", "inputs":["2"]},\
			{"blockSp":"go to x: %n y: %n", "inputs":["E", "F"]}\
		]}\
	]';

	/* One possible correct answer (within reasonable coding practices) correct answer to the third exercise in JSON format.
	 * When I am (clicked) -> say () -> move to a random position -> next costume
	 * -> forever (move to a random position -> wait (2) secs). */
	var expectedThreePointTwo = '\
	[\
		{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
		{"blockSp":"say %s", "inputs":[""]},\
		{"blockSp":"go to x: %n y: %n", "inputs":[\
			{"blockSp":"pick random %n to %n", "inputs":["A", "B"]},\
			{"blockSp":"pick random %n to %n", "inputs":["C", "D"]}\
		]},\
		{"blockSp":"next costume", "inputs":[]},\
		{"blockSp":"forever %c", "inputs":[\
			{"blockSp":"go to x: %n y: %n", "inputs":["E", "F"]},\
			{"blockSp":"wait %n secs", "inputs":["2"]}\
		]}\
	]';

	/* One possible correct answer (within reasonable coding practices) correct answer to the third exercise in JSON format.
	 * When I am (clicked) -> forever (move to a random position -> wait (2) secs). */
	var expectedThreePointThree = '\
	[\
	 	{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
	 	{"blockSp":"forever %c", "inputs":[\
			{"blockSp":"go to x: %n y: %n", "inputs":["A", "B"]},\
			{"blockSp":"wait %n secs", "inputs":["2"]}\
		]}\
	]';

	/* One possible correct answer (within reasonable coding practices) correct answer to the third exercise in JSON format.
	 * When I am (clicked) -> forever (wait (2) secs -> move to a random position). */
	var expectedThreePointFour = '\
	[\
	 	{"blockSp":"when I am %interaction", "inputs":["clicked"]},\
	 	{"blockSp":"forever %c", "inputs":[\
	 		{"blockSp":"wait %n secs", "inputs":["2"]},\
			{"blockSp":"go to x: %n y: %n", "inputs":["A", "B"]}\
		]}\
	]';

	/* The assert test that checks for wheter the correct answer is in the scripting area. */
	var tip_1_3 = chunk_1.newTip("Make sure Alonzo moves every two seconds, even if he isn't clicked.", "The correct script exists.");
	tip_1_3.newAssertTest(
		scriptPresentInSprite(expectedThreePointOne, 0, ["A", "B", "C", "D", "E", "F"]) ||
		scriptPresentInSprite(expectedThreePointTwo, 0, ["A", "B", "C", "D", "E", "F"]) ||
		scriptPresentInSprite(expectedThreePointThree, 0, ["A", "B"]) ||
		scriptPresentInSprite(expectedThreePointFour, 0, ["A", "B"]),
		"Checking to see if Alonzo moves to a random position and changes costume after first being clicked.",
		"The script is in the scripting area.",
		"Make sure that Alonzo moves to a random position on the stage every two seconds (even if not clicked)",
		1
	);

	/* This assert test checks if the change ghost effect by (5) block is present. */
	var tip_1_4 = chunk_1.newTip("Make sure that you make use of the change effect block with the correct parameters.", "The correct script exists.");
	var blockOneExists = false;
	var scriptsRoundOne = getScripts(0);
	for (script in scriptsRoundOne) {
		if (scriptContainsBlock(script, "change %eff effect by %n", ["ghost", "5"], true)) {
			blockOneExists = true;
		}
	}
	tip_1_4.newAssertTest(
		blockOneExists,
		"Checking to see if the \'change ghost effect by 5\' block is used.",
		"The block is in the scripting area.",
		"Make sure that you make use of the change effect block with the correct parameters.",
		1
	);

	/* This assert test checks if the change ghost effect by (-5) block is present. */
	var tip_1_5 = chunk_1.newTip("Make sure that you make use of the change effect block with the correct parameters.", "The correct script exists.");
	var blockTwoExists = false;
	var scriptsRoundTwo = getScripts(0);
	for (script in scriptsRoundTwo) {
		if (scriptContainsBlock(script, "change %eff effect by %n", ["ghost", "-5"], true)) {
			blockTwoExists = true;
		}
	}
	tip_1_5.newAssertTest(
		blockTwoExists,
		"Checking to see if the \'change ghost effect by -5\' block is used.",
		"The block is in the scripting area.",
		"Make sure that you make use of the change effect block with the correct parameters.",
		1
	);

	return fb;
}
