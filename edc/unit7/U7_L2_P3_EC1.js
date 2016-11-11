var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U7_L2_P3_EC1";
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
        'Sorting a List of 500 Elements'
    );

    var sort = "sort %";
    var selection = "selection sort %";
    var partition = "partition sort %";

    /*var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Minimize Function") {
            spriteIndex = i;
            break;
        }
    }*/

    var chunk_1 = fb.newChunk('Complete the "' + sort + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(sort);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + sort + '", place it in the scripting area, and that it is recursive.',
        'The "' + sort + '" block exists and is recursive.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + sort + '" block is in the scripting area.',
        'The "' + sort + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + sort + '" and place it in the scripting area.',
        1
    );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input = [];
    for (var i = 0; i < 500; i++) {
        input.push(getRandomArbitrary(0, 500));
    }
    out = [];
    for (var j = 0; j < input.length; j++) {
        out.push(input[j]);
    }
    out.sort();
    out.map(String);
    var input_1_2_1 = [input];
    tip_1_2.newIOTest('r',  // testClass
        sort,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = out;
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
                actual += ""; //to string
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


    var chunk_2 = fb.newChunk('Complete the "' + selection + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(selection);
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + selection + '" and place it in the scripting area.',
        'The "' + selection + '" block exists and is recursive.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + selection + '" block is in the scripting area.',
        'The "' + selection + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + selection + '" and place it in the scripting area.',
        1
    );

    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = [input];
    tip_2_2.newIOTest('r',  // testClass
        selection,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = out;
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
                actual += ""; //to string
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //turns into strings
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

    var chunk_3 = fb.newChunk('Complete the "' + partition + '" block.');

    var blockExists_3 = function () {
        return spriteContainsBlock(partition);
    }

    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "' + partition + '", place it in the scripting area, and that it is recursive.',
        'The "' + partition + '" block exists and is recursive.');

    tip_3_1.newAssertTest(
        blockExists_3,
        'Testing if the "' + partition + '" block is in the scripting area.',
        'The "' + partition + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + partition + '" and place it in the scripting area.',
        1
    );

    var tip_3_2 = chunk_3.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_3_2_1 = [input];
    tip_3_2.newIOTest('r',  // testClass
        partition,          // blockSpec
        input_3_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = out;
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
                actual += ""; //to string
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

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}