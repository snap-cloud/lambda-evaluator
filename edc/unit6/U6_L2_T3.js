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
var taskID = "U1_L2_T3"; //this should follow the name of the nomenclature document
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
        'Koch curve' //Name of the particular task you are creating.
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

    // check if the "triangle size:" block even exists
    var kochCurveExists = function() {
        if (findBlockInPalette("Koch curve level: % size: %" !== null)) {
            return true;
        } else {
            return false;
        }
    };

    //TRIANGLE SIZE EXISTENCE AG TEST
    var koch_curve = "Koch curve";

    var chunk_1 = fb.newChunk('Create the ' + koch_curve + ' block.');

    var tip_1_1 = chunk_2.newTip('Make sure you create the ' + koch_curve + ' block with the listed inputs.', 'Nice job!');

    tip_1_1.newAssertTest(
        kochCurveExists, 
        'Testing if ' + koch_curve + ' exists.',
        koch_curve + ' exists.', 
        koch_curve + ' does not exist.',
        1
    );

    return fb;

}
