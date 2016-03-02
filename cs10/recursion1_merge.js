// CS10 Merge Sort Test.

var starter_path = 'recursive_reporters_merge_sort.xml';
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "CS10_SP16";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_recur_reporters_i_merge";
var id = courseID + taskID;
var isEDX = false;
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
        'Complete the merge sort function.'
    );

    var blockName = "merge % %";
    
    var blockImg = AG_UTIL.HTMLFormattedBlock(blockName);
    var chunk_1 = fb.newChunk('Complete the ' + blockImg + ' block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_1_1 = chunk_1.newTip(
        'Make sure you name your block exactly ' + blockImg + ' and place it in the scripting area.',
        'Found the ' + blockImg + ' block in the scripting area.'
    );

    tip_1_1.newAssertTest(
        blockExists_1,
        "Testing if the " + blockImg + " block is in the scripting area.",
        "The " + blockImg + " block is in the scripting area.",
        "Make sure you name your block exactly " + blockImg + " and place it in the scripting area.",
        0
    );

    var tip_1_2 = chunk_1.newTip(
        'Here are some tests to see if your block works.',
        'Great job! You correct merge two lists.'
    );
    
    tip_1_2.newIOTest('r',  // testClass
        blockName,          // blockSpec
        [ [2] , [1] ],      // input
        [1, 2],
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    return fb;
}