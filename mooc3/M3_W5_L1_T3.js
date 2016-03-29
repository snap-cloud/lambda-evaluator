var starter_path = 'caesar_starter.xml';
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.3x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M3_W5_L1_T3";
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
        'Caesar Cipher'
    );

    var blockName = "Caesar Encode letter % with % key"
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
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = ['a', 2];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = 'c';
            actual = output;
            if (actual !== expected) {
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

    var input_1_2_2 = ['Z', 2];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = 'B';
            actual = output;
            if (actual !== expected) {
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

    var input_1_2_3 = ['!', 2];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = '!';
            actual = output;
            if (actual !== expected) {
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








    var blockName = "Caesar Encode sentence % with % key"
    var chunk_2 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );


    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2 = ['Hello Azia!', 5];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = 'Mjqqt Fenf!';
            console.log(output);
            console.log(typeof output);
            actual = output;
            if (actual !== expected && actual.substring(0, 11) !== expected) {
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

    var tip_2_3 = chunk_2.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_3 = ['you can do anything!!', 3];
    tip_2_3.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;
            expected = 'brx fdq gr dqbwklqj!!';
            console.log(output);
            console.log(expected);
            console.log(output.length);
            console.log(expected.length);
            
            console.log(output.toString() == expected.toString());
            console.log(output === "brx fdq gr dqbwklqj!!");
            actual = output;
            if (actual !== expected && actual.substring(0, 21) !== expected) {
                tip_2_3.suggestion = 'The output should be ' + expected + ';';
                tip_2_3.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );








    var blockName = "Caesar Decode sentence % with % key"
    var chunk_3 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_3 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_3_1.newAssertTest(
        blockExists_3,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );


    var tip_3_2 = chunk_3.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_3_2 = ['Mjqqt Fenf!', 5];
    tip_3_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_3_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = 'Hello Azia!';
            actual = output;
            if (actual !== expected && actual.substring(0, 11) !== expected) {
                tip_3_2.suggestion = 'The output should be ' + expected + ';';
                tip_3_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var tip_3_3 = chunk_3.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_3_3 = ['ynnjcq ypc fcyjrfw', 24];
    tip_3_3.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_3_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = 'apples are healthy';
            actual = output;
            if (actual !== expected && actual.substring(0, 18) !== expected) {
                tip_3_3.suggestion = 'The output should be ' + expected + ';';
                tip_3_3.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );





    var blockName = "Number of words from sentence % in dictionary %"
    var chunk_4 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_4 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_4_1 = chunk_4.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_4_1.newAssertTest(
        blockExists_4,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );


    var tip_4_2 = chunk_4.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_4_2 = ['My dog chased your dog and cat', ['dog', 'cat']];
    tip_4_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_4_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;
            expected = 3;
            actual = output;
            if (actual !== expected) {
                tip_4_2.suggestion = 'The output should be ' + expected + ';';
                tip_4_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var tip_4_3 = chunk_4.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_4_3 = ['Green eggs and ham', ['eggs', 'ketchup']];
    tip_4_3.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_4_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;
            expected = 1;
            actual = output;
            if (actual !== expected) {
                tip_4_3.suggestion = 'The output should be ' + expected + ';';
                tip_4_3.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );








    var blockName = "Caesar Crack Key from sentence % using dictionary %"
    var chunk_5 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_5 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_5_1 = chunk_5.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_5_1.newAssertTest(
        blockExists_5,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );


    var tip_5_2 = chunk_5.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_5_2 = ['Mjqqt Fenf!', ['hello', 'goodbye']];
    tip_5_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_5_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;
            expected = 5;
            if (typeof output === 'string') {
                actual = Number(output);
            } else {
                actual = output;
            }
            if (actual !== expected) {
                tip_5_2.suggestion = 'The output should be ' + expected + ';';
                tip_5_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var tip_5_3 = chunk_5.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_5_3 = ['P svcl jollzl', ['hello', 'goodbye', 'friends', 'cheese', 'love', 'cake', 'I']];
    tip_5_3.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_5_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;
            expected = 7;
            if (typeof output === 'string') {
                actual = Number(output);
            } else {
                actual = output;
            }
            if (actual !== expected) {
                tip_5_3.suggestion = 'The output should be ' + expected + ';';
                tip_5_3.suggestion += ' but was ' + actual + '.';
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