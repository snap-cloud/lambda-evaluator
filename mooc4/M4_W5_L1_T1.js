var starter_path = "M4_W5_L1_T1_starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_M4_W5_L1_T1";
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
        'HOP'
    );

    var sort = "sort %";
    var merge_sorted = "%l merge sorted %l";

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
    var chunk_1 = fb.newChunk('Complete the "' + sort + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(sort);
    }

    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + sort + '" and place it in the scripting area.',
        'The "' + sort + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + sort + '" block is in the scripting area.',
        'The "' + sort + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + sort + '" and place it in the scripting area.',
        1
    );

    var verifyMergeSortedImplemented = function() {
        if(spriteContainsBlock(sort))
        {
            return customBlockContains(sort, merge_sorted);
        }
        else
        {
            return false; 
        }
    }

    var tip_1_1a = chunk_1.newTip('Make sure you use the old "% merge sorted %" function!',
        'The "' + sort + '" block uses Higher Order Procedures!',
        'Make sure you use Higher Order Procedures! Use the old "% merge sorted %" function you wrote earlier',
        1
        );

    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for the given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1 = [[5, 2, 3, 1, 6, 4, 8, 10]];
    tip_1_2.newIOTest('r',  // testClass
        sort,          // blockSpec
        input_1_2_1,        // input
        function (output) {
            // Output should be a list of numbers.
            var expected,
                actual;
            console.log(output);

            expected = ["1", "2", "3", "4", "5", "6", "8", "10"];
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


//*********************************************************************************************************************************//
//ALL ITEMS CODE
    var allItems = "all items of %l satisfy %predRing";

    var chunk_2 = fb.newChunk('Complete the "all items of % satisfy %" block.');

    var blockExists_2 = function () {
        return spriteContainsBlock(allItems);
    }

    var tip_2_1 = chunk_2.newTip('Make sure you name your block exactly "all items of % satisfy %" and place it in the scripting area.',
        'The "all items of % satisfy %" block exists.');

    tip_2_1.newAssertTest(
        blockExists_2,
        'Testing if the "all items of % satisfy %" block is in the scripting area.',
        'The "all items of % satisfy %" block is in the scripting area.',
        'Make sure you name your block exactly "all items of % satisfy %" and place it in the scripting area.',
        1
    );

    //     var noIteration = function() {
    //     return (!customBlockContains(allItems, "forever %c")) && (!customBlockContains(allItems, "for %upvar = %n to %n %cs"))
    //         && (!customBlockContains(allItems, "repeat until %b %c")) && (!customBlockContains(allItems, "repeat %n %c"))
    //         && (!customBlockContains(allItems, "for each %upvar of %l %cs"));
    // }

    // var tip_2_1a = chunk_2.newTip('Make sure you do not use iteration!',
    //     'The "' + allItems + '" block does not use iteration.');

    // tip_2_1a.newAssertTest(
    //     noIteration(),
    //     'Testing to make sure the "' + allItems + '" block does not use iteration.',
    //     'The "' + allItems + '" block does not use iteration.',
    //     'Make sure your block "' + allItems + '" does not use iteration. Try using only recursion!',
    //     1
    // );

    // var containsMap = function()
    // {
    //     return customBlockContains(allItems, "map %repRing over %mult%l");
    // }

    // var tip_2_1b = chunk_2.newTip('Make sure your function works for the test blocks in the template!',
    //     'The "' + allItems + '" works!');

    // tip_2_1b.newAssertTest(
    //     containsMap,
    //      'Testing to make sure the "' + allItems + '" block works.',
    //     'The "' + allItems + '" block does not satisfy basic test cases.',
    //     'Make sure your block "' + allItems + '" satisfies all the test cases given in the template before testing on the autograder!',
    //     1
    // );

//*********************************************************************************************************************************//
//GRAPH CODE

 var graph = "graph %";
 var chunk_3 = fb.newChunk('Complete the "' + graph + '" block.');

 var blockExists_3 = function () {
        return spriteContainsBlock(graph);
    }
    
 var tip_3_1 = chunk_3.newTip('Make sure you name your block exactly "' + graph + '" and place it in the scripting area.',
        'The "' + graph + '" block exists.');

tip_3_1.newAssertTest(
        blockExists_3,
        'Testing if the "' + graph + '" block is in the scripting area.',
        'The "' + graph + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + graph + '" and place it in the scripting area.',
        1
    );

//*********************************************************************************************************************************//
//RANDOMIZER CODE
var randomizer = "make randomizer %";
 var chunk_4 = fb.newChunk('Complete the "' + randomizer + '" block.');

 var blockExists_4 = function () {
        return spriteContainsBlock(randomizer);
    }
    
 var tip_4_1 = chunk_4.newTip('Make sure you name your block exactly "' + randomizer + '" and place it in the scripting area.',
        'The "' + randomizer + '" block exists.');

 tip_4_1.newAssertTest(
        blockExists_4,
        'Testing if the "' + randomizer + '" block is in the scripting area.',
        'The "' + randomizer + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + randomizer + '" and place it in the scripting area.',
        1
    );

 // var call = "call %";
 //  var blockExists_5 = function () {
 //        return spriteContainsBlock(call);
 //    }
    
 // var tip_4_2 = chunk_4.newTip('Make sure you did not delete the "' + call + '" block from the template.',
 //        'The "' + call + '" block exists.');
 //  tip_4_2.newAssertTest(
 //        blockExists_5,
 //        'Testing if the "' + call + '" block is still in the scripting area.',
 //        'The "' + call + '" block is in the scripting area.',
 //        'Make sure you did not delete the "' + call + '" block from the template.',
 //        1
 //    );

   var containsItemSelect = function()
    {
        return customBlockContains(randomizer, "item %idx of %l");
    }

    var tip_4_3 = chunk_4.newTip('Make sure your function works for the test blocks in the template!',
        'The "' + randomizer + '" block works!');

    tip_4_3.newAssertTest(
        containsItemSelect,
         'Testing to make sure the "' + randomizer + '" block works.',
        'The "' + randomizer + '" block does randomly pick items!',
        'Make sure your block "' + randomizer + '" satisfies all the test cases given in the template before testing on the autograder!',
        1
    );



    return fb;
    
    }