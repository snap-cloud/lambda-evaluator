// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = "U5_L3_P4_T2_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U5_L3_P4_T2"; //this should follow the name of the nomenclature document
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
        'Classifying Algorithms' //Name of the particular task you are creating.
    );

    //Standard code to find the SpriteIndex (read documentation if you're unclear why you need this)
    // var spriteIndex;
    // var ide = world.children[0];
    // var sprites = ide.sprites.contents;
    // for (var i = 0; i < sprites.length; i++) {
    //     if (sprites[i].name === "NameOfSprite") {
    //         spriteIndex = i;
    //         break;
    //     }
    // }

    var thousandNumbersStartingFrom = "1000 numbers starting from %" //for style purposes please change both the string and the variable name i.e var desc = "desc"
	var chunk_1 = fb.newChunk('Complete the "' + thousandNumbersStartingFrom + '" block.'); //creates a chunk

	//basic function to check if the block is even in Snap!'s staging area
	var blockExists_1 = function () { 
		//if multiple sprites return spriteContainsBlock(thousandNumbersStartingFrom, spriteIndex);
		return spriteContainsBlock(thousandNumbersStartingFrom);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + thousandNumbersStartingFrom + '" and place it in the scripting area.',
        'The "' + thousandNumbersStartingFrom + '" block exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + thousandNumbersStartingFrom + '" block is in the scripting area.',
        'The "' + thousandNumbersStartingFrom + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + thousandNumbersStartingFrom + '" and place it in the scripting area.',
        1
    );


    //INPUT TEST CASE

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.', //be sure to follow the feedback guide here!
        'Great job! Your block reports the correct value for given inputs.'
    );
    var input_1_2_1 = [1]; //the test input is always stored in a list. If you are testing input that is a list just nest lists i.e [[1,2,3]]
    tip_1_2.newIOTest('r',  // testClass
        thousandNumbersStartingFrom,          // blockSpec //this is the block variable name
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = [];
            for (i = 0; i < 1000; i++) {
                expected[i] = i+1+"";
            }
            
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output + "";
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //converts output into strings so that we ensure that they are the same type
            }
            
            if (!_.isEqual(actual, expected)) {
                tip_2_2.suggestion = 'The output should be ' + expected + ';';
                tip_2_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var allDigitNumbers = "all % digit numbers" //for style purposes please change both the string and the variable name i.e var desc = "desc"
    var chunk_2 = fb.newChunk('Complete the "' + allDigitNumbers + '" block.'); //creates a chunk

    //basic function to check if the block is even in Snap!'s staging area
    var blockExists_2 = function () { 
        //if multiple sprites return spriteContainsBlock(thousandNumbersStartingFrom, spriteIndex);
        return spriteContainsBlock(allDigitNumbers);
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + allDigitNumbers + '" and place it in the scripting area.',
        'The "' + allDigitNumbers + '" block exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + allDigitNumbers + '" block is in the scripting area.',
        'The "' + allDigitNumbers + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + allDigitNumbers + '" and place it in the scripting area.',
        1
    );


    //INPUT TEST CASE

    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for the given inputs.', //be sure to follow the feedback guide here!
        'Great job! Your block reports the correct value for given inputs.'
    );
    var input_2_2_1 = [1]; //the test input is always stored in a list. If you are testing input that is a list just nest lists i.e [[1,2,3]]
    tip_2_2.newIOTest('r',  // testClass
        allDigitNumbers,          // blockSpec //this is the block variable name
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = [];
            for (i = 0; i < 9; i++) {
                expected[i] = i+1+"";
            }

            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output + "";
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //converts output into strings so that we ensure that they are the same type
            }
            if (!_.isEqual(actual, expected)) {
                tip_2_2.suggestion = 'The output should be ' + expected + ';';
                tip_2_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    var input_2_2_2 = [2]; //the test input is always stored in a list. If you are testing input that is a list just nest lists i.e [[1,2,3]]
    tip_2_2.newIOTest('r',  // testClass
        allDigitNumbers,          // blockSpec //this is the block variable name
        input_2_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = [];
            for (i = 0; i < 90; i++) {
                expected[i] = i+10+"";
            }

            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output + "";
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //converts output into strings so that we ensure that they are the same type
            }
            if (!_.isEqual(actual, expected)) {
                tip_2_2.suggestion = 'The output should be ' + expected + ';';
                tip_2_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    return fb;
    
}