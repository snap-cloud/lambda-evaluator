var starter_path = "hw2_scaffold.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.2x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_hw2_scaffold";
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, change this flag to false
var showFeedback = true;
// to allow for the ability to regrade certain tests, change this flag to true
var regradeOn = false;
// Add tests to the outputLog. Function is called by runAGTest(id, outputLog)
// var testLog;
showPoints = true;
function AGTest(outputLog) {

    //NOTES TO YIFAT AND PATRICK:
    // IO tests should be isolated.
    // All getter/setter functions inside anonymous Assert functions.
    // Thanks for all your work :D


    var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    fb.snapWorld = world;

    var chunk_0 = fb.newChunk('Make the "length of longest word in %" block.');

    var lengthExists_0 = function () {
        return spriteContainsBlock("length of longest word in %");
    }

    var tip_0_1 = chunk_0.newTip('Make sure you name your block exactly "length of longest word in %" and place it in the scripting area.',
        'Great job!');

    tip_0_1.newAssertTest(
        lengthExists_0,
        "Testing if the 'length of longest word in %' block is in the scripting area.",
        "The 'length of longest word in %' block is in the scripting area.",
        "Make sure you name your block exactly 'length of longest word in %' and place it in the scripting area.",
        0);

    var tip_0_2 = chunk_0.newTip('Make sure your block works for any valid input.',
        'Great job!');

    tip_0_2.newIOTest('r',  //testClass
        'length of longest word in %',  //blockSpec
        [['dog', 'cat', 'tree', 'my', 'hello']],  //input
        5,  //output
        -1,  //timeout
        true,  //isolated
        0.7);  //points

    tip_0_2.newIOTest('r',  //testClass
        'length of longest word in %',  //blockSpec
        [['hi', 'morning', 'hello']],  //input
        7,  //output
        -1,  //timeout
        true,  //isolated
        0.7);  //points

    // tip_0_2.newIOTest('r',  //testClass
    //     'length of longest word in %',  //blockSpec
    //     [[]],  //input
    //     0,  //output
    //     -1,  //timeout
    //     true,  //isolated
    //     1);  //points

    tip_0_2.newIOTest('r',  //testClass
        'length of longest word in %',  //blockSpec
        [['TheBeautyAndJoyOfComputing']],  //input
        26,  //output
        -1,  //timeout
        true,  //isolated
        0.6);  //points

    var chunk_1 = fb.newChunk('Make the "choose secret word from % with length %" block.');

    var chooseExists_1 = function () {
        return spriteContainsBlock("choose secret word from % with length %");
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "choose secret word from % with length %" and place it in the scripting area.',
        'Great job!');

    tip_1_1.newAssertTest(
        chooseExists_1,
        "Testing if the 'choose secret word from % with length %' block is in the scripting area.",
        "The 'choose secret word from % with length %' block is in the scripting area.",
        "Make sure you name your block exactly 'choose secret word from % with length %' and place it in the scripting area.",
        0);

    var tip_1_2 = chunk_1.newTip('Make sure your block works for general inputs.',
        'Great job!');

    tip_1_2.newIOTest('r',  //testClass
        'choose secret word from % with length %',  //blockSpec
        [['dog', 'cat', 'tree', 'my', 'hello'], 5],  //input
        'hello',  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_1_2.newIOTest('r',  //testClass
        'choose secret word from % with length %',  //blockSpec
        [['dog', 'tree', 'my', 'hello'], 3],  //input
        'dog',  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_1_2.newIOTest('r',  //testClass
        'choose secret word from % with length %',  //blockSpec
        [['dog', 'cat', 'tree', 'my', 'hello'], 4],  //input
        'tree',  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_1_2.newIOTest('r',  //testClass
        'choose secret word from % with length %',  //blockSpec
        [['dog', 'cat', 'tree', 'my', 'hello'], 2],  //input
        'my',  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    var chunk_2 = fb.newChunk('Make the "player won? secret % guesses %" block.');

    var playerWonExists_2 = function () {
        return spriteContainsBlock("player won? secret % guesses %");
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "player won? secret % guesses %" and place it in the scripting area.',
        'Great job!');

    tip_2_1.newAssertTest(
        playerWonExists_2,
        "Testing if the 'player won? secret % guesses %' block is in the scripting area.",
        "The 'player won? secret % guesses %' block is in the scripting area.",
        "Make sure you name your block exactly 'player won? secret % guesses %' and place it in the scripting area.",
        0);

    var tip_2_2 = chunk_2.newTip('Make sure your block works for general inputs.',
        'Great job!');

    tip_2_2.newIOTest('r',  //testClass
        'player won? secret % guesses %',  //blockSpec
        ['banana', ['a', 'b', 'r', 'e', 'n']],  //input
        true,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_2_2.newIOTest('r',  //testClass
        'player won? secret % guesses %',  //blockSpec
        ['mango', ['m', 'a', 'g', 'n', 'o']],  //input
        true,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_2_2.newIOTest('r',  //testClass
        'player won? secret % guesses %',  //blockSpec
        ['apples', ['a', 'b', 'c', 'd', 'e']],  //input
        false,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_2_2.newIOTest('r',  //testClass
        'player won? secret % guesses %',  //blockSpec
        ['ant', ['a', 'n']],  //input
        false,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points


    // var chunk_3 = fb.newChunk('Make the "player lost? lives %" block.');

    // var playerLostExists_3 = function () {
    //     return spriteContainsBlock("player lost? lives %");
    // }

    // var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "player lost? lives %" and place it in the scripting area.',
    //     'Great job!');

    // tip_3_1.newAssertTest(
    //     playerLostExists_3,
    //     "Testing if the 'player lost? lives %' block is in the scripting area.",
    //     "The 'player lost? lives %' block is in the scripting area.",
    //     "Make sure you name your block exactly 'player lost? lives %' and place it in the scripting area.",
    //     1);

    // var tip_3_2 = chunk_3.newTip('Make sure your block works for general inputs.',
    //     'Great job!');

    // tip_3_2.newIOTest('r',  //testClass
    //     'player lost? lives %',  //blockSpec
    //     [0],  //input
    //     true,  //output
    //     -1,  //timeout
    //     true,  //isolated
    //     1);  //points

    // tip_3_2.newIOTest('r',  //testClass
    //     'player lost? lives %',  //blockSpec
    //     [1],  //input
    //     false,  //output
    //     -1,  //timeout
    //     true,  //isolated
    //     1);  //points

    // tip_3_2.newIOTest('r',  //testClass
    //     'player lost? lives %',  //blockSpec
    //     [3],  //input
    //     false,  //output
    //     -1,  //timeout
    //     true,  //isolated
    //     1);  //points

    var chunk_4 = fb.newChunk('Make the "number of % in %" block.');

    var numberOfExists_4 = function () {
        return spriteContainsBlock("number of % in %");
    }

    var tip_4_1 = chunk_4.newTip('Make sure you name your block exactly "number of % in %" and place it in the scripting area.',
        'Great job!');

    tip_4_1.newAssertTest(
        numberOfExists_4,
        "Testing if the 'number of % in %' block is in the scripting area.",
        "The 'number of % in %' block is in the scripting area.",
        "Make sure you name your block exactly 'number of % in %' and place it in the scripting area.",
        0);

    var tip_4_2 = chunk_4.newTip('Make sure your block works for all valid inputs.',
        'Great job!');

    tip_4_2.newIOTest('r',  //testClass
        'number of % in %',  //blockSpec
        ['b', 'table'],  //input
        1,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_4_2.newIOTest('r',  //testClass
        'number of % in %',  //blockSpec
        ['t', 'turtle'],  //input
        2,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_4_2.newIOTest('r',  //testClass
        'number of % in %',  //blockSpec
        ['s', 'scissors'],  //input
        4,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points

    tip_4_2.newIOTest('r',  //testClass
        'number of % in %',  //blockSpec
        ['r', 'table'],  //input
        0,  //output
        -1,  //timeout
        true,  //isolated
        0.5);  //points


    var chunk_5 = fb.newChunk('Make the "display pattern of % with %" block.');

    var diplayPatternExists_5 = function () {
        return spriteContainsBlock("display pattern of % with %");
    }

    var tip_5_1 = chunk_5.newTip('Make sure you name your block exactly "display pattern of % with %" and place it in the scripting area.',
        'Great job!');

    tip_5_1.newAssertTest(
        diplayPatternExists_5,
        "Testing if the 'display pattern of % with %' block is in the scripting area.",
        "The 'display pattern of % with %' block is in the scripting area.",
        "Make sure you name your block exactly 'display pattern of % with %' and place it in the scripting area.",
        0);

    var tip_5_2 = chunk_5.newTip('Make sure your block works for all valid inputs.',
        'Great job!');

    tip_5_2.newIOTest('r',  //testClass
        'display pattern of % with %',  //blockSpec
        ['tree', ['a', 'b', 'r', 'e']],  //input
        '-ree',  //output
        -1,  //timeout
        true,  //isolated
        0.4);  //points

    tip_5_2.newIOTest('r',  //testClass
        'display pattern of % with %',  //blockSpec
        ['ocean', ['o', 'b', 'r', 'c']],  //input
        'oc---',  //output
        -1,  //timeout
        true,  //isolated
        0.4);  //points

    tip_5_2.newIOTest('r',  //testClass
        'display pattern of % with %',  //blockSpec
        ['pie', ['i']],  //input
        '-i-',  //output
        -1,  //timeout
        true,  //isolated
        0.4);  //points

    tip_5_2.newIOTest('r',  //testClass
        'display pattern of % with %',  //blockSpec
        ['pie', ['o']],  //input
        '---',  //output
        -1,  //timeout
        true,  //isolated
        0.4);  //points

    tip_5_2.newIOTest('r',  //testClass
        'display pattern of % with %',  //blockSpec
        ['horse', ['h', 'e', 'r', 's', 'o']],  //input
        'horse',  //output
        -1,  //timeout
        true,  //isolated
        0.4);  //points


    return fb;
}