var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "edc";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_U2_W1_L1_T6_E_all";
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, change this flag to false
var showFeedback = true;
// to allow for the ability to regrade certain tests, change this flag to true
var regradeOn = false;
// Add tests to the outputLog. Function is called by runAGTest(id, outputLog)
// var testLog;
function AGTest(outputLog) {

    //NOTES TO YIFAT AND PATRICK:
    // No IO tests should be isolated. Which means that you have to check that the block
    // is on screen.
    // All getter/setter functions inside anonymous Assert functions.
    // Thanks for all your work :D

    var pluralExists = function() {
        return spriteContainsBlock("plural %");
    }

    var fb = new FeedbackLog(null, id, 'this is a feedback log test', 0);
    fb.snapWorld = world;

    // Create a first test chunk
    var first_chunk = fb.newChunk('Make the plural block.');
    // Add a first tip to that first test chunk
    var first_tip = first_chunk.newTip('Make sure you name your block exactly "plural %".',
        'Great job!');

    var ass_test1 = first_tip.newAssertTest(
        pluralExists,
        "Testing if there is a 'plural %' block in the scripting area.",
        "There is a 'plural %' block in the scripting area.",
        "Make sure you name your block exactly 'plural %'.",
        1);

    var second_tip = first_chunk.newTip('Make sure your block works on basic inputs.',
        'Great job!');

     second_tip.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["cat"],  //input
        "cats",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     second_tip.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["day"],  //input
        "days",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     var third_tip = first_chunk.newTip('Make sure your block works when the singular word ends in "s".',
        'Great job!');

     third_tip.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["boss"],  //input
        "bosses",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     third_tip.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["dress"],  //input
        "dresses",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     var fourth_tip = first_chunk.newTip('Make sure your block works when the singular word ends in "x".',
        'Great job!');

     fourth_tip.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["fox"],  //input
        "foxes",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     fourth_tip.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["box"],  //input
        "boxes",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points



     var second_tip2 = first_chunk.newTip('Make sure your block works when the singular word ends in "th".',
                'Great job!');

     second_tip2.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["moth"],  //input
        "moths",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     second_tip2.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["sloth"],  //input
        "sloths",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     var third_tip2 = first_chunk.newTip('Make sure your block works when the singular word ends in "tch".',
        'Great job!');

     third_tip2.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["match"],  //input
        "matches",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     third_tip2.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["crutch"],  //input
        "crutches",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     var fourth_tip2 = first_chunk.newTip('Make sure your block works when the singular word ends in "sh".',
        'Great job!');

     fourth_tip2.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["dish"],  //input
        "dishes",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     fourth_tip2.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["wish"],  //input
        "wishes",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

    var second_tip4 = first_chunk.newTip('Make sure your block works when the second-to-last letter is a vowel.',
                'Great job!');

     second_tip4.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["tray"],  //input
        "trays",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     second_tip4.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["boy"],  //input
        "boys",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     var third_tip4 = first_chunk.newTip('Make sure your block works when the second-to-last letter is a consonant.',
        'Great job!');

     third_tip4.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["sky"],  //input
        "skies",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points

     third_tip4.newIOTest('r',  //testClass
        'plural %',  //blockSpec
        ["try"],  //input
        "tries",  //output
        -1,  //timeout
        false,  //isolated
        1);  //points







    return fb;
}