// CS10 Practice with HOFs lab.

var starter_path = 'hofs_lab.xml';
// The id is to act as a course identifier.
var courseID = "CS10_SP16";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_hofs_lab";
var id = courseID + taskID;
var isEDX = false;
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
        'Complete the "Practice with HOFs lab".'
    );

    var spriteIndex;
    var ide = world.children[0];
    var sprites = ide.sprites.contents;
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].name === "AUTOGRADER") {
            spriteIndex = i;
            break;
        }
    }

    // Factorion
    var factorionBlockSpec = 'is % a factorion?';
    var factorionImg = AG_UTIL.HTMLFormattedBlock(factorionBlockSpec);
    var chunk_1 = fb.newChunk('Complete the ' + factorionImg + ' block.');
    
    var tip_1_1 = chunk_1.newTip(
        factorionImg + ' should find factorion numbers.',
        'Great job! Your factorion function works correctly.'
    );
    
    tip_1_1.newIOTest(
        'r',  // testClass
        factorionBlockSpec,   // blockSpec
        1, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    tip_1_1.newIOTest(
        'r',  // testClass
        factorionBlockSpec,   // blockSpec
        2, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    tip_1_1.newIOTest(
        'r',  // testClass
        factorionBlockSpec,   // blockSpec
        145, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    tip_1_1.newIOTest(
        'r',  // testClass
        factorionBlockSpec,   // blockSpec
        12, // input
        false, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    // Pandigital
    var pandigitalBlockSpec = 'is % pandigital?';
    var pandigitalImg = AG_UTIL.HTMLFormattedBlock(pandigitalBlockSpec);
    var chunk_2 = fb.newChunk('Complete the ' + pandigitalImg + ' block.');
    
    var tip_2_1 = chunk_2.newTip(
        pandigitalImg + ' should find pandigital numbers.',
        'Great job! Your pandigital function works correctly.'
    );
    
    tip_2_1.newIOTest(
        'r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        1, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    tip_2_1.newIOTest(
        'r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        12, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    tip_2_1.newIOTest(
        'r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        123, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );
    
    tip_2_1.newIOTest(
        'r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        2, // input
        false, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.125 // points
    );

    // List all
    // TODO: A really good test here would test more functions for the predicate
    var listAllPropBlock = "list all numbers with property: %predRing between % and %";
    var blockImg = AG_UTIL.HTMLFormattedBlock(listAllPropBlock);
    var chunk_3 = fb.newChunk('Complete the ' + blockImg + ' block.');

    var tip_3_1 = chunk_3.newTip(
        blockImg + ' should find pandigital numbers.',
        'Great job! Your list all function can handle pandigital numbers.'
    );
    
    tip_3_1.newIOTest(
        'r',  // testClass
        listAllPropBlock,   // blockSpec
        [ getScript(pandigitalBlockSpec, spriteIndex), 1, 135 ], // input
        [1, 12, 21, 123, 132],
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.5 // points
    );

    var tip_3_2 = chunk_3.newTip(
        blockImg + ' should return a list of factorion numbers.',
        'Great job! Your ' + blockImg + ' handles factorions correctly.'
    );
    
    tip_3_2.newIOTest(
        'r',  // testClass
        listAllPropBlock,   // blockSpec
        [ getScript(factorionBlockSpec, spriteIndex), 1, 150 ], // input
        function (output) {
            console.log('CHECKING OUTPUT');
            console.log(this);
            console.log('Output: ', output);
            console.log('Expected: ', [1, 2, 145]);
            return _.isEqual([1, 2, 145], output);
        },
        4 * 1000, // 4 second time out.
        true, // is isolated
        0.5 // points
    );
    
    var minBlock = "min value of % over all numbers in %";
    
    var chunk_1 = fb.newChunk('Complete the "' + minBlock + '" block.');

    var blockExists_1 = function () {
        return spriteContainsBlock(minBlock, spriteIndex);
    }

    var noIteration_1 = function() {
        if (spriteContainsBlock(minBlock, spriteIndex)) {
            return (!customBlockContains(minBlock, "forever %c", undefined, spriteIndex)) && (!customBlockContains(minBlock, "for %upvar = %n to %n %cs", undefined, spriteIndex))
            && (!customBlockContains(minBlock, "repeat until %b %c", undefined, spriteIndex)) && (!customBlockContains(minBlock, "repeat %n %c", undefined, spriteIndex))
            && (!customBlockContains(minBlock, "for each %upvar of %l %cs", undefined, spriteIndex));
        } else {
            return false;
        }

    }

    var noRecursion_1 = function() {
        if (spriteContainsBlock(minBlock, spriteIndex)) {
           return (!customBlockContains(minBlock, minBlock, undefined, spriteIndex)); 
        } else {
            return false;
        }
    }


    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly "' + minBlock + '" and place it in the scripting area.',
        'The "' + minBlock + '" block exists.');

    tip_1_1.newAssertTest(
        blockExists_1,
        'Testing if the "' + minBlock + '" block is in the scripting area.',
        'The "' + minBlock + '" block is in the scripting area.',
        'Make sure you name your block exactly "' + minBlock + '" and place it in the scripting area.',
        1
    );

    var tip_1_1a = chunk_1.newTip('Make sure you do not use iteration or recursion.',
        'The "' + minBlock + '" block does not use iteration or recursion.');

    tip_1_1a.newAssertTest(
        noIteration_1,
        'Testing to make sure the "' + minBlock + '" block does not use iteration.',
        'The "' + minBlock + '" block does not use iteration.',
        'Make sure your block "' + minBlock + '" does not use iteration. Try only using HOFS!',
        1
    );

    tip_1_1a.newAssertTest(
        noRecursion_1,
        'Testing to make sure the "' + minBlock + '" block does not use recursion.',
        'The "' + minBlock + '" block does not use recursion.',
        'Make sure your block "' + minBlock + '" does not use recursion. Try only using HOFS!',
        1
    );


    var tip_1_2 = chunk_1.newTip(
        'Your block should return the correct values for given inputs.',
        'Great job! Your block reports the correct value for given inputs.'
    );

    var input_1_2_1_function = function(n) {
        return n % 5;
    }

    try {
       var input_1_2_1 = [getScript("f %", spriteIndex), [4, 6, 7]];
        tip_1_2.newIOTest('r',  // testClass
            minBlock,          // blockSpec
            input_1_2_1,        // input
            function (output) {
                // Output should be a list of 2D lists.
                var expected,
                    actual;

                expected = 1;
                if (output instanceof List) {
                    actual = output.asArray();
                } else {
                    actual = output;
                }
                if (!_.isEqual(actual, expected)) {
                    //tip_1_2.suggestion = 'The output should be ' + expected + ';';
                    //tip_1_2.suggestion += ' but was ' + actual + '.';
                    return false;
                }
                return true;
            },
            4 * 1000, // 4 second time out.
            true, // is isolated
            1 // points
        );

        var input_1_2_2 = [getScript("g %", spriteIndex), [1, 2, 3, 5, 7, 9, 11]];
        tip_1_2.newIOTest(
            'r',        // testClass
            minBlock,   // blockSpec
            input_1_2_2,    // input
            function (output) {
                var expected,
                    actual;

                expected = 11;
                if (output instanceof List) {
                    actual = output.asArray();
                } else {
                    actual = output;
                }
                if (!_.isEqual(actual, expected)) {
                    return false;
                }
                return true;
            },
            4 * 1000, // 4 second time out.
            true, // is isolated
            1 // points
        );

        var input_1_2_3 = [getScript("f %", spriteIndex), []];
        tip_1_2.newIOTest('r',  // testClass
            minBlock,          // blockSpec
            input_1_2_3,        // input
            function (output) {
                // Output should be a list of 2D lists.
                var expected,
                    actual;

                expected = "";
                if (output instanceof List) {
                    actual = output.asArray();
                } else {
                    actual = output;
                }
                if (!_.isEqual(actual, expected)) {
                    return false;
                }
                return true;
            },
            4 * 1000, // 4 second time out.
            true, // is isolated
            1 // points
        ); 
    } catch(e) {

        var minBlock_2 = "f %";
        var minBlock_3 = "g %";

        var blockExists_2 = function () {
            return spriteContainsBlock(minBlock_2, spriteIndex);
        }
        var blockExists_3 = function () {
            return spriteContainsBlock(minBlock_3, spriteIndex);
        }




        tip_1_2.newAssertTest(
            blockExists_2,
            'Testing if the "' + minBlock_2 + '" block is in the scripting area.',
            'The "' + minBlock_2 + '" block is in the scripting area.',
            'Make sure the "' + minBlock_2 + '" block is in the scripting area. It is necessary for testing of the "min value of % over all numbers in %" block. Since it is found in the starter file, if the starter file did not load, please either load one of your previous exercises from this week or click the "reset" button.',
            1
        ); 

        tip_1_2.newAssertTest(
            blockExists_3,
            'Testing if the "' + minBlock_3 + '" block is in the scripting area.',
            'The "' + minBlock_3 + '" block is in the scripting area.',
            'Make sure the "' + minBlock_3 + '" block is in the scripting area. It is necessary for testing of the "min value of % over all numbers in %" block. Since it is found in the starter file, if the starter file did not load, please either load one of your previous exercises from this week or click the "reset" button.',
            1
        ); 
    }

    return fb;
}