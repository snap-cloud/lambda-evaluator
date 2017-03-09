// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U5_L6_LP1_T1"; //this should follow the name of the nomenclature document
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
        'Traffic simulation' //Name of the particular task you are creating.
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

    var spriteSpeeds = "spriteSpeeds" //for style purposes please change both the string and the variable name i.e var desc = "desc"
	var chunk_1 = fb.newChunk('Complete the "' + spriteSpeeds + '" variable.'); //creates a chunk

	//basic function to check if the block is even in Snap!'s staging area
	var spriteSpeedsExists = function () { 
		//if multiple sprites return spriteContainsBlock(blockname, spriteIndex);
		return spriteContainsBlock(spriteSpeeds);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your variable exactly "' + spriteSpeeds + '" and place it in the scripting area.',
        'The "' + spriteSpeeds + '" variable exists.');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        spriteSpeedsExists,
        'Testing if the "' + spriteSpeeds + '" variable is in the scripting area.',
        'The "' + spriteSpeeds + '" variable is in the scripting area.',
        'Make sure you name your variable exactly "' + spriteSpeeds + '" and place it in the scripting area.',
        1
    );

    var speedLimit = "speedLimit"
    var chunk_2 = fb.newChunk('Complete the "' + speedLimit + '" variable.');

    var speedLimitExists = function () {
        return spriteContainsBlock(speedLimit);
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your variable exactly "' + speedLimit + '" and place it in the scripting area.',
        'The "' + speedLimit + '" variable exists.');

    tip_2_1.newAssertTest(
        speedLimitExists,
        'Testing if the "' + speedLimit + '" variable is in the scripting area.',
        'The "' + speedLimit + '" variable is in the scripting area.',
        'Make sure you name your variable exactly "' + speedLimit + '" and place it in the scripting area.',
        1
    );


    return fb;
    
}