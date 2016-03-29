/*
 * Feedback Log is a modification of the old gradingLog, but includes
 * more structure for feedback organized into suggestions. 
 */

/****************************************************************************/
/************************** How To: Writing Tests ***************************/
/****************************************************************************/

/*
 * First create a FeedbackLog. Required: snapWorld, taskID. 
 * Optional: Include general informational text in 'feedback_text', and
 * specify a numAttempts if this is not the first attempt. Default to 0, otherwise.
 * * * * *
 var fb_log = FeedbackLog(world, 'task_5', 'I am helpful text.', 0);

 * Next add a TestChunk to the FeedbackLog. This represents a group of tips
 * relevant to a specific block or script. (e.g. factorial, draw square).
 * Use FeedbackLog.newChunk to create, and immediately associate a chunk
 * with the desired FeedbackLog.
 * Required parameter: chunk_title. Optional: chunk_text
 * * * * *
 var factorial_chunk = fb_log.newChunk('factorial', 'Factorial is a mathematical operation.')

 * Then you can add a Tip to the TestChunk using TestChunk.newTip. 
 * Required parameters: a 'suggestion', and a 'complement'.
 * * * * *
 var basecase_tip = factorial_chunk.newTip('Make sure your basecase is correct, first.',
                                            'Your basecase is working well.');

 * Finally, you can add two different test types. An AssertTest or an IOTest.
 * An AssertTest can be added to the Tip using Tip.newAssertTest. All
 * parameters are required. statement should be a boolean function only.
 * All values will bubble up and update the associated tip, chunk, and fb_log.
 * * * * *
 var assertion1 = function() {return true;}
 var assert_test = basecase_tip.newAssertTest(assertion1,    // statement
        'I describe the test.',  // text
        'Great job. This test passed. Have a cookie.', // pos_fb
        "This test failed. I didn't see what I wanted to see.",  // neg_fb
        2); // points

 * An IO test is similar to the AssertTest, and only handles one input/output 
 * pair. Each test must be added separately. Unlike AssertTest, you must
 * specify a testClass. 'r' for reporter tests, 's' for snap event tests.
 * * * * *
 var io_test = basecase_tip.newIOTest('r',  // testClass
         'factorial %'   // blockSpec
         [5], // input, Note: Must be a list, needed b/c some blocks have multiple inputs.
         120, // expOut
        -1, // timeOut
        true, // isolated, defaults to false
        1); // points

 * To grade the FeedbackLog, simply call FeedbackLog.runSnapTests(). This
 * will return a graded FeedbackLog, and will attempt to update the Autograder
 * GUI. This should not be included in AGTest().
 * * * * *
 fb_log.runSnapTests()

 */
/****************************************************************************/
/****************************************************************************/
/************** Creating the Feedback Log ****************/
/*
 * feedbackLog has a list of testChunks.
 */
function FeedbackLog(snapWorld, taskID, feedback_text, numAttempts) {
    this.testCount = 0;
    this.allCorrect = false;
    this.currentTimeout = null;
    this.taskID = taskID || null;
    this.pScore = null;
    this.snapWorld = snapWorld || null;
    this.graded = false;
    this.numCorrect = 0;
    this.points = 0;
    this.totalPoints = 0;
    this.numAttempts = numAttempts || 0;

    this.chunk_list = [];
    this.num_errors = null;
    this.feedback_text = feedback_text || null;
}

FeedbackLog.prototype.updateCounts = function(num_tests, num_points) {
    this.testCount += num_tests;
    this.totalPoints += num_points;
}

/*
 * newChunk creates an empty chunk and immediately adds it to 
 * the feedbackLog chunk_list.
 */
FeedbackLog.prototype.newChunk = function(chunk_title, chunk_text) {
    var new_chunk = new TestChunk(chunk_title, chunk_text);
    this.addChunk(new_chunk);
    return new_chunk;
}

/*
 * Add an existing chunk to the feedbackLog chunk_list. Update test
 * and point totals in the feedbackLog. Include a parent reference 
 * to the feedbackLog in the testChunk.
 */
FeedbackLog.prototype.addChunk = function(chunk) {
    this.chunk_list.push(chunk);
    chunk.fb_log = this;
    this.updateCounts(chunk.testCount, chunk.totalPoints);

}
/******** Searching the FeedbackLog ********/

FeedbackLog.prototype.chunkOf = function(tip) {
    if (tip.chunk) {
        return tip.chunk;
    } else {
        throw 'FeedbackLog.chunkOf: Tip has no Chunk';
    }
};

FeedbackLog.prototype.tipOf = function(test) {
    if (test.tip) {
        return test.tip;
    } else {
        throw 'FeedbackLog.tipOf: Test has no Tip';
    }
}

/******** Saving the FeedbackLog ***********/
FeedbackLog.prototype.saveLog = function() {
    // Save current state as 'last attempt'
    var log_string = this.toString();

    try {
        sessionStorage.setItem(this.taskID + '_test_log', log_string);
    } catch (e) {
        console.log('Cannot Set Item in Session Storage');
    }
    
    try {
        sessionStorage.setItem(this.taskID + '_test_log', log_string);
        // Find previous 'best attempt', compare w/current, if better, overwrite
        // Note: Holy Jesus. This predicate is rediculous. Brain hurts...
        var c_prev_log = JSON.parse(sessionStorage.getItem(this.taskID + "_c_test_log"));
        if (this.allCorrect || 
            ((this.pScore > 0) && 
                ((c_prev_log && (this.pScore >= c_prev_log.pScore)) || !c_prev_log)
            )
        ) {
            // Store the correct log in sessionStorage
            sessionStorage.setItem(this.taskID + "_c_test_log", log_string);
        }
    } catch (e) {
        console.log(e);
    }
}

FeedbackLog.prototype.saveSnapXML = function(store_key) {
    if (this.snapWorld && store_key) {
        try {
            sessionStorage.setItem(store_key, this.stringifySnapXML());
        } catch (e) {
            console.log('Cannot Set Item in Session Storage');
        }
    }
};

FeedbackLog.prototype.stringifySnapXML = function() {
    if (this.snapWorld) {
        var ide = this.snapWorld.children[0];
        var world_string = ide.serializer.serialize(ide.stage);
        return world_string
    } else {
        throw 'FeedbackLog.stringifySnapXML: No snapWorld to found.';
    }
};

/************* Running the Feedback Log *************/

FeedbackLog.prototype.runSnapTests = function() {
    // IE sucks: Can't use for...of until IE supports it.
    // TODO: Document this...it seems buggy (returning too early??)
    // Iterate over each chunk
    var chunk;
    var tip;
    var test;
    for (var c in this.chunk_list) {
        chunk = this.chunk_list[c]
        // Iterate over each tip in each chunk
        for (var t in chunk.tip_list) {
            tip = chunk.tip_list[t]
            // Iterate over each test in each tip
            for (var i in tip.test_list) {
                test = tip.test_list[i];
                if (test.testClass === 'r') {
                    this.startSnapTest(test);
                    return true;
                }
                if (test.testClass === 's') {
                    return true;
                }
            }
        }
    }
    return false;
};

// NOTE: This function must now pass in a test.
FeedbackLog.prototype.startSnapTest = function(test) {
    try {
        // Retrieve the block from the stage
        var block = null;
        if (test.isolated) {
            // TODO: Fix setUpIsolatedTest to remove testID
            block = setUpIsolatedTest(test.blockSpec, this, test)
        } else {
            block = getScript(test.blockSpec);
        }
        // Set the selected block's inputs for the test
        setValues(block, test.input);
        if (Array.isArray(test.input)) {
            var temp = test.input;
            test.input = [];
            for (var j = 0; j < temp.length; j++) {
                if (temp[j].selector === "evaluateCustomBlock") {
                    test.input.push(temp[j].blockSpec);
                } else {
                    test.input.push(temp[j]);
                }
            }
            
        }
        
        // Initiate the Snap Process with a callback to .finishSnapTest
        var stage = this.snapWorld.children[0].stage;
        var fb_log = this;    // to use in anonymous function
        var proc = stage.threads.startProcess(
            block,
            stage.isThreadSafe,
            false,
            function() {
                try {
                    fb_log.finishSnapTest(test, readValue(proc));
                } catch (e) {
                    console.log(e);
                }
            }
        );
        // Add reference to proc in gradingLog for error handling
        test.proc = proc;
        // Timeouts for infinitely looping script or an Error.
        var timeout = test.timeOut;
        if (timeout < 0) {
            timeout = 1000; // Set default if -1
        }
        // Launch timeout to handle Snap errors and infinitely looping scripts
        var timeout_id = setTimeout(function() {
            // TODO: This is erroring for some reason....
            var stage = fb_log.snapWorld.children[0].stage;
            if (test.proc.errorFlag) {
                test.feedback = "Uh oh! A Snap Error occurred.";
            } else {
                test.feedback = "Test Timeout Occurred.";
            }
            test.output = "INVALID";
            //stage.threads.stopProcess(getScript(test.blockSpec), test.sprite);
            var index = 0;
            var ide = fb_log.snapWorld.children[0];
            for (var i = 0; i < ide.sprites.contents.length; i++) {
                console.log(ide.sprites.contents[i].name);
                if (ide.sprites.contents[i].name === test.sprite.name) {
                    index = i;
                }
            }

            stage.threads.stopProcess(getScript(test.blockSpec, index));
        }, timeout);
        this.currentTimeout = timeout_id;
        return this;
    } catch (e) {
        // If an error is throw, fill out the test info, and find the next test
        test.feedback = e;
        test.correct = false;
        test.graded = true;
        test.proc = null;
        // Find the next test and run it.
        this.runNextTest(test);

    }
};

FeedbackLog.prototype.finishSnapTest = function(test, output) {
    // Check that output is being returned
    if (output == undefined || output == null) {
        test.output = '[NO OUTPUT]';
    } else if (output === '') {
        test.output = '[empty output]'
    } else {
        // If the output is a list, reformat it for comparision
        if (output instanceof List) {
            test.output = arrayFormattedString(
                toNativeArray(output)
            );
            /*{
                newline: output.length() < 25 ? '<br>' : '&nbsp;',
                indent: '&nbsp;&nbsp;'
            }*/

        } else {
            test.output = output.toString();
        }
    }
    
    // try {
    //     var myscript = getScript(test.blockSpec);
    //     // FIXME -- this isn't working...
    //     test.picture = myscript.returnResultBubble(output);
    // } catch (e) {
    //     console.log('Error Generating Script Pic: ', e);
    //     test.picture = null;
    // }

    var expOut = test.expOut;
    if (expOut instanceof Function) {
        // NOTE: This may not work if output is of 'bad' type
        test.correct = expOut(output);
    } else {
        if (expOut instanceof Array) {
            // TODO: Switch this to toSnapList (or whatever I named that fn)
            expOut = toSnapList(expOut);
        }
        test.correct = snapEquals(output, expOut);
    }

    // Set feedback based on test.correct value
    if (test.correct) {
        test.feedback = test.feedback || "Test Passed.";
    } else {
        test.feedback = test.feedback || "Unexpected Output: " + (
            typeof output === 'string' || typeof output === 'number' ? output : ''
        );
    }
    // Set test graded flag to true, for gradingLog.gradeLog()
    test.graded = true;
    // Kill error handling timeout
    clearTimeout(this.currentTimeout);
    test.proc = null;
    // Clear the input values
    try {
        if (test.isolated) {
            var thisSprite, ide;
            test.sprite.remove();
            test.sprite = null;
            ide = this.snapWorld.children[0];
            thisSprite = ide.sprites.contents[0];
            ide.selectSprite(thisSprite);
        } else {
            var block = getScript(test.blockSpec);
            setValues(block, Array(test.input.length).join('a').split('a'));
        }
    } catch(e) {
        console.log(e);
        console.log("FeedbackLog.finishSnapTest: Trying to clear values of block that does not exist.");
        return;
    }
    // Launch the next test if it exists, scoreLog otherwise.
    this.runNextTest(test);
};

FeedbackLog.prototype.runNextTest = function(test) {
    // Find teh next test
    var next_test = this.nextTest(test);
    var myself = this;
    if (next_test) {
        setTimeout(function() {
            myself.startSnapTest(next_test);
        }, 1);
    } else {
        this.scoreLog();
        return;
    }
    // if it exists, launch it with a timeout
};

FeedbackLog.prototype.nextTest = function (test) {
    all_tests = this.allIOTests();
    var test_index = all_tests.indexOf(test);
    if ((all_tests.length - test_index) > 1) {
        return all_tests[test_index + 1];
    } else {
        return false;
    }
}

FeedbackLog.prototype.allIOTests = function() {
    all_tests = [];
    for (c in this.chunk_list) {
        chunk = this.chunk_list[c];
        for (p in chunk.tip_list) {
            tip = chunk.tip_list[p];
            for (t in tip.test_list) {
                test = tip.test_list[t];
                if (test.testClass === 'r') {
                    all_tests.push(test);
                }
            }
        }
    }
    return all_tests;
}

FeedbackLog.prototype.firstTest = function() {
    if (this.chunk_list.length > 0 &&
        this.chunk_list[0].tip_list.length > 0 &&
        this.chunk_list[0].tip_list[0].test_list.length > 0) {
        return this.chunk_list[0].tip_list[0].test_list[0];
    }
};

FeedbackLog.prototype.scoreLog = function() {
    if (this.testCount === 0) {
        throw 'FeedbackLog.scoreLog: Attempted to score empty FeedbackLog';
    }

    // Iterate over all tests and score the FeedbackLog, chunks, and tips.
    this.allCorrect = true;
    this.points = 0;
    this.numCorrect = 0;
    var chunk,
        tip, 
        test;
    for (var c = 0; c < this.chunk_list.length; c++) { // for each chunk
        chunk = this.chunk_list[c];
        chunk.allCorrect = true;
        chunk.points = 0;
        chunk.numCorrect = 0;
        for (var t = 0; t < chunk.tip_list.length; t++) { // for each tip
            tip = chunk.tip_list[t];
            tip.allCorrect = true;
            tip.points = 0;
            tip.numCorrect = 0;
            // for (var i in tip.test_list) { // for each test
            for (var i=0; i<tip.test_list.length; i++) {
                test = tip.test_list[i];
                if (test.correct) {    // check if test passed,
                    tip.numCorrect += 1;    // update count and points
                    tip.points += test.points;
                } else {
                    tip.allCorrect = false;
                }
            }
            tip.graded = true;
            chunk.numCorrect += tip.numCorrect;
            chunk.points += tip.points;
            chunk.allCorrect = chunk.allCorrect && tip.allCorrect
        }
        chunk.graded = true;
        this.numCorrect += chunk.numCorrect;
        this.points += chunk.points;
        this.allCorrect = this.allCorrect && chunk.allCorrect;
    }
    // Calculate percentage score (for edX partial credit)
    this.pScore = this.points / this.totalPoints;
    this.graded = true;
    this.numAttempts += 1; // increment the number of attempts when grading succeeds.
    // save the log 
    this.saveLog();
    // this.SnapWorld = world;
    // console.log(this);
    // Update the Autograder Status Bar
    AGFinish(this);
    return this;
};

/************** Formatting the Feedback Log *****************/

// NOTE: May no longer be necessary
FeedbackLog.prototype.toDict = function() {
    throw 'FeedbackLog.toDict: This function is DEPRICATED.'
    // body...
};

FeedbackLog.prototype.toString = function() {
    var world_ref = this.snapWorld;
    this.snapWorld = null;
    // Stringify the object with additional function to prevent cycles
    // Note: Borrowed from stack overflow
    // http:// stackoverflow.com/questions/9382167/serializing-object-that-contains-cyclic-object-value
    seen = [];
    var log_string = JSON.stringify(this, function(key, val) {
       if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
                return;
            }
            seen.push(val);
        }
        return val;
    }, ' ');
    // Restore the world reference
    this.snapWorld = world_ref;
    return log_string;
};

FeedbackLog.prototype.toAGLog = function() {
    throw 'FeedbackLog.toAGLog: This function is DEPRICATED.'
    // body...
}

/****************************************************************************/
/****************************************************************************/
/*
 * A testChunk is an object that contains all the tips (aka 'suggestions')
 * associated with a tested block/script. 
 */

function TestChunk(chunk_title, chunk_text) {
    this.chunk_title = chunk_title;
    this.chunk_text = chunk_text || null;
    this.allCorrect = false;
    this.graded = false;
    this.testCount = 0;
    this.numCorrect = 0;
    this.totalPoints = 0;
    this.points = 0;
    this.tip_list = [];
    this.fb_log = null;
}

TestChunk.prototype.updateCounts = function(num_tests, num_points) {
    this.testCount += num_tests;
    this.totalPoints += num_points;
    if (this.fb_log) {
        this.fb_log.updateCounts(num_tests, num_points);
    }
}

TestChunk.prototype.newTip = function(suggestion, complement) {
    var new_tip = new Tip(suggestion, complement);
    this.addTip(new_tip);
    return new_tip;
}

TestChunk.prototype.addTip = function(tip) {
    tip.chunk = this;
    this.tip_list.push(tip);
    this.updateCounts(tip.testCount, tip.totalPoints)
    // this.testCount += tip.testCount;
    // this.totalPoints += tip.totalPoints;
}

/****************************************************************************/
/****************************************************************************/

function Tip(suggestion, complement, rank) {
    this.suggestion = suggestion || 'Try Harder.';
    this.complement = complement || 'Good Job!';
    this.test_list = [];
    this.graded = false;
    this.testCount = 0;
    this.numCorrect = 0;
    this.totalPoints = 0;
    this.points = 0
    this.allCorrect = false;
    this.chunk = null;
    this.rank = rank || 0;
}

Tip.prototype.updateCounts = function(num_tests, num_points) {
    this.testCount += num_tests;
    this.totalPoints += num_points;
    if (this.chunk) {
        this.chunk.updateCounts(num_tests, num_points);
    }
}

Tip.prototype.newIOTest = function(testClass, blockSpec, input, expOut, timeOut, isolated, points) {
    points = typeof points !== 'undefined' ? points : 1;
    var new_io_test = new IOTest(testClass, blockSpec, input, expOut, timeOut, isolated, points);
    this.addTest(new_io_test);
    return new_io_test;
}

Tip.prototype.newAssertTest = function(statement, feedback, text, pos_fb, neg_fb, points) {
    // console.log(statement);
    var new_ass_test = new AssertTest(statement, feedback, text, pos_fb, neg_fb, points);
    this.addTest(new_ass_test);
    return new_ass_test
}

Tip.prototype.addTest = function(test) {
    this.test_list.push(test);
    test.tip = this;
    this.updateCounts(1, test.points);
}

/****************************************************************************/
/****************************************************************************/

function IOTest(testClass, blockSpec, input, expOut, timeOut, isolated, points) {
    this.testClass = testClass;
    this.blockSpec = blockSpec;
    this.input = input;
    this.expOut = expOut;
    this.timeOut = timeOut;
    this.isolated = isolated || false;
    this.points = points === 0 ? 0 : (points || 1);

    this.output = null;
    this.correct = false;
    this.graded = false;
    this.feedback = null;
    this.proc = null;
    this.sprite = 0;
}

function AssertTest(statement, text, pos_fb, neg_fb, points) {
    this.testClass = 'a';
    this.assertion = statement;
    this.text = text;
    this.pos_fb = pos_fb;
    this.neg_fb = neg_fb;
    this.points = points !== undefined ? points : 1;
    
    try {
        this.correct = statement();
        if (this.correct) {
            this.feedback = pos_fb;
        } else {
            this.feedback = neg_fb;
        }
    } catch(e) {
        this.correct = false;
        this.feedback = neg_fb;
    }
    this.graded = true;
}

/****************************************************************************/
/****************************************************************************/
/******************* Additional Functions *******************/

// David added in a way to populate a list in the
// set values. Does not yet work for variables!
function setValues(block, values) {
    if (!(values instanceof Array)) {
        values = [values];
    }
    var valIndex = 0,
        morphIndex = 0;

    if (block.blockSpec == "list %exp") {
        setNewListToArg(values[valIndex], block, morphIndex);
        return;
    }

    var morphList = block.children;

    for (var morph of morphList) {
        if (morph.constructor.name === "InputSlotMorph") {
            if (values[valIndex] instanceof Array) {
                setNewListToArg(values[valIndex], block, morphIndex);
            } else {
                morph.setContents(values[valIndex]);
            }
            valIndex += 1;
        } else if (morph instanceof ArgMorph && morph.type === "list") {
            setNewListToArg(values[valIndex], block, morphIndex);
            valIndex += 1;
        } else if (morph instanceof RingMorph) {
            morph.children[0].children[0] = values[valIndex];
            valIndex += 1;
        }
        morphIndex++;
    }
    if (valIndex + 1 !== values.length) {
        // TODO: THROW ERROR FOR INVALID BLOCK DEFINITION
    }
}


// sets (in a very hacky way) a list to an ArgMorph of list type
// sets the first one it sees then exits!!!
function setNewListToArg(values, block, i) {
    morph = block.children[i];
    morph_type = morph.constructor.name;

    if ((morph.blockSpec === "list %exp") 
        && (morph_type === "ReporterBlockMorph")) {
            populateList(morph,values);
    } else if ((morph_type === "ArgMorph") || (morph_type === "InputSlotMorph")) {
        var newList = cloneListReporter();
        populateList(newList, values);
        block.children[i] = newList;
        block.children[i].parent = block;
        block.fixLayout();
        block.changed();    
    }

}

// Creates a semi invisable sprite for testing purposes
// Adds the sprite to the stage but no where else!
// returns the new sprite
// @param ide - the working snap IDE
function addInvisibleSprite(world) {
    var ide = world.children[0]
    var sprite = new SpriteMorph(ide.globalVariables),
        rnd = Process.prototype.reportRandom;

    // sprite.name = ide.newSpriteName(sprite.name);
    sprite.name = "Testing...";

    sprite.setCenter(ide.stage.center());
       ide.stage.add(sprite);
    // randomize sprite properties
    sprite.setHue(rnd.call(ide, 0, 100));
    sprite.setBrightness(rnd.call(ide, 50, 100));
    sprite.turn(rnd.call(ide, 1, 360));
    sprite.setXPosition(rnd.call(ide, -220, 220));
    sprite.setYPosition(rnd.call(ide, -160, 160));

    ide.sprites.add(sprite);
    ide.corral.addSprite(sprite);

   return sprite;
}

function createTestSprite(log, test) {
    var ide = log.snapWorld.children[0];
    var sprite = addInvisibleSprite(log.snapWorld);
    test.sprite = sprite;
    return sprite;
}

function setUpIsolatedTest(blockSpec, log, test) {
    var block = findBlockInPalette(blockSpec, log.snapWorld);
    if (!block) { 
        throw blockSpec + " not found in Palette!";
    }
    var sprite = createTestSprite(log, test);
    addBlockToSprite(sprite, block);
    return block;
}

/* To compare the blockSpecs we use blockSpecMatch()
 * simplifySpec(palette[i].blockSpec) === simplifySpec(blockSpec)
 */
function findBlockInPalette(blockSpec, workingWorld) {
    var thisWorld = workingWorld || world,
        palette = null,
        i = 0,
        // TODO: extract this, make a 'constant'
        pList = ["motion", "variables", "looks", "sound", "pen", "control", "sensing", "operators"];

    for (var item of pList) {
        palette = getPaletteScripts(item, workingWorld);
        i = 0;

        while (i < palette.length) {
            if (palette[i].blockSpec && blockSpecMatch(palette[i].blockSpec, blockSpec)) {
                return palette[i].fullCopy();
            }
            i++;
        }
    }
    throw "Custom block: (" + blockSpec + ") not found in palette.";
    // return null
}

function addBlockToSprite(sprite, block) {
    sprite.scripts.add(block);
    sprite.scripts.cleanUp();
}

//  list.setContents([1,2,3])
// MultiArgMorph.addInput('5')
// getScript('list %exp') -> returns the snap list object reference
// world.children[0].sprites.contents[0].scripts.children[0].children[1] -> gets the MultiArgMorph

// populates a list reporter block with the given arguments
function populateList(list, args) {
    var multiArg = list.children[list.children.length - 1];

    while (multiArg.children.length > 2) {
        multiArg.removeInput();
    }
    for (var i = 0; i < args.length; i++) {
        if (args[i] === 0) {
            args[i] = "0";
        }
        multiArg.addInput(args[i]);
    }
}

function cloneListReporter() {
    var palette = getPaletteScripts("variables");
    var block = null;
    var i = 0;
    while (i < palette.length) {
        if (palette[i].blockSpec && palette[i].blockSpec === "list %exp") {
            block = palette[i].fullCopy();
            i = palette.length;
        }
        i++;
    }
    return block;
}

// TODO: Switch to Snap!'s new "invoke" command!
function evalReporter(block, outputLog, testID) {
    var stage, proc;
    stage = world.children[0].stage;
    proc = stage.threads.startProcess(
        block,
        stage.isThreadSafe,
        false,
        function() {
            console.log('Completion callback');
            console.log(proc);
            outputLog.finishTest(testID, readValue(proc));
        }
    );
    return proc;
}

/* Read the return value of a Snap! process. The process
 * is an evaluating reporter block that updates a field in the
 * process on completion.
 */
function readValue(proc) {
    console.log('READ VALUE PROC: ', proc);
    return proc.homeContext.inputs[0];
}

function prettyBlockString(blockSpec, inputs) {
    var pString = blockSpec;
    for (var inp in inputs) {
        pString = pString.replace(/%[a-z]/, inp);
    }
    return pString;
}

/*
*  Set a timeout for the test specified by testID and wait the appropriate time.
*  If the test does not finish by the specified time out, find the process
*  and kill it.
*/
function infLoopCheck(outputLog, testID) {
    var timeout = outputLog["" + testID]["timeOut"];

    if (timeout < 0) {
        timeout = 1000;
    }
    return setTimeout(function() {
            var stage = world.children[0].stage;
            if (outputLog["" + testID]["proc"].errorFlag) {
                outputLog["" + testID]["feedback"] = "Error!";
            }
            stage.threads.stopProcess(getScript(outputLog["" + testID]["blockSpec"]));
        }, timeout);
}


/*  Convert a JS List to a Snap! list in place
*/
function listify(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] instanceof Array) {
            listify(array[i]);
            array[i] = new List(array[i]);
        }
    }
}

// This isn't used (yet) Eventually this should be tested and replace `listify`
function toSnapList(array) {
    return new List(array.map(function (item) {
        if (item.contructor == Array) {
            return toSnapList(item);
        }
        return item;
    }));
}

// Recursively Convert a Snap! list into a native array
function toNativeArray(list) {
    return list.asArray().map(function (item) {
        return item.constructor === List ? toNativeArray(item) : item;
    });
}

/**************** Testing the Feedback Log ************/
// Create a new feedbackLog

/*
    var fb = new FeedbackLog(null, 'log_for_tests', 'this is a feedback log test', 0);
    console.log('fb created');
    // Create a first test chunk
    var test_chunk = fb.newChunk('factorial');
    console.log('test chunk created');
    console.log(test_chunk);
    // Add a first tip to that first test chunk
    var test_tip = test_chunk.newTip('Make sure that your basecase is correct.',
        'Your basecase looks great!');
    console.log('test tip created');
    // Add a first assertion test to that first tip
    var assertion1 = function() {
        return true;
    }
    var assertionBad = function() {
        return false;
    }
    var ass_test1 = test_tip.newAssertTest( 
        assertion1, 
        'The basecase should never have a recursive call.',
        'Your basecase correctly returns the simple solution.',
        'Careful, your basecase contains a recursive call.',
        2);
    console.log('assertion test created');
    // Add a second test to that first tip
    var ass_test2 = test_tip.newAssertTest(
        assertionBad,
        'The color should be red',
        'The color is red!',
        'The color should always be red.',
        1);
    // Ad a second tip
    var second_tip = test_chunk.newTip('Make sure the cake is cooked.',
        'The cake is cooked perfectly!');
    // Add a test to that second tip
    var ass_test3 = second_tip.newAssertTest(
        assertionBad,
        'Cake does not have frosting',
        'The frosting is great!',
        'Cake must have frosting',
        1);

    // Create a second chunk
    var second_chunk = fb.newChunk('other stuff');
    var third_tip = second_chunk.newTip('Aww you didnt do it.', 'yay you did it!');
    var ass_test4 = third_tip.newAssertTest(
        assertion1,
        'Bad job',
        'great job',
        'do a good job',
        1);

    var third_chunk = fb.newChunk('more example stuff');
    var fourth_tip = third_chunk.newTip('Try Again!', 'Good job!');
    var ass_test5 = fourth_tip.newAssertTest(
        assertion1,
        'Bad job',
        'great job',
        'do a good job',
        1);
    var ass_test6 = fourth_tip.newAssertTest(
        assertionBad,
        'Bad job',
        'great job',
        'do a good job',
        1);

    // console.log('Saved the Log');
    console.log('Initial Log state');
    console.log(fb);
    // fb.scoreLog();
    console.log('Log has been scored');
    console.log(fb);
*/