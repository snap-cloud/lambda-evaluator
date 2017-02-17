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
var taskID = "U1_L2_T2"; //this should follow the name of the nomenclature document
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
        'Triangle Fractal' //Name of the particular task you are creating.
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
    var triangleFractalExists = function() {
        if (findBlockInPalette("triangle fractal level: % size: %" !== null)) {
            return true;
        } else {
            return false;
        }
    };

    //TRIANGLE SIZE EXISTENCE AG TEST
    var triangle_fractal = "triangle fractal";

    var chunk_2 = fb.newChunk('Create the ' + triangle_fractal + ' block.');

    var tip_2_1 = chunk_2.newTip('Make sure you create the ' + triangle_fractal + ' block with the listed inputs.', 'Nice job!');

    tip_2_1.newAssertTest(
        triangleFractalExists, 
        'Testing if ' + triangle_fractal + ' exists.',
        triangle_fractal + ' exists.', 
        triangle_fractal + ' does not exist.',
        1
    );

    return fb;

}
