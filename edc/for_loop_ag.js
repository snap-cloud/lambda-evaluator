// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = "_M1_W1_L3_T3.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M1_W1_L3_T3"; //this should follow the name of the nomenclature document
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
        'The For Block' //Name of the particular task you are creating.
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

    var forScriptExists = function() {
        return scriptPresentInSprite('[{"blockSp":"for %i = %n to %n", "inputs":["i", "0", "30"]}, {"blockSp": "if %b", "inputs": [{"blockSp": "%n = %n", inputs[{blockSp: "%n mod %n", inputs["i", "2"]}, "0"]}]}, {"blockSp": "say %b for %n secs", "inputs": ["i", "2"]}]');
    }

    var for_block = "for"; //for style purposes please change both the string and the variable name i.e var desc = "desc"
	var chunk_1 = fb.newChunk('Complete the "' + for_block + '" block.'); //creates a chunk

    var tip_1_1 = chunk_1.newTip('Look at the example above and think about what function would allow you to check if i is even',
        'Great job on the script!');

    //an assert test takes a function and returns true if the function returns true
    tip_1_1.newAssertTest(
        forScriptExists,
        'Testing for exact script matching.',
        'All of the blocks are in order and have correct inputs.',
        'Make sure you have all of the correct inputs and the blocks are in the correct order.',
        1
    );

    var squiralTest = function() {
                return scriptPresentInSprite('[{"blockSp":"pen down","inputs":[]},{"blockSp":"for %upvar = %n to %n %cs","inputs":["1","100",[{"blockSp":"move %n steps","inputs":[{"blockSp":"%n × %n","inputs":["2","length"]}]},{"blockSp":"turn %clockwise %n degrees","inputs":["90"]}]]}]');
    }

    var squiral_block = "squiral block";
    var chunk_2 = fb.newChunk('Complete the "' + squiral_block + '" block.');

    var tip_2_1 = chunk_2.newTip('Look at the example script. Did you copy everything correctly?', 'Great job on the script!');

    tip_2_1.newAssertTest(
        squiralTest,
        "Testing if script from exercise 2 is present.",
        "The squiral script from exercise 2 is present.",
        "Double check the image from exercise 2 to make sure it matches exactly! Make sure the inputs are correct and also make sure the blocks are in the exact order as well!",
        1
    );

    var noteTest = function() {
        return scriptPresentInSprite('[{"blockSp":"when %arrow key pressed","inputs":["up arrow"]}, {"blockSp":"for %i = %n to %n","inputs":["i", "84", "60"]}, {"blockSp":"say %i","inputs":["i"]}, {"blockSp":"play note %i for %n beats","inputs":["i", "0.2"]}]');
    }

    var note_block = "note block";
    var chunk_3 = fb.newChunk('Complete the "' + note_block + '" block.');

    var tip_3_1 = chunk_3.newTip('Look at the example in exercise 9. How would you modify it to count down instead of up?', 'Great job on the script!');

    tip_3_1.newAssertTest(
        noteTest,
        "Testing if script from exercise 10 is present and correct.",
        "The script for exercise 10 is present and correct.",
        "Check your work, and use exerise 9 to help you.",
        1
    );

    return fb;  
}