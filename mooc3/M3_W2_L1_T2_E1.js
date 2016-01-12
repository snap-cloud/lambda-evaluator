var starter_path = 'spam-ham-starter.xml';
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.3x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M3_W2_L1_T2_E1";
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
        'The Data'
    );

    var blockName = "number of % in the dataset %";
    var chunk_1 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "'+ blockName + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        "Testing if the '" + blockName + "' block is in the scripting area.",
        "The '" + blockName + "' block is in the scripting area.",
        "Make sure you name your block exactly '" + blockName + "' and place it in the scripting area.",
        1
    );

    // var containsLoopOrHOF_1 = function () {
    //     return customBlockContains(blockName, "repeat %n %c") ||
    //         customBlockContains(blockName, "for %upvar = %n to %n %cs") ||
    //         customBlockContains(blockName, "repeat until %b %c") ||
    //         customBlockContains(blockName, "for each %upvar of %l %cs") ||
    //         customBlockContains(blockName, "keep items such that % from %") ||
    //         customBlockContains(blockName, "combine with % items of %") ||
    //         customBlockContains(blockName, "map % over %");
    // }

    // var tip_1_2 = chunk_1.newTip(
    //     'Your block should use a loop or a higher order function in its body.',
    //     'Great job! Your block uses a loop or a higher order function in its body.'
    // );

    // tip_1_2.newAssertTest(
    //     containsLoopOrHOF_1,
    //     "Testing if the '" + blockName + "' block uses a loop or a higher order function in its body.",
    //     "The '" + blockName + "' block uses a loop or a higher order function in its body.",
    //     "Make sure your block uses a loop or a higher order function in its body.",
    //     1);

    // var tip_1_3 = chunk_1.newTip(
    //     'Your block should output the correct number of HAM or SPAM messages in the datasheet.',
    //     'Great job! Your block outputs the correct number of HAM or SPAM messages in the datasheet.'
    // );
    
    // tip_1_3.newIOTest('r',  // testClass
    //     blockName,          // blockSpec
    //     ["HAM", [["HAM", "Hey how are you"], ["SPAM", "Alaska Airlines Flight VR8 500"], ["HAM", "See you soon!"]]],        // input
    //     // function (output) {
    //     //     // Output should be a number.
    //     //     var expectedCount, count;

    //     //     expectedCount = 2;
    //     //     count = output;
    //     //     if (expectedCount !== count) {
    //     //         tip_1_3.suggestion = 'The number of HAM messages should be ' + expectedCount + ";";
    //     //         tip_1_3.suggestion += ' but was ' + count + '.';
    //     //         return false;
    //     //     }
    //     //     return true;
    //     // },
    //     2, //expected output
    //     1000, // 1 second time out.
    //     true, // is isolated
    //     1 // points
    // );

    return fb;
}
