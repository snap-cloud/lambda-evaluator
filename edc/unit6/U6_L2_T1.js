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
var taskID = "U1_L2_T1"; //this should follow the name of the nomenclature document
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
        'Triangle Size' //Name of the particular task you are creating.
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
    var triangleSizeExists = function() {
        if (findBlockInPalette("triangle size:") !== null || findBlockInPalette("triangle size: %") !== null) {
            return true;
        } else {
            return false;
        }
    };


    //check if input exists in "triangle size:"
    var triangleSizeHasInput = function() {
        if (findBlockInPalette("triangle size: %") !== null) {
            return true;
        } else {
            return false;
        }
    };

    //TRIANGLE SIZE EXISTENCE AG TEST
    var basic_triangle_size = "triangle size:";

    var chunk_2 = fb.newChunk('Create the ' + basic_triangle_size + ' block.');

    var tip_2_1 = chunk_2.newTip('Make sure you create the ' + basic_triangle_size + ' block.', 'Nice job!');

    tip_2_1.newAssertTest(
        triangleSizeExists, 
        'Testing if ' + basic_triangle_size + ' exists.',
        basic_triangle_size + ' exists.', 
        basic_triangle_size + ' does not exist.',
        1
    );

    //TRIANGLE SIZE INPUT AG TEST
    var triangle_size = "triangle size: %"; //for style purposes please change both the string and the variable name i.e var desc = "desc

    var chunk_1 = fb.newChunk('Add an input to ' + triangle_size); //creates a chunk

    var tip_1_1 = chunk_1.newTip('Make sure you add an input to the signature of your ' + triangle_size + ' block.', 'Great job!');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        triangleSizeHasInput,
        'Testing if ' + triangle_size + ' has an input in its signature.',
        triangle_size + ' has an input.',
        triangle_size + ' does not have an input in its signature.',
        1
    );

    return fb;

}
