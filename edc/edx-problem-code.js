var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U2_W1_L3_T4_E_all";
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


/* Create chunk_1 for the exercise 1 : three input sum */
    var chunk_1 = fb.newChunk('Make the three-input addition block.');

    var add3Exists_1 = function () {
        return spriteContainsBlock("% + % + %");
    }
    var sumExists_1 = function () {
        var customBody = getCustomBody("% + % + %");
        var sumFound = scriptContainsBlock(customBody, "% + %");
        return sumFound;
    }


    // Add a first tip to that first test chunk
    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "% + % + %".',
        'Great job!');

    tip_1_1.newAssertTest(
        add3Exists_1,
        "Testing if there is a three-input add block in the scripting area.",
        "There is a three-input add block in the scripting area.",
        "Make sure you name your block exactly '% + % + %' and place it in the scripting area.",
        1);


    var tip_1_2 = chunk_1.newTip('Make sure your block contains a sum block.',
        'Great job!');

    tip_1_2.newAssertTest(
        sumExists_1,
        "Testing if there is a '% + %' block inside of the body of the three-input add block.",
        "There is a '% + %' block inside of the body of the three-input add block.",
        "Make sure there is a '% + %' block inside of the body of the three-input add block.",
        1);

    var tip_1_3 = chunk_1.newTip('Make sure your block works for general cases.',
        'Great job!');


     tip_1_3.newIOTest('r',  //testClass
        '% + % + %',  //blockSpec
        [10, 2, 5],  //input
        17,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     tip_1_3.newIOTest('r',  //testClass
        '% + % + %',  //blockSpec
        [-10, -2, 6],  //input
        -6,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     tip_1_3.newIOTest('r',  //testClass
        '% + % + %',  //blockSpec
        [0, 0, 0],  //input
        0,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     tip_1_3.newIOTest('r',  //testClass
        '% + % + %',  //blockSpec
        [100, -1000, 0],  //input
        -900,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points






/* Create chunk_2 for the exercise 2 : Make sure you create a function exactly named: 'sum of two smallest % and % and % */
    var chunk_2 = fb.newChunk('Make the sum of two smallest block.');


    /* Line 98 Sum of two smallest block */
    // Sum of two smallest: Make sure you create a function exactly named: 'sum of two smallest % and % and %'
    var sumOfTwoSmallestExists_2 = function () {
        return spriteContainsBlock("sum of two smallest % and % and %");
    }

    var useMaxBlock_2 = function () {
        var customBody = getCustomBody('sum of two smallest % and % and %');
        var maxBlockFound = scriptContainsBlock(customBody, "max of % and %");
        return maxBlockFound;
    }
    var useDifferenceBlock_2 = function () {
        var customBody = getCustomBody('sum of two smallest % and % and %');
        return scriptContainsBlock(customBody, "% − %");
    }
    var useTripleSumBlock_2 = function () {
        var customBody = getCustomBody('sum of two smallest % and % and %');
        return scriptContainsBlock(customBody, "% + % + %");
    }








    // Add a first tip to that first test chunk
    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "sum of two smallest % and % and %".',
        'Great job!');

    tip_2_1.newAssertTest(
        sumOfTwoSmallestExists_2,
        "Testing if there is a sum of two smallest block in the scripting area.",
        "There is a sum of two smallest block in the scripting area.",
        "Make sure you name your block exactly 'sum of two smallest % and % and %' and place it in the scripting area.",
        1);

    var tip_2_2 = chunk_2.newTip('Try using a max block.',
        'Great job!');

    tip_2_2.newAssertTest(
        useMaxBlock_2,
        "Testing if function uses a max block in the definition.",
        "Uses a max block in the definition of the function.",
        "Try using the max block we made in a previous exercise!",
        1);

    var tip_2_3 = chunk_2.newTip('Try using a difference block.',
        'Great job!');

    tip_2_3.newAssertTest(
        useDifferenceBlock_2,
        "Testing if function uses a difference block in the definition.",
        "Uses a difference block in the definition of the function.",
        "One way to approach this problem is thinking about each number as part of a whole. Can we take out something from that whole? What block would be helpful in that?",
        1);

    var tip_2_4 = chunk_2.newTip('Try using a three-input addition block".',
        'Great job!');

    tip_2_4.newAssertTest(
        useTripleSumBlock_2,
        "Testing if function uses a triple sum block in the definition of the function.",
        "Uses a triple sum block in the definition of the function.",
        "One way to approach this problem is thinking about each number as part of a whole. How can we construct that whole using a block we have already made? Which block would be useful that takes in three numbers?",
        1);

    var tip_2_5 = chunk_2.newTip('Make sure your block works for basic inputs.',
        'Great job!');



     tip_2_5.newIOTest('r',  //testClass
        'sum of two smallest % and % and %',  //blockSpec
        [10, 2, 5],  //input
        7,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     tip_2_5.newIOTest('r',  //testClass
        'sum of two smallest % and % and %',  //blockSpec
        [-10, -2, 6],  //input
        -12,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     tip_2_5.newIOTest('r',  //testClass
        'sum of two smallest % and % and %',  //blockSpec
        [0, 0, 0],  //input
        0,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     tip_2_5.newIOTest('r',  //testClass
        'sum of two smallest % and % and %',  //blockSpec
        [100, -1000, 0],  //input
        -1000,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points


     /*Create chunk 3: "Are any equal? % and % and %" predicate block.*/
    var chunk_3 = fb.newChunk('Make the "Are any equal?" block.');

    
    //Make sure you name your block "Are any equal? % and % and %"!
    var anyEqualExists = function() {
        return spriteContainsBlock("Are any equal? % and % and %");
    }

    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "Are any equal? % and % and %".',
        'Great job!');

    tip_3_1.newAssertTest(
        anyEqualExists,
        "Testing if there is an 'Are any equal?' block in the scripting area.",
        "There is an 'Are any equal?' block in the scripting area.",
        "Make sure you name your block exactly 'Are any equal? % and % and %' and place it in the scripting area.",
        1);

    var predicate = function() {
        var customBody = getCustomBody("Are any equal? % and % and %");
        return ((customBlockContains("Are any equal? % and % and %", "report %", ["true"]) && 
            customBlockContains("Are any equal? % and % and %", "report %", ["false"])) || 
            (blockPrecedes("report %", "% or %", customBody))); 
            //assuming they are reporting the OR block --> boolean value
    }

    var tip_3_2 = chunk_3.newTip("Make sure your block is a predicate: it returns true/false values.",
        'Great job!');

    tip_3_2.newAssertTest(
        predicate,
        "Testing to see if the block returns a boolean true/false value.",
        "The block returns a boolean true/false value.",
        "Make sure your block is a predicate: it returns true/false values.", 
        1);

    var usesOr2 = function() {
        return customBlockContains("Are any equal? % and % and %", "% or %");
    }

    var tip_3_3 = chunk_3.newTip("Try using the '% or %' block in your solution!",
        "Great job!");

    tip_3_3.newAssertTest(
        usesOr2,
        "Testing to see that the block uses the OR block in its definition",
        "The block uses the OR block in its definition",
        "Try using the '% or %' block in your solution!",
        1);

    var tip_3_4 = chunk_3.newTip('Make sure your block works for basic inputs.',
        'Great job!');

    tip_3_4.newIOTest('r',  //testClass
        "Are any equal? % and % and %",  //blockSpec
        [2, 3, 4],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

    tip_3_4.newIOTest('r',  //testClass
        "Are any equal? % and % and %",  //blockSpec
        [-2, 0, 2],  //input
        false,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

    tip_3_4.newIOTest('r',  //testClass
        "Are any equal? % and % and %",  //blockSpec
        [6, 3, 6],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

    tip_3_4.newIOTest('r',  //testClass
        "Are any equal? % and % and %",  //blockSpec
        [1, 2, 2],  //input
        true,  //output
        -1,  //timeout
        false,  //isolated
        1);  //points


    return fb;
}