var starter_path = "M4_W3_L1_T1_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W3_L2_T1";
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
        'Factorions'
    );

    var blockName = "is % a factorion?";
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
        'Your block should return the correct values for the given valid general inputs.',
        'Great job! Your block reports true for given inputs.'
    );

    var input_1_2_1 = [1];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
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


    var tip_1_3 = chunk_1.newTip(
        'Your block should return the correct values for the given valid general inputs.',
        'Great job! Your block reports true for given inputs.'
    );

    var input_1_2_2 = [40585];
    tip_1_3.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_2,        // input
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

    var tip_1_4 = chunk_1.newTip(
        'Your block should return the correct value for the given invalid input.',
        'Great job! Your block reports false for the given invalid input.'
    );
    var input_1_2_3 = [14]; //edge case 1
    tip_1_4.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_3,        // input
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
                tip_1_2.suggestion += ' but was ' + actual + '. Remember that the function should be inclusive!';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

     var tip_1_5 = chunk_1.newTip(
        'Your block should return the correct value for the given invalid input.',
        'Great job! Your block reports false for the given invalid input.'
    );
    var input_1_2_4 = [42]; //edge case 1
    tip_1_5.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_4,        // input
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
                tip_1_2.suggestion += ' but was ' + actual + '. Remember that the function should be inclusive!';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var blockName_2 = "list all factorions between % and %";
    var chunk_2 = fb.newChunk('Complete the "' + blockName + '" block.');

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
        'Great job! Your block reports the correct list for given inputs.'
    );

    var input_2_2_1 = [1,150];
    tip_2_2.newIOTest('r',  // testClass
        blockName_2,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["1", "2", "145"];
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

    var checkHOF_factorion = function()
    {
        var hasMap = customBlockContains("is % a factorion?", "map % over %");
        var hasKeep = customBlockContains("is % a factorion?", "keep items such that % from %");
        var hasCombine = customBlockContains("is % a factorion?", "combine with % items of %");
        return hasMap || hasKeep || hasCombine;
    }

    var tip_3_1 = chunk_1.newTip("Try your best to use HOFs.", "Uses HOFs in this exercise.");
    tip_3_1.newAssertTest(
        checkHOF_factorion,
        'Testing if the "is % a factorion?" block uses HOFs.',
        'the "is % a factorion?" block uses HOFs.',
        'Make sure you try and use HOFs.',
        1
    );

    var checkHOF_factorionList = function()
    {
        var hasFac = customBlockContains("list all factorions between % and %", "is % a factorion?");
        return hasFac;
    }

    var tip_3_2 = chunk_2.newTip("Try your best to use HOFs.", "Uses HOFs in this exercise.");
    tip_3_2.newAssertTest(
        checkHOF_factorionList,
        'Testing if the "list all factorions between % and %" block uses HOFs.',
        'the "list all factorions between % and %" block uses HOFs.',
        'Make sure you try and use HOFs.',
        1
    );


    return fb;
    
    }