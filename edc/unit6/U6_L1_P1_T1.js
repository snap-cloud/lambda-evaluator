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
var taskID = "_U6_L1_P1_T1"; //this should follow the name of the nomenclature document
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
        'Recursive Tree and the Base Case' //Name of the particular task you are creating.
    );

    var tree1 = "tree 1 size: %"; //for style purposes please change both the string and the variable name i.e var desc = "desc"
    var tree2 = "tree 2 size: %";
    var tree3 = "tree 3 size: %";
    var tree4 = "tree 4 size: %";
    var tree5 = "tree 5 size: %";
    var tree_level_size = "tree level: % size: %";

    //function checks for block existence
    var blockExists = function(block) { 
        //if multiple sprites return spriteContainsBlock(blockname, spriteIndex);
        return spriteContainsBlock(block);
    }

    // Check whether or not it's a reporter
    var blockContains = function(block, contain) {
        return customBlockContains(block, contain); 
    }

    var recursionExists_TreeLevel = function() {
        return customBlockContains(tree_level_size, tree_level_size);
    }

    var recursionExists_Tree2 = function() {
        return customBlockContains(tree2, tree1);
    }

    var recursionExists_Tree3 = function() {
        return customBlockContains(tree3, tree2);
    }

    var recursionExists_Tree4 = function() {
        return customBlockContains(tree4, tree3);
    }

    var recursionExists_Tree5 = function() {
        return customBlockContains(tree5, tree4);
    }

    var baseCaseExists_1 = function() {
        return customBlockContains(tree_level_size, "if %b %c") || customBlockContains(tree_level_size, "if %b %c else %c");
    }

    // tree1 tests
    var chunk_1 = fb.newChunk('Complete the "' + tree1 + '" block.'); //creates a chunk

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + tree1 + '" and place it in the scripting area.',
        'The "' + tree1 + '" block exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        blockExists(tree1),
        'Testing if the "' + tree1 + '" block is in the scripting area.',
        'The "' + tree1 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + tree1 + '" and place it in the scripting area.',
        1
    );

    //Tree2 tests
    var chunk_2 = fb.newChunk('Complete the "' + tree2 + '" block.');

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "' + tree2 + '" and place it in the scripting area.',
    'The "' + tree2 + '" block exists.');

    tip_2_1.newAssertTest(
        blockExists(tree2),
        'Testing if the "' + tree2 + '" block is in the scripting area.',
        'The "' + tree2 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + tree2 + '" and place it in the scripting area.',
        1
    );

    var tip_2_2 = chunk_2.newTip('Make sure your "' + tree2 + '" block contains the "' + tree1 + '" block.',
    'The "' + tree2 + '" block contains the "' + tree1 + '" block.');

    tip_2_2.newAssertTest(
        recursionExists_Tree2,
        'Testing if the "' + tree2 + '" block contains the "' + tree1 + '" block.',
        'The "' + tree2 + '" block contains the "' + tree1 + '" block.',
        'Make sure you name your block exactly "' + tree2 + '" and "' + tree1 + '" block is used inside of it.',
        1
    );

    // Tree3 tests
    var chunk_3 = fb.newChunk('Complete the "' + tree3 + '" block.');

    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "' + tree3 + '" and place it in the scripting area.',
    'The "' + tree2 + '" block exists.');

    tip_3_1.newAssertTest(
        blockExists(tree3),
        'Testing if the "' + tree3 + '" block is in the scripting area.',
        'The "' + tree3 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + tree3 + '" and place it in the scripting area.',
        1
    );

    var tip_3_2 = chunk_3.newTip('Make sure your "' + tree3 + '" block contains the "' + tree2 + '" block.',
    'The "' + tree3 + '" block contains the "' + tree2 + '" block.');

    tip_3_2.newAssertTest(
        recursionExists_Tree3,
        'Testing if the "' + tree3 + '" block contains the "' + tree2 + '" block.',
        'The "' + tree3 + '" block contains the "' + tree2 + '" block.',
        'Make sure you name your block exactly "' + tree3 + '" and "' + tree2 + '" block is used inside of it.',
        1
    );

    //Tree 4 tests

    var chunk_4 = fb.newChunk('Complete the "' + tree4 + '" block.');

    var tip_4_1 = chunk_4.newTip('Make sure you name your block exactly "' + tree4 + '" and place it in the scripting area.',
    'The "' + tree4 + '" block exists.');

    tip_4_1.newAssertTest(
        blockExists(tree4),
        'Testing if the "' + tree4 + '" block is in the scripting area.',
        'The "' + tree4 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + tree4 + '" and place it in the scripting area.',
        1
    );

    var tip_4_2 = chunk_4.newTip('Make sure your "' + tree4 + '" block contains the "' + tree3 + '" block.',
    'The "' + tree4 + '" block contains the "' + tree3 + '" block.');

    tip_4_2.newAssertTest(
        recursionExists_Tree4,
        'Testing if the "' + tree4 + '" block contains the "' + tree3 + '" block.',
        'The "' + tree4 + '" block contains the "' + tree3 + '" block.',
        'Make sure you name your block exactly "' + tree4 + '" and "' + tree3 + '" block is used inside of it.',
        1
    );

    //Tree 5 tests
    var chunk_5 = fb.newChunk('Complete the "' + tree5 + '" block.');

    var tip_5_1 = chunk_5.newTip('Make sure you name your block exactly "' + tree5 + '" and place it in the scripting area.',
    'The "' + tree5 + '" block exists.');

    tip_5_1.newAssertTest(
        blockExists(tree5),
        'Testing if the "' + tree5 + '" block is in the scripting area.',
        'The "' + tree5 + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + tree5 + '" and place it in the scripting area.',
        1
    );

    var tip_5_2 = chunk_5.newTip('Make sure your "' + tree5 + '" block contains the "' + tree4 + '" block.',
    'The "' + tree5 + '" block contains the "' + tree4 + '" block.');

    tip_5_2.newAssertTest(
        recursionExists_Tree5,
        'Testing if the "' + tree5 + '" block contains the "' + tree4 + '" block.',
        'The "' + tree5 + '" block contains the "' + tree4 + '" block.',
        'Make sure you name your block exactly "' + tree5 + '" and "' + tree4 + '" block is used inside of it.',
        1
    );

    var chunk_6 = fb.newChunk('Complete the "' + tree_level_size + '" block.');

    var tip_6_1 = chunk_6.newTip('Make sure you name your block exactly "' + tree_level_size + '" and place it in the scripting area.',
    'The "' + tree_level_size + '" block exists.');

    tip_6_1.newAssertTest(
        blockExists(tree_level_size),
        'Testing if the "' + tree_level_size + '" block is in the scripting area.',
        'The "' + tree_level_size + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + tree_level_size + '" and place it in the scripting area.',
        1
    );

    var tip_6_2 = chunk_6.newTip('Make sure your "' + tree_level_size + '" block contains the "' + tree_level_size + '" block.',
    'The "' + tree_level_size + '" block contains the "' + tree_level_size + '" block.');

    tip_6_2.newAssertTest(
        recursionExists_TreeLevel,
        'Testing if the "' + tree_level_size + '" block contains the "' + tree_level_size + '" block.',
        'The "' + tree_level_size + '" block contains the "' + tree_level_size + '" block.',
        'Make sure you name your block exactly "' + tree_level_size + '" and "' + tree_level_size + '" block is used inside of it.',
        1
    );

    var tip_6_3 = chunk_6.newTip('Make sure you are creating a base case in your block "' + tree_level_size + '".',
        'You are using if and if else to make your base case.')

    tip_6_3.newAssertTest(
        blockExists(tree_level_size),
        'Testing if the "' + tree_level_size + '" block has a base case.',
        'You are using if and if else to make your base case.',
        'Make sure you name your block exactly "' + tree_level_size + '" and use if or if/else to create a base case.',
        1
    );

    return fb;
    
}