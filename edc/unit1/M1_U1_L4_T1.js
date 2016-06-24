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
var taskID = "_M1_U1_L4_T1"; //this should follow the name of the nomenclature document
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
        'Draw Square' //Name of the particular task you are creating.
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


    //check if input exists in triangle
    var drawSquareHasInput = function() {
        if (findBlockInPalette("draw square %") !== null) {
            return true;
        } else {
            return false;
        }
    };

    //DRAW SQUARE AG TEST
    var draw_square = "draw square %"; //for style purposes please change both the string and the variable name i.e var desc = "desc

    var chunk_1 = fb.newChunk('Add an input to ' + draw_square); //creates a chunk

    var tip_1_1 = chunk_1.newTip('Make sure you add an input to the signature of your ' + draw_square + ' block.', 'Great job!');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        drawSquareHasInput,
        'Testing if ' + draw_square + ' has an input in its signature.',
        draw_square + ' has an input.',
        draw_square + ' does not have an input in its signature.',
        1
    );

    return fb;

}
