var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W4_L2_T1";
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
        'Dragon Curve'
    );

    var blockName = "Dragon length % n %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_1 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );

    var noIteration_1 = function() {
        return (!customBlockContains(blockName, "forever %c")) && (!customBlockContains(blockName, "for %upvar = %n to %n %cs"))
            && (!customBlockContains(blockName, "repeat until %b %c")) && (!customBlockContains(blockName, "repeat %n %c"))
            && (!customBlockContains(blockName, "for each %upvar of %l %cs"));
    }

    var tip_1_1a = chunk_1.newTip('Make sure you do not use iteration.',
        'The "' + blockName + '" block does not use iteration.');

    tip_1_1a.newAssertTest(
        noIteration_1,
        'Testing to make sure the "' + blockName + '" block does not use iteration.',
        'The "' + blockName + '" block does not use iteration.',
        'Make sure your block "' + blockName + '" does not use iteration. Try using only recursion!',
        1
    );

    return fb;
    
    }