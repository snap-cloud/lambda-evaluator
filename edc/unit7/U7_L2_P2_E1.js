var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U7_L2_P2_E1";
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
        'Selection Sort'
    );


    var blockName = "earliest in %";

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

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists and is recursive.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );



    var tip_2_2 = chunk_2.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_2_2_1 = [["Emma", "Olivia", "Sophia", "Isabella", "Ava", "Mia", "Emily", "Abigail"]];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "Abigail";
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

    var input_2_2_2 = [[3, 6, 2, 4, 1]];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "1";
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

    var input_2_2_3 = [[]];
    tip_2_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_2_2_3,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = "";
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






    var blockName = "selection sort %";

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

    var baseCaseExists_1 = function() {
        return customBlockContains(blockName, "if %b %c") || customBlockContains(blockName, "if %b %c else %c");
    }

    var recursionExists_1 = function() {
        return customBlockContains(blockName, blockName);
    }

    var earliestInExists_1 = function() {
        return customBlockContains(blockName, "earliest in %");
    }


    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + blockName + '", place it in the scripting area, and that it is recursive.',
        'The "' + blockName + '" block exists and is recursive.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );

    tip_1_1.newAssertTest(
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
    );

    tip_1_1.newAssertTest(
        earliestInExists_1,
        'Testing if the "' + blockName + '" block uses the "earliest in %" block.',
        'The "' + blockName + '" block uses the "earliest in %" block.',
        'Make sure your "' + blockName + '" block uses the "earliest in %" block.',
        1
    );



    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [["Emma", "Olivia", "Sophia", "Isabella", "Ava", "Mia", "Emily", "Abigail"]];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["Abigail", "Ava", "Emily", "Emma", "Isabella", "Mia", "Olivia", "Sophia"];
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

    var input_1_2_2 = [[3, 6, 2, 4, 1]];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["1", "2", "3", "4", "6"];
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

    var input_1_2_3 = [[]];
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_1_2_3,        // input
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

    var blockName = "names starting with %";

    var chunk_3 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_3 = function () {
        return spriteContainsBlock(blockName);
    }

    var selectionSortExists_3 = function() {
        return customBlockContains(blockName, "selection sort %");
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

    tip_3_1.newAssertTest(
        selectionSortExists_3,
        'Testing if the "' + blockName + '" block calls the "selection sort" block.',
        'The "' + blockName + '" block calls the "selection sort" block within its function body.',
        'Make sure your "' + blockName + '" block calls the "selection sort" block within its function body.',
        1
    );


    var tip_3_2 = chunk_3.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_3_2_1 = ["U"];
    tip_3_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        input_3_2_1,        // input
        function (output) {
            // Output should be a list of names.
            var expected,
                actual;
            console.log(output);

            expected = ["Ubah", "Ubaid", "Ubaldo", "Uchechukwu", "Uchenna", "Uday", "Udy", "Ugochi", "Ugochukwu", "Ugonna", "Ula", "Ulani", "Ulices", "Ulises", "Ulisses", "Ulric", "Ulrich", "Ulyana", "Ulyses", "Ulyssa", "Ulysses", "Uma", "Umaima", "Umair", "Umaira", "Umaiza", "Umar", "Umberto", "Ume", "Umer", "Umi", "Umika", "Umme", "Umut", "Una", "Unique", "Unique", "Unity", "Unknown", "Unknown", "Upton", "Urban", "Urbano", "Urenna", "Uri", "Uriah", "Uriah", "Urias", "Urie", "Uriel", "Uriel", "Urijah", "Urijah", "Uriyah", "Uriyah", "Ursula", "Urvi", "Urwa", "Usher", "Usiel", "Usman", "Uthman", "Uvaldo", "Uyen", "Uzair", "Uzay", "Uzayr", "Uziah", "Uziel", "Uzziah", "Uzziel"];

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

            var actualDeduped = actual.filter(function (el, i, arr) {
                return arr.indexOf(el) === i;
            });
            // Check if student actually returned a list with duplicates removed
            if (actual.length == actualDeduped.length) {
                var expectedDeduped = expected.filter(function (el, i, arr) {
                    return arr.indexOf(el) === i;
                });

                if (!_.isEqual(actual, expectedDeduped)) {
                    // Can't display the full expected output because it's way too long
                    tip_3_2.suggestion = 'The output had ' + actual.length + ' unique items;';
                    tip_3_2.suggestion += ' it should have ' + expectedDeduped.length + ' items.';
                    return false;
                }
            }
            else {
                if (!_.isEqual(actual, expected)) {
                    tip_3_2.suggestion = 'The output had ' + actual.length + ' items;';
                    tip_3_2.suggestion += ' it should have ' + expected.length + ' items.';
                    return false;
                }
            }

            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    return fb;
}