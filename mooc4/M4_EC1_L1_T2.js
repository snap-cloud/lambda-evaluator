var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_EC1_L1_T2";
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
        'Beyond Binary'
    );

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/
    // var spriteIndex;
    // var ide = world.children[0];
    // var sprites = ide.sprites.contents;
    // for (var i = 0; i < sprites.length; i++) {
    //     if (sprites[i].name === "Hanoi") {
    //         spriteIndex = i;
    //         break;
    //     }
    // }
  var base7 = "base7 %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_1 = fb.newChunk('Complete the "' + base7 + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(base7);
    }


    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + base7 + '" and place it in the scripting area.',
        'The "' + base7 + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + base7 + '" block is in the scripting area.',
        'The "' + base7 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + base7 + '" and place it in the scripting area.',
        1
    );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [400];
    tip_1_2.newIOTest('r',  // testClass
        base7,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "1111";
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

    var input_1_2_2 = [1111];
    tip_1_2.newIOTest('r',  // testClass
        base7,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "3145";
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
                actual += "";
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


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                             Base                                                                    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     var base = "% base %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_2 = fb.newChunk('Complete the "' + base + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(base);
    }


    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + base + '" and place it in the scripting area.',
        'The "' + base + '" block exists.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + base + '" block is in the scripting area.',
        'The "' + base + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + base + '" and place it in the scripting area.',
        1
    );

    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = [14, 9];
    tip_2_2.newIOTest('r',  // testClass
        base,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "15";
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

    var input_2_2_2 = [400, 21];
    tip_2_2.newIOTest('r',  // testClass
        base,          // blockSpec
        input_2_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "J1";
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                             From                                                                    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     var from = "% from base %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_3 = fb.newChunk('Complete the "' + from + '" block.');

    var blockExists_3 = function () {
        return spriteContainsBlock(from);
    }


    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "' + from + '" and place it in the scripting area.',
        'The "' + from + '" block exists.');

    tip_3_1.newAssertTest(
        blockExists_3,
        'Testing if the "' + from + '" block is in the scripting area.',
        'The "' + from + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + from + '" and place it in the scripting area.',
        1
    );

    var tip_3_2 = chunk_3.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_3_2_1 = ["400", 9];
    tip_3_2.newIOTest('r',  // testClass
        from,          // blockSpec
        input_3_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "324";
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

    var input_3_2_2 = ["G34", 20];
    tip_3_2.newIOTest('r',  // testClass
        from,          // blockSpec
        input_3_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "6464";
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