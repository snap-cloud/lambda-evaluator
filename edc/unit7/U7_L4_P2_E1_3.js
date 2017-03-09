var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U7_L4_P2_E1_3";
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
        'Generalizing the Map Pattern'
    );



    var blockName = "exaggerate %";

    /*var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Minimize Function") {
            spriteIndex = i;
            break;
        }
    }*/

    var chunk_2 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(blockName);
    }

    /*var baseCaseExists_2 = function() {
        return customBlockContains(blockName, "if %b %c") || customBlockContains(blockName, "if %b %c else %c");
    }

    var recursionExists_2 = function() {
        return customBlockContains(blockName, blockName);
    }*/

    var mapExists_2 = function() {
        return customBlockContains(blockName, "map %repRing over %mult%l");
    }


    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + blockName + '", place it in the scripting area, and that it uses the map block.',
        'The "' + blockName + '" block exists.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );


    /*tip_2_1.newAssertTest(
        baseCaseExists_2,
        'Testing if the "' + blockName + '" block has a base case.',
        'The "' + blockName + '" block has a base case.',
        'Make sure your "' + blockName + '" block has a base case.',
        1
    );

    tip_2_1.newAssertTest(
        recursionExists_2,
        'Testing if the "' + blockName + '" block calls itself within its function body.',
        'The "' + blockName + '" block calls itself within its function body.',
        'Make sure your "' + blockName + '" block calls itself within its function body.',
        1
    );*/

    tip_2_1.newAssertTest(
        mapExists_2,
        'Testing if the "' + blockName + '" block calls the "map" block.',
        'The "' + blockName + '" block calls the "map" block.',
        'Make sure your "' + blockName + '" block calls the "map" block.',
        1
    );



    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = "I ate 6 really good potstickers.";
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "I ate 12 really great potstickers.";
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

    var input_2_2_2 = "The good guys found 4 traps left by the bad guys.";
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "The great guys found 8 traps left by the terrible guys.";
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

    var input_2_2_3 = "I like to eat pizza, but dislike anchovies.";
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_3,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "I love to eat pizza, but hate anchovies.";
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

    var input_2_2_4 = "Here is a sentence that needs no exaggeration.";
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_4,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "Here is a sentence that needs no exaggeration.";
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





    var blockName = "pairup %";

    /*var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Minimize Function") {
            spriteIndex = i;
            break;
        }
    }*/

    var chunk_1 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName);
    }

    /*var baseCaseExists_1 = function() {
        return customBlockContains(blockName, "if %b %c") || customBlockContains(blockName, "if %b %c else %c");
    }

    var recursionExists_1 = function() {
        return customBlockContains(blockName, blockName);
    }*/


    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + blockName + '", place it in the scripting area, and that it is recursive.',
        'The "' + blockName + '" block exists and is recursive.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );

    /*tip_1_1.newAssertTest(
        baseCaseExists_1,
        'Testing if the "' + blockName + '" block has a base case.',
        'The "' + blockName + '" block has a base case.',
        'Make sure your "' + blockName + '" block has a base case.',
        1
    );

    tip_1_1.newAssertTest(
        recursionExists_1,
        'Testing if the "' + blockName + '" block calls itself within its function body.',
        'The "' + blockName + '" block calls itself within its function body.',
        'Make sure your "' + blockName + '" block calls itself within its function body.',
        1
    );*/



    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [["now", "here", "after", "math"]];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["nowhere", "hereafter", "aftermath"];
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

    var input_1_2_2 = [[]];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = [];
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

    var input_1_2_3 = [["1", "2", "3", "4"]];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_3,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["12", "23", "34"];
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