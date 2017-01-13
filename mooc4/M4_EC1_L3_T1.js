var starter_path = null;
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_EC1_L3_T1";
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
        'Pair Up'
    );

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/
    // var spriteIndex;
    // var ide = world.children[0];
    // var sprites = ide.sprites.contents;
    // for (var i = 0; i < sprites.length; i++) {
    //     if (sprites[i].name === "Hanoi") {
    //         spriteIndex = i;
    //         break;
    //     }
    // }
  var menu = "menu %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_1 = fb.newChunk('Complete the "' + menu + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(menu);
    }


    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + menu + '" and place it in the scripting area.',
        'The "' + menu + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + menu + '" block is in the scripting area.',
        'The "' + menu + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + menu + '" and place it in the scripting area.',
        1
    );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [[ ["scoop", "dollop"], [" of ice cream", " of froyo"], [" with rainbow sprinkles", " with fudge"]]];
    tip_1_2.newIOTest('r',  // testClass
        menu,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["scoop of ice cream with rainbow sprinkles", "scoop of ice cream with fudge", "scoop of froyo with rainbow sprinkles", "scoop of froyo with fudge",
            "dollop of ice cream with rainbow sprinkles", "dollop of ice cream with fudge", "dollop of froyo with rainbow sprinkles", "dollop of froyo with fudge"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
            }
            for (i = 0; i < actual.length; i++)
            {
                actual[i] = actual[i] + ""; //turns into strings
            }
            if (!_.isEqual(actual, expected)) {
                tip_1_2.suggestion = 'The output should be ' + expected + ';';
                tip_1_2.suggestion += ' but was ' + actual + '.';
                return false;
            }
            return true;
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    // var input_1_2_2 = [["sub", "way", "side", "swipe"]];
    // tip_1_2.newIOTest('r',  // testClass
    //     menu,          // blockSpec
    //     input_1_2_2,        // input
    //     function (output) {
    //         // Output should be a list of numbers.
    //         var expected,
    //             actual;
    //         console.log(output);

    //         expected = ["subway", "wayside", "sideswipe"];
    //         if (output instanceof List) {
    //             actual = output.asArray();
    //         } else {
    //             actual = output;
    //             actual += "";
    //         }
    //         for (i = 0; i < actual.length; i++)
    //         {
    //             actual[i] = actual[i] + ""; //turns into strings
    //         }
    //         if (!_.isEqual(actual, expected)) {
    //             tip_1_2.suggestion = 'The output should be ' + expected + ';';
    //             tip_1_2.suggestion += ' but was ' + actual + '.';
    //             return false;
    //         }
    //         return true;
    //     },
    //     4 * 1000, // 4 second time out.
    //     true, // is isolated
    //     1 // points
    // );



    return fb;
    
    }