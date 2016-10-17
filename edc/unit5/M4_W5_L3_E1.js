// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W5_L3_E1"; //this should follow the name of the nomenclature document
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
		'Comparing Algorithms'
	);

	var alphieBlockName = "alphie way %";
	var alphieChunk = fb.newChunk('Complete the "' + alphieBlockName + '" block.');

	var alphieWayExists = function() {
		return spriteContainsBlock(alphieBlockName);
	}

	var combineBlockInAlphie = function() {
		return customBlockContains("alphie way %", "combine with % items of %");
	}

	var betsyBlockName = "betsy way %";
	var betsyChunk = fb.newChunk('Complete the "' + betsyBlockName + '" block.');

	var betsyWayExists = function() {
		return spriteContainsBlock(betsyBlockName);
	}

	var input1 = [13];
	var IOTest1 = function(output) {
		return output == 91;
	}

	var input2 = [10];
	var IOTest2 = function(output) {
		return output == 55;
	}

	var alphieWayCheckExists = alphieChunk.newTip('Make sure you name your block exactly "' + alphieBlockName + '" and place it in the scripting area.', 'The "' + alphieBlockName + '" block exists.');
	
	alphieWayCheckExists.newAssertTest(
			alphieWayExists,
			'Testing if the "' + alphieBlockName + '" block is in the scripting area.',
			'The "' + alphieBlockName + '" block is in the scripting area.',
			'Make sure you name your block exactly "' + alphieBlockName + '" and place it in the scripting area.',
			1
		)

	var betsyWayCheckExists = betsyChunk.newTip('Make sure you name your block exactly "' + betsyBlockName + '" and place it in the scripting area.', 'The "' + betsyBlockName + '" block exists.');

	betsyWayCheckExists.newAssertTest(
			betsyWayExists,
			'Testing if the "' + betsyBlockName + '" block is in the scripting area.',
			'The "' + betsyBlockName + '" block is in the scripting area.',
			'Make sure you name your block exactly "' + betsyBlockName + '" and place it in the scripting area.',
			1
		)

	var alphieWayCombineExists = alphieChunk.newTip('Make sure you are using the "combine" block to report inside the "alphie way" block.', 'You are using the "combine" block inside the "alphie way" block.');

	alphieWayCombineExists.newAssertTest(
			combineBlockInAlphie,
			'Testing if the "combine" block is inside the "alphie way" block.',
			'The "combine" block is inside the "alphie way" block.',
			'Make sure the "combine" block is inside the "alphie way" block.',
			1
		);

	var alphieWayIOTest1 = alphieChunk.newTip('Make sure you have written the "alphie way" method correctly.', 'The "alphie way" block works.');

	var betsyWayIOTest1 = betsyChunk.newTip('Make sure you have put in the correct formula for the "betsy way" block.', 'The "betsy way" block works.');

	alphieWayIOTest1.newIOTest('r',
			alphieBlockName,
			input1,
			IOTest1,
			4 * 1000,
			true,
			1
		);

	betsyWayIOTest1.newIOTest('r',
			betsyBlockName,
			input1,
			IOTest1,
			4 * 1000,
			true,
			1
		);

	alphieWayIOTest1.newIOTest('r',
			alphieBlockName,
			input2,
			IOTest2,
			4 * 1000,
			true,
			1
		);

	betsyWayIOTest1.newIOTest('r',
			betsyBlockName,
			input2,
			IOTest2,
			4 * 1000,
			true,
			1
		);

	return fb;

};