var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W2_L3_T1";
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
        'Even Numbers'
    );

    var blockName = "ends-e %"
    var chunk_1 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName);
    }

    var baseCaseExists_1 = function() {
        return customBlockContains(blockName, "if %b %c") || customBlockContains(blockName, "if %b %c else %c");
    }

    var recursionExists_1 = function() {
        return customBlockContains(blockName, blockName);
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

    var tip_1_1a = chunk_1.newTip('Make sure you are using recursion. Do you have both a base case and a recursive case?',
        'The "' + blockName + '" block uses recursion.');

    tip_1_1a.newAssertTest(
        baseCaseExists_1,
        'Testing if the "' + blockName + '" block has a base case.',
        'The "' + blockName + '" block has a base case.',
        'Make sure your block "' + blockName + '" has a base case. What is the simplest kind of list you could pass into this function?',
        1
    );

    tip_1_1a.newAssertTest(
        recursionExists_1,
        'Testing if the "' + blockName + '" block calls itself.',
        'The "' + blockName + '" block calls itself.',
        'Make sure your block "' + blockName + '" calls itself.',
        1
    );


    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [['the', 'rain', 'in', 'Spain', 'is', 'in', 'Europe']];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;
            console.log(output);

            expected = ['the', 'Europe'];
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

    var input_1_2_2 = [['i', 'eat', 'pizza', 'everyday', 'for', 'dinner']];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = [];
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

    var input_1_2_3 = [['that', 'bench', 'is', 'very', 'well', 'made']];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = ['made'];
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

    var blockName = "numbers %";
    var chunk_2 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(blockName);
    }

    var baseCaseExists_2 = function() {
        return customBlockContains(blockName, "if %b %c") || customBlockContains(blockName, "if %b %c else %c");
    }

    var recursionExists_2 = function() {
        return customBlockContains(blockName, blockName);
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

    var tip_2_1a = chunk_2.newTip('Make sure you are using recursion. Do you have both a base case and a recursive case?',
        'The "' + blockName + '" block uses recursion.');

    tip_2_1a.newAssertTest(
        baseCaseExists_2,
        'Testing if the "' + blockName + '" block has a base case.',
        'The "' + blockName + '" block has a base case.',
        'Make sure your block "' + blockName + '" has a base case. What is the simplest kind of list you could pass into this function?',
        1
    );

    tip_2_1a.newAssertTest(
        recursionExists_2,
        'Testing if the "' + blockName + '" block calls itself.',
        'The "' + blockName + '" block calls itself.',
        'Make sure your block "' + blockName + '" calls itself.',
        1
    );

    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = [['the', '1', 'after', '909']];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = ['1', '909'];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
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

    var input_2_2_2 = [['there', 'are', 'no', 'numbers', 'here']];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_2,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = [];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
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

    var input_2_2_3 = [['1', '2', '45', '-79', '0']];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_3,        // input
        function (output) {
            // Output should be a list of 2D lists.
            var expected,
                actual;

            expected = ['1', '2', '45', '-79', '0'];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
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