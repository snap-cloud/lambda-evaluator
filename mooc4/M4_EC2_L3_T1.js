var starter_path = "M4_EC2_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_EC2_L3_T1";
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
        'Going Home'
    );


    var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Going Home") {
            spriteIndex = i;
            break;
        }
    }
  var path-home = "path-home? %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_1 = fb.newChunk('Complete the "' + path-home + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(path-home, spriteIndex);
    }


    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + path-home + '" and place it in the scripting area.',
        'The "' + path-home + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + path-home + '" block is in the scripting area.',
        'The "' + path-home + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + path-home + '" and place it in the scripting area.',
        1
    );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [7];
    tip_1_2.newIOTest('r',  // testClass
        path-home,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = true;
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
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

    var input_1_2_2 = [5];
    tip_1_2.newIOTest('r',  // testClass
        path-home,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);
            expected = false;
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
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


    // path-homew = "path-home without self %";

    // /*var ide = world.children[0];
    // var sprites = ide.sprites.contents;
    // for (var i = 0; i < sprites.length; i++) {

    // }*/

    // var chunk_2 = fb.newChunk('Complete the "' + path-homew + '" block.');

    // var blockExists_2 = function () {
    //     return spriteContainsBlock(path-homew, spriteIndex);
    // }


    // var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + path-homew + '" and place it in the scripting area.',
    //     'The "' + path-homew + '" block exists.');

    // tip_2_1.newAssertTest(
    //     blockExists_2,
    //     'Testing if the "' + path-homew + '" block is in the scripting area.',
    //     'The "' + path-homew + '" block is in the scripting area.',
    //     'Make sure you name your block exactly "' + path-homew + '" and place it in the scripting area.',
    //     1
    // );

    // var tip_2_2 = chunk_2.newTip(
    //     'Your block should return the correct values for the given inputs.',
    //     'Great job! Your block reports the correct value for given inputs.'
    // );

    // var input_2_2_1 = ["b"];
    // tip_2_2.newIOTest('r',  // testClass
    //     path-homew,          // blockSpec
    //     input_2_2_1,        // input
    //     function (output) {
    //         // Output should be a list of numbers.
    //         var expected,
    //             actual;
    //         console.log(output);

    //         expected = "4";
    //         if (output instanceof List) {
    //             actual = output.asArray();
    //         } else {
    //             actual = output;
    //         }
    //         for (i = 0; i < actual.length; i++)
    //         {
    //             actual[i] = actual[i] + ""; //turns into strings
    //         }
    //         if (!_.isEqual(actual, expected)) {
    //             tip_1_2.suggestion = 'The output should be ' + expected + ';';
    //             tip_1_2.suggestion += ' but was ' + actual + '.';
    //             return false;
    //         }
    //         return true;
    //     },
    //     4 * 1000, // 4 second time out.
    //     true, // is isolated
    //     1 // points
    // );

    // var input_2_2_2 = ["a"];
    // tip_2_2.newIOTest('r',  // testClass
    //     path-homew,          // blockSpec
    //     input_2_2_2,        // input
    //     function (output) {
    //         // Output should be a list of numbers.
    //         var expected,
    //             actual;
    //         console.log(output);

    //         expected = "8";
    //         if (output instanceof List) {
    //             actual = output.asArray();
    //         } else {
    //             actual = output;
    //             actual += "";
    //         }
    //         for (i = 0; i < actual.length; i++)
    //         {
    //             actual[i] = actual[i] + ""; //turns into strings
    //         }
    //         if (!_.isEqual(actual, expected)) {
    //             tip_1_2.suggestion = 'The output should be ' + expected + ';';
    //             tip_1_2.suggestion += ' but was ' + actual + '.';
    //             return false;
    //         }
    //         return true;
    //     },
    //     4 * 1000, // 4 second time out.
    //     true, // is isolated
    //     1 // points
    // );

    return fb;
    
    }