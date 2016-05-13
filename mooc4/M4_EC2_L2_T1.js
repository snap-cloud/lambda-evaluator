var starter_path = "M4_EC2_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_EC2_L2_T1";
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
        'Descendants'
    );


    var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Descendants") {
            spriteIndex = i;
            break;
        }
    }
  var desc = "me and my descendants %";
  var blockName = desc;

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/

    var chunk_1 = fb.newChunk('Complete the "' + desc + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(desc, spriteIndex);
    }

    var noIteration_1 = function() {
        return (!customBlockContains(blockName, "forever %c", spriteIndex)) && (!customBlockContains(blockName, "for %upvar = %n to %n %cs", spriteIndex))
            && (!customBlockContains(blockName, "repeat until %b %c", spriteIndex)) && (!customBlockContains(blockName, "repeat %n %c", spriteIndex))
            && (!customBlockContains(blockName, "for each %upvar of %l %cs", spriteIndex));
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + desc + '" and place it in the scripting area.',
        'The "' + desc + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + desc + '" block is in the scripting area.',
        'The "' + desc + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + desc + '" and place it in the scripting area.',
        1
    );

     var tip_1_1a = chunk_1.newTip('Make sure you do not use iteration.',
        'The "' + desc + '" block does not use iteration.');

    tip_1_1a.newAssertTest(
        noIteration_1,
        'Testing to make sure the "' + desc + '" block does not use iteration.',
        'The "' + desc + '" block does not use iteration.',
        'Make sure your block "' + desc + '" does not use iteration. Try using only recursion!',
        1
    );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = ["k"];
    tip_1_2.newIOTest('r',  // testClass
        desc,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["k", "n", "o"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
                actual += "";
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

    var input_1_2_2 = ["l"];
    tip_1_2.newIOTest('r',  // testClass
        desc,          // blockSpec
        input_1_2_2,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["l"];
            if (output instanceof List) {
                actual = output.asArray();
            } else {
                actual = output;
                actual += "";
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


    return fb;
    
    }