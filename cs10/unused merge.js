    // var tip_2_1 = chunk_1.newTip(
    //     'Make sure ' + blockImg + ' has the correct number of recursive calls.',
    //     'Fill in the empty reporter case.'
    // );

    function blockHas2Calls() {
        return occurancesOfBlockSpec(blockSpec, getBlockBody(blockSpec)) == 2;
    }


    // tip_2_1.newAssertTest(
    //     blockHas2Calls,
    //     "Testing if " + blockImg + " has the right amount of recursive calls.",
    //     "Awesome! " + blockImg + " uses 2 recursive calls.",
    //     "How similar (or different) is the second report from the given one?",
    //     0 // NOTE: Currently no points in case this doesnt work.
    // );


    // Generate some random data for each test.
    var list1 = [];
    for (var i = 0; i < 10; i += 1) {
        list1.push(Process.prototype.reportRandom(1, 20));
    }
    var result = list1.sort(function (x, y) {return x - y});

    var sortBlock = "sort %";
    blockImg = AG_UTIL.HTMLFormattedBlock(sortBlock);
    chunk_2 = fb.newChunk('Let\'s test merge using ' + blockImg + '.');

    var tip_2_1 = chunk_1.newTip(
        'Make sure you name your block exactly ' + blockImg + ' and place it in the scripting area.',
        'Found the ' + blockImg + ' block in the scripting area.'
    );

    var blockExists_2 = function () {
        return spriteContainsBlock(sortBlock);
    }

    tip_2_1.newAssertTest(
        blockExists_2,
        "Testing if the " + blockImg + " block is in the scripting area.",
        "The " + blockImg + " block is in the scripting area.",
        "Make sure you name your block exactly " + blockImg + " and place it in the scripting area.",
        0
    );

    var tip_2_2 = chunk_2.newTip(
        'Try merging larger lists.',
        'Awesome work! You\'ve sorted a list of 10 items.'
    );

    tip_2_2.newIOTest('r',  // testClass
        sortBlock,          // blockSpec
        list1 ,             // input
        function (output) {
            console.log('GOT OUTPUT');
            console.log(output);
            return true;
        },             // output
        4 * 1000,           // 4 second time out.
        true,               // is isolated
        1                   // points
    );
