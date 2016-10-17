// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = "U5_L2_P1_T3_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc"; // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U5_L2_P1_T3"; //this should follow the name of the nomenclature document
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, set this to false
var showFeedback = true;
// to allow ability to regrade certain tests, set this to true
var regradeOn = true;

//Proposed tests
//Check if block exists, check if stage coord for x= % is inside block
//Check if go to x exists

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//           Actual Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
    var fb = new FeedbackLog(
        world,
        id,
        'Graphing App' //Name of the particular task you are creating.
    );

    var go_to_scaled_point = "go to scaled point x: % y: %" //for style purposes please change both the string and the variable name i.e var desc = "desc"
    var chunk_1 = fb.newChunk('Complete the "' + go_to_scaled_point + '" block.'); //creates a chunk

    //basic function to check if the block is even in Snap!'s staging area
    var blockExists_1 = function() {
        //if multiple sprites return spriteContainsBlock(blockname, spriteIndex);
        return spriteContainsBlock(go_to_scaled_point);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + go_to_scaled_point + '" and place it in the scripting area.',
        'The "' + go_to_scaled_point + '" block exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the ' + go_to_scaled_point + ' block is in the scripting area.',
        'The ' + go_to_scaled_point + '" block is in the scripting area.',
        'Make sure you name your block exactly ' + go_to_scaled_point + ' and place it in the scripting area.',
        1
    );


    //check if block contains go to block

    var tip_1_2 = chunk_1.newTip(
        'Your block should contain the go to x: % y: % block', //be sure to follow the feedback guide here!
        'Great job! Your block contains the go to x: % y: % block!'
    );

    var block_exists_goto = function() {
        return customBlockContains(go_to_scaled_point, "go to x: % y: %")
    }

    tip_1_2.newAssertTest(
        block_exists_goto,
        'Testing if the ' + go_to_scaled_point + ' contains the go to x: % y: % block.',
        'The ' + go_to_scaled_point + ' has the go to x: % y: % block.',
        'Make sure you have the go to x: % y: % block in your ' + go_to_scaled_point + ' block.',
        1
    );

    //check if contains stage coord x block

    var tip_1_3 = chunk_1.newTip(
        'Your block should contain the stage coord for x= % block', //be sure to follow the feedback guide here!
        'Great job! Your block contains the stage coord for x= % block!'
    );

    var block_exists_stagex = function() {
        return customBlockContains(go_to_scaled_point, "stage coord for x= %")
    }

    tip_1_3.newAssertTest(
        block_exists_stagex,
        'Testing if the ' + go_to_scaled_point + ' contains the stage coord for x= % block.',
        'The ' + go_to_scaled_point + ' has the stage coord for x= % block.',
        'Make sure you have the stage coord for x= % in your ' + go_to_scaled_point + ' block.',
        1
    );

    //check if contains stage coord y blockSpec
    var tip_1_4 = chunk_1.newTip(
        'Your block should contain the stage coord for y= % block', //be sure to follow the feedback guide here!
        'Great job! Your block contains the stage coord for y= % block!'
    );

    var block_exists_stagey = function() {
        return customBlockContains(go_to_scaled_point, "stage coord for y= %");
    }

    tip_1_4.newAssertTest(
        block_exists_stagey,
        'Testing if the ' + go_to_scaled_point + ' contains the stage coord for y= % block.',
        'The ' + go_to_scaled_point + ' has the stage coord for y= % block.',
        'Make sure you have the stage coord for y= % in your ' + go_to_scaled_point + ' block.',
        1
    );

    //Check if plotpoint has go to scaled point block
    var PlotPoint = "PlotPoint x: % y: %";
    var chunk_2 = fb.newChunk('Complete the ' + PlotPoint + ' block with the ' + go_to_scaled_point + ' block.'); //creates a chunk

    var tip_2_1 = chunk_2.newTip(
        'Your block should contain the ' + go_to_scaled_point + ' block.',
        'Great job! Your block contains the ' + go_to_scaled_point + ' block.'
    );

    var block_exists_scaled = function() {
        return customBlockContains(PlotPoint, go_to_scaled_point)
    }

    tip_2_1.newAssertTest(
        block_exists_scaled,
        'Testing if the ' + PlotPoint + ' contains the ' + go_to_scaled_point + ' block.',
        'The ' + PlotPoint + ' has the ' + go_to_scaled_point + ' block.',
        'Make sure you have the ' + go_to_scaled_point + ' block in your ' + PlotPoint + ' block.',
        1
    );

    //Graph datapoints
    var Graph_datapoints = "Graph datapoints %";
    var chunk_3 = fb.newChunk('Complete the ' + Graph_datapoints + ' block.'); //creates a chunk

    var blockExists_graphdatapoints = function() {
        //if multiple sprites return spriteContainsBlock(blockname, spriteIndex);
        return spriteContainsBlock(Graph_datapoints);
    }

    var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly ' + Graph_datapoints + ' and place it in the scripting area.',
        'The ' + Graph_datapoints + ' block exists.');

    //block exists test
    tip_3_1.newAssertTest(
        blockExists_graphdatapoints,
        'Testing if the ' + Graph_datapoints + ' block is in the scripting area.',
        'The ' + Graph_datapoints + '" block is in the scripting area.',
        'Make sure you name your block exactly ' + Graph_datapoints + ' and place it in the scripting area.',
        1
    );

    //check if there's a loop
    var tip_3_2 = chunk_3.newTip('Checking if the block ' + Graph_datapoints + ' has a loop.',
        'The ' + Graph_datapoints + ' block has a loop.');

    var loopExists = function () {
        return customBlockContains(position_of_number_in_sorted_list, "repeat % %" )
        || customBlockContains(position_of_number_in_sorted_list, "for % = % to % %")
        || customBlockContains(position_of_number_in_sorted_list, "repeat until % %")
        || customBlockContains(position_of_number_in_sorted_list, "for each % of % %")
        || customBlockContains(position_of_number_in_sorted_list, "forever %");
    }

    tip_3_2.newAssertTest(
        loopExists,
       "Testing if there is a loop in the body of " + Graph_datapoints,
        "There is a loop in the body of the body of " + Graph_datapoints,
        "Try using a loop in the body of " + Graph_datapoints + " to plot the points.",
        1);

    return fb;

}
