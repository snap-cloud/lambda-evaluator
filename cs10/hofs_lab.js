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

    // Factorion
    var factorionBlockSpec = 'is % a factorion?';
    var factorionImg = AG_UTIL.HTMLFormattedBlock(factorionBlockSpec);
    var chunk_1 = fb.newChunk('Complete the ' + blockImg + ' block.');
    
    var tip_1_1 = chunk_1.newTip(
        factorionImg + ' should find factorion numbers.',
        'Great job! Your factorion function works correctly.'
    );
    
    tip_1_1.newIOTest('r',  // testClass
        factorionBlockSpec,   // blockSpec
        1, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    tip_1_1.newIOTest('r',  // testClass
        factorionBlockSpec,   // blockSpec
        2, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    tip_1_1.newIOTest('r',  // testClass
        factorionBlockSpec,   // blockSpec
        145, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    tip_1_1.newIOTest('r',  // testClass
        factorionBlockSpec,   // blockSpec
        12, // input
        false, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    // Pandigital
    var pandigitalBlockSpec = 'is % pandigital?';
    var pandigitalImg = AG_UTIL.HTMLFormattedBlock(pandigitalBlockSpec);
    var chunk_2 = fb.newChunk('Complete the ' + pandigitalImg + ' block.');
    
    var tip_2_1 = chunk_2.newTip(
        pandigitalImg + ' should find pandigital numbers.',
        'Great job! Your pandigital function works correctly.'
    );
    
    tip_2_1.newIOTest('r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        1, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    tip_2_1.newIOTest('r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        12, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    tip_2_1.newIOTest('r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        123, // input
        true, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    tip_2_1.newIOTest('r',  // testClass
        pandigitalBlockSpec,   // blockSpec
        2, // input
        false, // output
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    // List all
    // TODO: A really good test here would test more functions for the predicate
    var listAllPropBlock = "list all numbers with property: % between % and %";
    var blockImg = AG_UTIL.HTMLFormattedBlock(listAllPropBlock);
    var chunk_3 = fb.newChunk('Complete the ' + blockImg + ' block.');

    var tip_3_1 = chunk_3.newTip(
        blockImg + ' should find pandigital numbers.',
        'Great job! Your list all function can handle pandigital numbers.'
    );
    
    tip_3_1.newIOTest('r',  // testClass
        listAllPropBlock,   // blockSpec
        [ findBlockInPalette(pandigitalBlockSpec, world), 1, 135 ], // input
        [1, 12, 21, 123, 132],
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );

    var tip_3_2 = chunk_3.newTip(
        blockImg + ' should return a list of factorion numbers.',
        'Great job! Your ' + blockImg + ' handles factorions correctly.'
    );
    
    tip_3_2.newIOTest('r',  // testClass
        listAllPropBlock,   // blockSpec
        [ findBlockInPalette(factorionBlockSpec, world), 1, 150 ], // input
        [1, 2, 145],
        4 * 1000, // 4 second time out.
        true, // is isolated
        1 // points
    );
    
    return fb;
}