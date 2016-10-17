var starter_path = "hw1_starter_file.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.1x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_hw1";
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
var showPoints = true;

function AGTest(outputLog) {

    //NOTES TO YIFAT AND PATRICK:
    // No IO tests should be isolated. Which means that you have to check that the block
    // is on screen.
    // All getter/setter functions inside anonymous Assert functions.
    // Thanks for all your work :D
    //
    //
    //
    //
    // NAMING CONVENTIONS:
    //
    // **** VARIABLES ****
    // If you are going to make a variable like this:
    //
    // var turnExists = function() {
    //     return spriteContainsBlock("% !");
    // }
    //
    // please instead append a "_n" to the end, where the "n" is the chunk number associated
    // with the given function. So, if the "turnExists" function above were from chunk 2,
    // then please name it: "turnExists_2" and NOT JUST "turnExists" because if more than
    // one chunk has the same function called "turnExists", then bad things will happen bro.
    // **THE ONE EXCEPTION IS THE FEEDBACK LOG and WORLD** -- PLEASE HAVE THESE TWO LINES
    // AT THE TOP OF YOUR AGTEST() FUNCTION BODY:
    //
    // var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    // fb.snapWorld = world;
    //
    //
    //
    //
    // **** CHUNKS ****
    // please name chunks according to the exercise number they correspond to. For
    // example, if I am writing a chunk for exercise 3, name the chunk like this:
    //
    // chunk_3 = fb.newChunk('Make the block that exercise 3 is asking');
    //
    // so clarify it is "chunk_n" where 'n' is the number of the exercise.
    //
    //
    //
    //
    // **** TIPS ****
    // please name tips according to their chunk and which tip within that chunk
    // they are. So for example, if I am writing the second tip for chunk 4, then
    // please write it as:
    //
    // tip_4_2 = chunk_4.newTip("Make sure you name your block exactly...");
    //
    // to clarify, it is "tip_j_k" where "j" is the chunk number and "k" is
    // the tip number.
    //
    //
    //
    //
    // **** ASSERT TESTS ****
    // please do not assign these function calls to variables names. it is
    // uncessary and will result in more confusion. So for example, to create
    // a new ASSERT TEST, just do the following:
    //
    // tip_1_2.newAssertTest(
    //    multiplyExists_1,
    //    "Testing if there is a multiplication block in the factorial block.",
    //    "There is a multiplication block in the factorial block.",
    //    "Make sure you use the multiplication block in your factorial block.",
    //    1);
    //
    //
    //
    //
    // **** IO TESTS ****
    // same as the assert tests above. To create a new IO TEST, please don't
    // assign it a variable, just do the following:
    //
    // tip_1_4.newIOTest('r',  //testClass
    //     '% !',  //blockSpec
    //     [5],  //input
    //     120,  //output
    //     -1,  //timeout
    //     false,  //isolated
    //     1);  //points


    var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    fb.snapWorld = world;


/* Create chunk_1 for the correct guess? block */
    var chunk_1 = fb.newChunk('Make the "correct guess?" block.');

    var correctGuessExists_1 = function () {
        return spriteContainsBlock("is guess % correct for secret % ?");
    }


    // Add a first tip to that first test chunk
    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "is guess % correct for secret % ?".',
        'Great job!');

    tip_1_1.newAssertTest(
        correctGuessExists_1,
        "Testing if there is a correct guess? block in the scripting area.",
        "There is a correct guess? block in the scripting area.",
        "Make sure you name your block exactly 'is guess % correct for secret % ?' and place it in the scripting area.",
        0);


    var tip_1_2 = chunk_1.newTip('Make sure your block works for general cases.',
        'Great job!');


     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["cat", "cat"],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["cat", "dog"],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["dog", "cat"],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["dog", "dog"],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["treehouse", "treehouse"],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["", ""],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["", "stuff"],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_1_2.newIOTest('r',  //testClass
        'is guess % correct for secret % ?',  //blockSpec
        ["stuff", ""],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points


/* Create chunk_2 for the same length? block */
    var chunk_2 = fb.newChunk('Make the "same length?" block.');

    var sameLengthExists_2 = function () {
        return spriteContainsBlock("is % same length as % ?");
    }


    // Add a first tip to that first test chunk
    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "is % same length as % ?".',
        'Great job!');

    tip_2_1.newAssertTest(
        sameLengthExists_2,
        "Testing if there is a same length? block in the scripting area.",
        "There is a same length? block in the scripting area.",
        "Make sure you name your block exactly 'is % same length as % ?' and place it in the scripting area.",
        0);


    var tip_2_2 = chunk_2.newTip('Make sure your block works for general cases.',
        'Great job!');


     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["dog", "cat"],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["dog", "cats"],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["dogs", "cat"],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["", "cat"],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["", ""],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["stuff", ""],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["treehouse", "treehouse"],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

     tip_2_2.newIOTest('r',  //testClass
        'is % same length as % ?',  //blockSpec
        ["treehouses", "treehouses"],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        0.125);  //points

/* Create chunk_3 for the count matching block */
    var chunk_3 = fb.newChunk('Make the "count matching" block.');

    var countMatchingExists_3 = function () {
        return spriteContainsBlock("count matching letters in guess % and secret %");
    }


    // Add a first tip to that first test chunk
    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "count matching letters in guess % and secret %".',
        'Great job!');

    tip_3_1.newAssertTest(
        countMatchingExists_3,
        "Testing if there is a count matching block in the scripting area.",
        "There is a count matching block in the scripting area.",
        "Make sure you name your block exactly 'count matching letters in guess % and secret %' and place it in the scripting area.",
        0);


    var tip_3_2 = chunk_3.newTip('Make sure your block works for general cases.',
        'Great job!');


     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["dog", "cat"],  //input
        0,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["dog", "fog"],  //input
        2,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["trees", "heats"],  //input
        1,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["pool", "wool"],  //input
        3,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["a", "b"],  //input
        0,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["", ""],  //input
        0,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["racecars", "superman"],  //input
        1,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_3_2.newIOTest('r',  //testClass
        'count matching letters in guess % and secret %',  //blockSpec
        ["racecars", "racecarr"],  //input
        7,  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points







/* Create chunk_4 for the respond to block */
    var chunk_4 = fb.newChunk('Make the "respond to" block.');

    var respondToExists_4 = function () {
        return spriteContainsBlock("create response for guess % secret % after %");
    }


    // Add a first tip to that first test chunk
    var tip_4_1 = chunk_4.newTip('Make sure you name your block exactly "create response for guess % secret % after %".',
        'Great job!');

    tip_4_1.newAssertTest(
        respondToExists_4,
        "Testing if there is a respond to block in the scripting area.",
        "There is a respond to block in the scripting area.",
        "Make sure you name your block exactly 'create response for guess % secret % after %' and place it in the scripting area.",
        0);



    var tip_4_2 = chunk_4.newTip('Make sure your block works for when you get the guess correct.',
        'Great job!');


     tip_4_2.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["batman", "batman", 6],  //input
        "Great job! You got the word in 6 guess(es)!",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_4_2.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["superlongword", "superlongword", 1],  //input
        "Great job! You got the word in 1 guess(es)!",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     var tip_4_3 = chunk_4.newTip('Make sure your block works for when you guess a word with the wrong length.',
        'Great job!');

     tip_4_3.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["cheese", "building", 1],  //input
        "Nope! The secret word has 8 letter(s)",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_4_3.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["superlongword", "low", 1],  //input
        "Nope! The secret word has 3 letter(s)",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     var tip_4_4 = chunk_4.newTip('Make sure your block works for when your guess has the correct length but is still wrong.',
        'Great job!');

     tip_4_4.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["fires", "wires", 1],  //input
        "You got 4 letter(s) correct.",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_4_4.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["heroes", "tigers", 1],  //input
        "You got 1 letter(s) correct.",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_4_4.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["lion", "dogs", 1],  //input
        "You got 0 letter(s) correct.",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points

     tip_4_4.newIOTest('r',  //testClass
        'create response for guess % secret % after %',  //blockSpec
        ["fun", "sun", 1],  //input
        "You got 2 letter(s) correct.",  //output
        -1,  //timeout
        false,  //isolated
        0.5);  //points


    return fb;
}