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
var taskID = "_U5_L2_P3_T1"; //this should follow the name of the nomenclature document
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
        'Graphing Functions' //Name of the particular task you are creating.
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

    var graph_function = "Graph function %" //for style purposes please change both the string and the variable name i.e var desc = "desc"
	var chunk_1 = fb.newChunk('Complete the "' + graph_function + '" block.'); //creates a chunk

	//basic function to check if the block is even in Snap!'s staging area
	var blockExists = function () { 
		//if multiple sprites return spriteContainsBlock(blockname, spriteIndex);
		return spriteContainsBlock(graph_function);
    }

    var PPexists = function() {
        return customBlockContains(graph_function, "PlotPoint x: % y: %");
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + graph_function + '" and place it in the scripting area.',
        'The "' + graph_function + '" block exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        blockExists,
        'Testing if the "' + graph_function + '" block is in the scripting area.',
        'The "' + graph_function + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + graph_function + '" and place it in the scripting area.',
        1
    );

    //INPUT TEST CASE

    var tip_1_2 = chunk_1.newTip(
        'Your block should use PlotPoint x: % y: % to plot the points.', //be sure to follow the feedback guide here!
        'Great job! It uses PlotPoint x: % y: % !'
    );

   tip_1_2.newAssertTest(
        PPexists,
        'Testing if the "' + graph_function + '" has the PlotPoint x: % y: % block.',
        'The "' + graph_function + '" block contains the PlotPoint block.',
        'Make sure you name your block exactly "' + graph_function + '" put PlotPoint x: % y: % in it.',
        1);

    return fb;
    
}