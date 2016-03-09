// CS10 Merge Sort Test.

var starter_path = 'tic_tac_toe.xml';
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "CS10_SP16";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_tic_tac_toe";
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
        'Complete the tic tac toe blocks.'
    );

    var tttBlock = "ttt % %";
    var blockImg = AG_UTIL.HTMLFormattedBlock(tttBlock);
    var chunk_1 = fb.newChunk('Complete the ' + blockImg + ' block.');

    var tip_1_1 = chunk_1.newTip(
        blockImg + ' should return 1 as the first open space.',
        'Great job! Your ttt function can handle simple inputs.'
    );
    
    tip_1_1.newIOTest('r',  // testClass
        tttBlock,          // blockSpec
        [ ['1', 'x', 'o', 'x', 'o', 'x', 'x', 'o', 'o'], 'x' ], // input
        1,
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var tip_1_2 = chunk_1.newTip(
        blockImg + ' should return 5 as the first open space.',
        'Great job! Your ' + blockImg + ' handles multiple empty spaces.'
    );
    
    tip_1_2.newIOTest('r',  // testClass
        tttBlock,          // blockSpec
        [ ['o', 'x', '3', 'x', '5', 'x', 'x', '6', 'o'] , 'o' ],      // input
        5,
        4 * 1000, // 4 second time out.
        true, // is isolated
        5 // points
    );
    return fb;
}