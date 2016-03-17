var starter_path = "M4_W3_L1_T1_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W3_L1_T1";
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, set this to false
var showFeedback = true;
// to allow ability to regrade certain tests, set this to true
var regradeOn = true;
function AGTest(outputLog) {
    var fb = new FeedbackLog(
        world,
        id,
        'Introduction and Warm Up'
    );

    var blockName = "list all numbers between % and %";
    var chunk_1 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName);
    }

    

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );


    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given general inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [8, 10];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["8", "9", "10"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //turns into strings
            }
            if (!_.isEqual(actual, expected)) {
                tip_1_2.suggestion = 'The output should be ' + expected + ';';
                tip_1_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var tip_1_3 = chunk_1.newTip(
        'Your block should return the correct value for the given edge case.',
        'Great job! Your block reports the correct value for given edge case.'
    );
    var input_1_2_2 = [5, 5]; //edge case 1
    tip_1_3.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["5"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //turns into strings
            }
            if (!_.isEqual(actual, expected)) {
                tip_1_2.suggestion = 'The output should be ' + expected + ';';
                tip_1_2.suggestion += ' but was ' + actual + '. Remember that the function should be inclusive!';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

     var tip_1_4 = chunk_1.newTip(
        'Your block should return the correct values for the given edge case.',
        'Great job! Your block reports the correct value for given edge case.'
    );
    var input_1_2_3 = [10, 8]; //edge case 1
    tip_1_4.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_3,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["8", "9", "10"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //turns into strings
            }
            if (!_.isEqual(actual, expected)) {
                tip_1_2.suggestion = 'The output should be ' + expected + ';';
                tip_1_2.suggestion += ' but was ' + actual + '. Ordering should not matter!';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var blockName_2 = "word -> list %";
    var chunk_2 = fb.newChunk('Complete the "' + blockName_2 + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(blockName_2);
    }
     var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + blockName_2 + '" and place it in the scripting area.',
        'The "' + blockName_2 + '" block exists.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + blockName_2 + '" block is in the scripting area.',
        'The "' + blockName_2 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName_2 + '" and place it in the scripting area.',
        1
    );

    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct list for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = "snap";
    tip_2_2.newIOTest('r',  // testClass
        blockName_2,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["s", "n", "a", "p"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //turns into strings
            }
            if (!_.isEqual(actual, expected)) {
                tip_1_2.suggestion = 'The output should be ' + expected + ';';
                tip_1_2.suggestion += ' but was ' + actual + '.';
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