// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.2x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U5_L1_P2_T3";
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//           Actual Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
    var fb = new FeedbackLog(
        world,
        id,
        'Searching Unsorted and Sorted Data' //Name of the particular task you are creating.
    );

    //setting block names and chunks for the unsorted and sorted
    var position_of_number_in_unsorted_list = "position of number % in unsorted list %" //unsorted list

    var position_of_number_in_sorted_list = "position of number % in sorted list %" // sorted list

    var chunk_1 = fb.newChunk('Complete the "' + position_of_number_in_unsorted_list + '" block.'); //sorted

    var chunk_2 = fb.newChunk('Complete the "' + position_of_number_in_sorted_list + '" block.'); //unsorted

	//Check if length of is in custom block
	var lengthExists_1 = function () {
		return customBlockContains(position_of_number_in_sorted_list, "length of %");
    }

    var tip_1_2 = chunk_2.newTip('For the sorted list, try comparing your "needle" against the middle element of the list',
        'Great job!');

    tip_1_2.newAssertTest(
        lengthExists_1,
        "Testing if there is a length of % block in the body of " + position_of_number_in_sorted_list,
        "There is a length of % block in the body of the body of " + position_of_number_in_sorted_list,
        "Try using the length of % block in the body of " + position_of_number_in_sorted_list,
        1);

    var tip_1_3 = chunk_2.newTip('Try using the "round % %" block to avoid errors when splitting odd-length lists.',
        'Great job!');

    var roundExists_1 = function () {
        return customBlockContains(position_of_number_in_sorted_list, "round %")
            || customBlockContains(position_of_number_in_sorted_list, "round %", undefined, 1)
            || customBlockContains(position_of_number_in_sorted_list, "round %", undefined, 2);
    }

    tip_1_3.newAssertTest(
        roundExists_1,
       "Testing if there is a round % block in the body of " + position_of_number_in_sorted_list,
        "There is a round % block in the body of the body of " + position_of_number_in_sorted_list,
        "Try using the round % block in the body of " + position_of_number_in_sorted_list + " to split odd-length lists.",
        1);

    var tip_1_4 = chunk_2.newTip('Try using a loop.',
        'Great job!');

    var loopExists_1 = function () {
        return customBlockContains(position_of_number_in_sorted_list, "repeat % %" )
        || customBlockContains(position_of_number_in_sorted_list, "for % = % to % %")
        || customBlockContains(position_of_number_in_sorted_list, "repeat until % %")
        || customBlockContains(position_of_number_in_sorted_list, "for each % of % %")
        || customBlockContains(position_of_number_in_sorted_list, "forever %");
    }


    tip_1_4.newAssertTest(
        loopExists_1,
       "Testing if there is a loop in the body of " + position_of_number_in_sorted_list,
        "There is a loop in the body of the body of " + position_of_number_in_sorted_list,
        "Try using a loop in the body of " + position_of_number_in_sorted_list + " to go through a sequence of halved lists.",
        1);

    var tip_1_5 = chunk_1.newTip("Make sure your " + position_of_number_in_unsorted_list + " works for general cases.",
        'Great job!');

    tip_1_5.newIOTest('r',  //testClass
        position_of_number_in_unsorted_list,  //blockSpec
        [17, [12, 13, 14, 10, 18, 11, 17, 15, 16]],  //input
        7,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    tip_1_5.newIOTest('r',  //testClass
        position_of_number_in_unsorted_list,  //blockSpec
        [1, [10, 10, 10, 10, 10, 10, 10, 10, 10]],  //input
        0,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    tip_1_5.newIOTest('r',  //testClass
        position_of_number_in_unsorted_list,  //blockSpec
        [-5, [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5]],  //input
        11,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    var tip_1_6 = chunk_1.newTip("Make sure your " + position_of_number_in_unsorted_list + " works for edge cases.",
        'Great job!');

    tip_1_6.newIOTest('r',  //testClass
        position_of_number_in_unsorted_list,  //blockSpec
        [1, []],  //input
        -,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

   /////////sorted
    var tip_1_7 = chunk_2.newTip("Make sure your " + position_of_number_in_sorted_list + " works for general cases.",
        'Great job!');

    tip_1_7.newIOTest('r',  //testClass
        position_of_number_in_sorted_list,  //blockSpec
        [17, [12, 13, 14, 15, 17, 18, 20]],  //input
        5,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    tip_1_7.newIOTest('r',  //testClass
        position_of_number_in_sorted_list,  //blockSpec
        [1, [10, 10, 10, 10, 10, 10, 10, 10, 10]],  //input
        0,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    tip_1_7.newIOTest('r',  //testClass
        position_of_number_in_sorted_list,  //blockSpec
        [5, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]],  //input
        11,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    var tip_1_8 = chunk_2.newTip("Make sure your " + position_of_number_in_sorted_list + " works for edge cases.",
        'Great job!');

    tip_1_8.newIOTest('r',  //testClass
        position_of_number_in_sorted_list,  //blockSpec
        [1, []],  //input
        0,  //output
        -1,  //timeout
        true,  //isolated
        1);  //points

    return fb;

}
