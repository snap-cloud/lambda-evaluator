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
var taskID = "_M4_W5_L3_E2"; //this should follow the name of the nomenclature document
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
		'A Distinct Algorithm'
	);

	var distinctNumName = "are the numbers of % distinct?";
	var distinctNumChunk = fb.newChunk('Complete the "' + distinctNumName + '" block.');

	var distinctNumNameExists = function() {
		return spriteContainsBlock(distinctNumName);
	}

	var input01 = [[1, 2, 3, 4, 5, 6]];
	var IOTest01 = function(output) {
		return output == 6;
	}

	var duplicateName = "duplicates in %";
	var duplicateChunk = fb.newChunk('Complete the "' + duplicateName + '" block.');

	var duplicateExists = function() {
		return spriteContainsBlock(duplicateName);
	}

	var input02 = [[1, 2, 3, 4, 5]];
	var IOTest02 = function(output) {
		return output == 5;
	}

	var input03 = [[1, 2, 2, 2, 2]];
	var IOTest03 = function(output) {
		return output == 2;
	}

	var input11 = [[1, 2, 3]]
	var IOTest11 = function(output) {
		var actual;
		var expected = "";
		if (output instanceof List) {
			actual = output.asArray();
		} else {
			actual = output + "";
		}
		for (var i = 0; i < actual.length; i++) {
			actual[i] = actual[i] + "";
		}
		return actual == expected;
	}

	var input12 = [[1, 2, 2]]
	var IOTest12 = function(output) {
		var actual;
		var expected = "2";
		if (output instanceof List) {
			actual = output.asArray();
		} else {
			actual = output + "";
		}
		for (var i = 0; i < actual.length; i++) {
			actual[i] = actual[i] + "";
		}
		return actual == expected;
	}

	var input13 = [[1, 2, 2, 2]]
	var IOTest13 = function(output) {
		var actual;
		var expected = "2";
		if (output instanceof List) {
			actual = output.asArray();
		} else {
			actual = output + "";
		}
		for (var i = 0; i < actual.length; i++) {
			actual[i] = actual[i] + "";
		}
		return actual == expected;
	}

	var distinctNumNameCheckExists = distinctNumChunk.newTip('Make sure you name your block exactly "' + distinctNumName + '" and place it in the scripting area.', 'The "' + distinctNumName + '" block exists.');
	
	distinctNumNameCheckExists.newAssertTest(
			distinctNumNameExists,
			'Testing if the "' + distinctNumName + '" block is in the scripting area.',
			'The "' + distinctNumName + '" block is in the scripting area.',
			'Make sure you name your block exactly "' + distinctNumName + '" and place it in the scripting area.',
			1
		)

	var duplicateCheckExists = duplicateChunk.newTip('Make sure you name your block exactly "' + duplicateName + '" and place it in the scripting area.', 'The "' + duplicateName + '" block exists.');

	duplicateCheckExists.newAssertTest(
			duplicateExists,
			'Testing if the "' + duplicateName + '" block is in the scripting area.',
			'The "' + duplicateName + '" block is in the scripting area.',
			'Make sure you name your block exactly "' + duplicateName + '" and place it in the scripting area.',
			1
		)

	var distinctNumIOTest1 = distinctNumChunk.newTip('Make sure you have written the "are the numbers of % distinct?" predicate correctly.', 'The "are the numbers of % distinct?" predicate works.');

	distinctNumIOTest1.newIOTest('r',
			distinctNumName,
			input01,
			IOTest01,
			4 * 1000,
			true,
			1
		);

	distinctNumIOTest1.newIOTest('r',
			distinctNumName,
			input02,
			IOTest02,
			4 * 1000,
			true,
			1
		);

	distinctNumIOTest1.newIOTest('r',
			distinctNumName,
			input03,
			IOTest03,
			4 * 1000,
			true,
			1
		);

	var duplicateIOTest = duplicateChunk.newTip('Make sure you have written the "duplicates in" reporter correctly.', 'The "duplicates in" reporter works.');

	duplicateIOTest.newIOTest('r',
			duplicateName,
			input11,
			IOTest11,
			4 * 1000,
			true,
			1
		);

	duplicateIOTest.newIOTest('r',
			duplicateName,
			input12,
			IOTest12,
			4 * 1000,
			true,
			1
		);

	duplicateIOTest.newIOTest('r',
			duplicateName,
			input13,
			IOTest13,
			4 * 1000,
			true,
			1
		);

	return fb;

};