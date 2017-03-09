var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U7_L3_P4_EC1";
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
        'Base'
    );

    var base = "% base %";
    var from_base = "% from base %";

    /*var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Minimize Function") {
            spriteIndex = i;
            break;
        }
    }*/

    var chunk_1 = fb.newChunk('Complete the "' + base + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(base);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + base + '", place it in the scripting area, and that it is recursive.',
        'The "' + base + '" block exists and is recursive.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + base + '" block is in the scripting area.',
        'The "' + base + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + base + '" and place it in the scripting area.',
        1
    );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    
    var input_1_2_1 = ["1234567", "16"];
    tip_1_2.newIOTest('r',  // testClass
        base,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "12D687";
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


    var chunk_2 = fb.newChunk('Complete the "' + from_base + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(from_base);
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + from_base + '" and place it in the scripting area.',
        'The "' + from_base + '" block exists and is recursive.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + from_base + '" block is in the scripting area.',
        'The "' + from_base + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + from_base + '" and place it in the scripting area.',
        1
    );

    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = ["12D687", "16"];
    tip_2_2.newIOTest('r',  // testClass
        from_base,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "1234567";
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


    return fb;
    
    }

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}