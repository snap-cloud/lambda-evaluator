// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = "null";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U5_L2_P2_T1"; //this should follow the name of the nomenclature document
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, set this to false
var showFeedback = true;
// to allow ability to regrade certain tests, set this to true
var regradeOn = true;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//           Actual Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
    var fb = new FeedbackLog(
        world,
        id,
        'Improving Your Grapher' //Name of the particular task you are creating.
    );

    //Standard code to find the SpriteIndex (read documentation if you're unclear why you need this)
    // var spriteIndex;
    // var ide = world.children[0];
    // var sprites = ide.sprites.contents;
    // for (var i = 0; i < sprites.length; i++) {
    //     if (sprites[i].name === "NameOfSprite") {
    //         spriteIndex = i;
    //         break;
    //     }
    // }

    var ages = "ages"; //for style purposes please change both the string and the variable name i.e var desc = "desc"
    var heights = "heights";
    var weights = "weights";
    var average = "average %";
    var female_data = "female_data";
    var male_data = "male_data";

    //function checks for block existence
    var blockExists = function(block) { 
        //if multiple sprites return spriteContainsBlock(blockname, spriteIndex);
        return spriteContainsBlock(block);
    }

    // Check whether or not it's a reporter
    var isReporter = function(block) {
        return blockType(block) === "reporter";
    }

    //Check for keep items such that..
    var keepExists = function(block) {
        return customBlockContains(block, "keep items such that % from %");
    }

    // ages tests
	var chunk_1 = fb.newChunk('Complete the "' + ages + '" block.'); //creates a chunk

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + ages + '" and place it in the scripting area.',
        'The "' + age + '" block exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        blockExists(ages),
        'Testing if the "' + ages + '" block is in the scripting area.',
        'The "' + ages + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + ages + '" and place it in the scripting area.',
        1
    );

    var tip_1_2 = chunk_1.newTip('Make sure your block "' + ages + '" is a reporter.',
        'The "' + age + '" block is a reporter.')

    tip_1_2.newAssertTest(
        isReporter(ages),
        'Testing if the "' + ages + '" block is a reporter.',
        'The "' + ages + '" block is a reporter.',
        'Make sure you name your block exactly "' + ages + '" and is a reporter.',
        1
    );

    // heights tests
    var chunk_2 = fb.newChunk('Complete the "' + heights + '" block.');

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + heights + '" and place it in the scripting area.',
    'The "' + heights + '" block exists.');

    tip_2_1.newAssertTest(
        blockExists(heights),
        'Testing if the "' + heights + '" block is in the scripting area.',
        'The "' + heights + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + heights + '" and place it in the scripting area.',
        1
    );

    var tip_2_2 = chunk_2.newTip('Make sure your block "' + heights + '" is a reporter.',
        'The "' + heights + '" block is a reporter.')

    tip_2_2.newAssertTest(
        isReporter(heights),
        'Testing if the "' + heights + '" block is a reporter.',
        'The "' + heights + '" block is a reporter.',
        'Make sure you name your block exactly "' + heights + '" and is a reporter.',
        1
    );

    //weights test

    var chunk_3 = fb.newChunk('Complete the "' + weights + '" block.');

    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "' + weights + '" and place it in the scripting area.',
    'The "' + weights + '" block exists.');

    tip_3_1.newAssertTest(
        blockExists(weights),
        'Testing if the "' + weights + '" block is in the scripting area.',
        'The "' + weights + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + weights + '" and place it in the scripting area.',
        1
    );

    var tip_3_2 = chunk_3.newTip('Make sure your block "' + weights + '" is a reporter.',
        'The "' + weights + '" block is a reporter.')

    tip_3_2.newAssertTest(
        isReporter(weights),
        'Testing if the "' + weights + '" block is a reporter.',
        'The "' + weights + '" block is a reporter.',
        'Make sure you name your block exactly "' + weights + '" and is a reporter.',
        1
    );

    //average block
    var chunk_4 = fb.newChunk('Complete the "' + average + '" block.');

    var tip_4_1 = chunk_4.newTip('Make sure you name your block exactly "' + average + '" and place it in the scripting area.',
    'The "' + average + '" block exists.');

    tip_4_1.newAssertTest(
        blockExists(average),
        'Testing if the "' + average + '" block is in the scripting area.',
        'The "' + average + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + average + '" and place it in the scripting area.',
        1
    );

    var tip_4_2 = chunk_4.newTip('Make sure your block "' + average + '" is a reporter.',
        'The "' + average + '" block is a reporter.')

    tip_4_2.newAssertTest(
        isReporter(average),
        'Testing if the "' + average + '" block is a reporter',
        'The "' + average + '" block is a reporter.',
        'Make sure you name your block exactly "' + average + '" and is a reporter.',
        1
    );

    var tip_4_3 = chunk_4.newTip("Make sure your " + average + " block works for general cases",
        "Great job!");

        // all io tests
    tip_4_3.newIOTest('r',
        average,
        [[1, 2, 3, 4, 5]],
        3,
        -1, 
        true,
        1);

    tip_4_3.newIOTest('r',
        average,
        [[2, 2, 2, 2, 2]],
        2,
        -1,
        true,
        1);

    tip_4_3.newIOTest('r', 
        average,
        [[0]],
        0,
        -1,
        true,
        1);

    var chunk_5 = fb.newChunk('Complete the "' + female_data + '" block.');

    var tip_5_1 = chunk_5.newTip('Make sure you name your block exactly "' + female_data + '" and place it in the scripting area.',
    'The "' + female_data + '" block exists.');

    tip_5_1.newAssertTest(
        blockExists(female_data),
        'Testing if the "' + female_data + '" block is in the scripting area.',
        'The "' + female_data + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + female_data + '" and place it in the scripting area.',
        1
    );

    var tip_5_2 = chunk_5.newTip('Make sure your block "' + female_data + '" uses the keep items such that % from %',
        'The "' + female_data + '" block uses keep.')

    tip_5_2.newAssertTest(
        keepExists(female_data),
        'Testing if the "' + female_data + 'uses keep items such that % from %',
        'The "' + female_data + '" block uses keep.',
        'Make sure you name your block exactly "' + female_data + '" and use keep items such that % from %.',
        1
    );

    var chunk_6 = fb.newChunk('Complete the "' + male_data + '" block.');

    var tip_6_1 = chunk_6.newTip('Make sure you name your block exactly "' + male_data + '" and place it in the scripting area.',
    'The "' + male_data + '" block exists.');

    tip_6_1.newAssertTest(
        blockExists(male_data),
        'Testing if the "' + male_data + '" block is in the scripting area.',
        'The "' + male_data + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + male_data + '" and place it in the scripting area.',
        1
    );

    var tip_6_2 = chunk_6.newTip('Make sure your block "' + male_data + '" uses the keep items such that % from %',
        'The "' + male_data + '" block uses keep.')

    tip_6_2.newAssertTest(
        keepExists(male_data),
        'Testing if the "' + male_data + 'uses keep items such that % from %',
        'The "' + male_data + '" block uses keep.',
        'Make sure you name your block exactly "' + male_data + '" and use keep items such that % from %.',
        1
    );


    return fb;
    
}