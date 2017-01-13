var starter_path = "HanoiTemplate.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W4_L3_T1";
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
        'Towers of Hanoi'
    );

    var blockName = "Hanoi move % pieces from % to % with spare %";

    /*var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {

    }*/
    var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "Hanoi") {
            spriteIndex = i;
            break;
        }
    }
    var chunk_1 = fb.newChunk('Complete the "' + blockName + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(blockName, spriteIndex);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        'The "' + blockName + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + blockName + '" block is in the scripting area.',
        'The "' + blockName + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + blockName + '" and place it in the scripting area.',
        1
    );

    var noIteration_1 = function() {
        return (!customBlockContains(blockName, "forever %c")) && (!customBlockContains(blockName, "for %upvar = %n to %n %cs"))
            && (!customBlockContains(blockName, "repeat until %b %c")) && (!customBlockContains(blockName, "repeat %n %c"))
            && (!customBlockContains(blockName, "for each %upvar of %l %cs"));
    }

    var tip_1_1a = chunk_1.newTip('Make sure you use recursion.',
        'The "' + blockName + '" block does not use iteration and uses recursion instead!');

    tip_1_1a.newAssertTest(
        noIteration_1,
        'Testing to make sure the "' + blockName + '" block does not use iteration.',
        'The "' + blockName + '" block does not use iteration.',
        'Make sure your block "' + blockName + '" does not use iteration. Try using only recursion!',
        1
    );

     var recursion_1 = function() {
        if (spriteContainsBlock(blockName, spriteIndex)) {
           return (customBlockContains(blockName, blockName, undefined, spriteIndex)); 
        } else {
            return false;
        }
    }

      tip_1_1a.newAssertTest(
        recursion_1,
        'Testing to make sure the "' + blockName + '" block uses recursion.',
        'The "' + blockName + '" block does use recursion.',
        'Make sure your block "' + blockName + '" uses recursion.',
        1
    );

    // var correctRecursiveCalls = function() {
    //     if(spriteContainsBlock(blockName, spriteIndex))
    //     {
    //         return customBlockContains(blockName, "move top piece from % to %", spriteIndex); 
    //     }
    //     else
    //     {
    //         return false
    //     }
    //   }

    //   var tip_1_1b = chunk_1.newTip('Make sure you follow the rules of Hanoi!',
    //     'The "' + blockName + '" block follows the basics rules of Hanoi!');
    //   tip_1_1b.newAssertTest(
    //     correctRecursiveCalls,
    //     'Testing to make sure the "' + blockName + '" block follows the simple rules of Hanoi.',
    //     'The "' + blockName + '" block follows the rules of Hanoi.',
    //     'Make sure your block "' + blockName + '" follows all the rules of Hanoi!',
    //     1s
    //     );

    var usesDansAmazingTemplate = function() {
        return blockPrecedesInSprite(blockName, "say %", spriteIndex);
    }
    var tip_1_1c = chunk_1.newTip('Make sure you follow the template!',
        'Basic checks have passed! ' + blockName + ' uses the visualization provided.');
    tip_1_1c.newAssertTest(
        usesDansAmazingTemplate,
        'Testing to make sure the "' + blockName + '" block uses the template.',
        'The "' + blockName + '" block does use the visualization provided.',
        'Make sure your block "' + blockName + '" uses the template provided.',
        1
        );


    return fb;
    
    }