// TODO: Refactor and document the need for iframe checking.
// If should probably be in AG_EDX and be a function to call.
// id_problem can be cached in some variable.

var current_iframe = window.frameElement;
var num_iframes = parent.document.getElementsByClassName('problem-header').length;
var iframes = parent.document.getElementsByTagName("iframe");

var id_problem = 0;
for (i = 0; i < num_iframes; i++) {
    if (iframes[i] === current_iframe) {
        id_problem = i;
    }
}

var showPoints = false;
var showPrevFeedback = false;

function isEDXurl() {
    return window.location.host.indexOf('edx.org') !== -1; //|| window.location.host.indexOf('cloudfront.net') !== -1;
}

/* Removes the previously saved AG_state. Runs the tests in
 * AGTest().
 * Called by 'click' event on autograder_button.
 */
function runAGTest(snapWorld, taskID, outputLog) {
    // Create a new gradingLog if none is specified.
    var numAttempts = setNumAttempts(taskID);
    outputLog = outputLog || new FeedbackLog(snapWorld, taskID, numAttempts);
    // Populate, run, and evaluate the tests specified in AGTest()
    // These tests specified by the Course Designer. 
    
    // TODO: Cleanup and document this API
    var test_log = AGTest(outputLog);
    var TEST = test_log.runSnapTests();
    if (!TEST) {
        test_log.scoreLog();
    }
}

/* After loading the XML, check if the current XML is a known
 * state, restore the gradingLog if it is.
 * @return {gradingLog}
 * TODO: Trigger AGStart when a Snap file is loaded.
 */
function AGStart(snapWorld, taskID) {
    // Grab HTML divs
    var menu_button = document.getElementById("onclick-menu");
    var grade_button = document.getElementById("autograding_button");
    // Get the current Snap XML string
    var ide = snapWorld.children[0];
    var curr_xml = ide.serializer.serialize(ide.stage);
    // Retrieve previously graded Snap XML strings (if in sessionStorage).
    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");

    var outputLog;

    if (!graded) {
        AG_bar_nograde();
        return null;
    }
    // If the current XML matches the stored correct XML
    if (isSameSnapXML(c_prev_xml, curr_xml)) {
        // Restore the AG status bar to a graded state
        var outputLog = JSON.parse(sessionStorage.getItem(taskID + "_c_test_log"));
        outputLog.savedXML = curr_xml;
        outputLog.snapWorld = snapWorld;
        if (outputLog.allCorrect === true) {
            AG_bar_graded(outputLog);
        } else {
            AG_bar_semigraded(outputLog);
        }
        return outputLog;
    }
    // If the current XML matches the last stored 
    if (isSameSnapXML(prev_xml, curr_xml)) {
        // Restore the AG status bar to a graded state
        var outputLog = JSON.parse(sessionStorage.getItem(taskID + "_test_log"));
        outputLog.savedXML = curr_xml;
        outputLog.snapWorld = snapWorld;
        AG_bar_semigraded(outputLog);
        return outputLog; 
    } else {
        // Restore the AG status bar to a graded state
        // If no previous state is recognized, return new {gradingLog}.
        var numAttempts = setNumAttempts(taskID);
        outputLog = new FeedbackLog(snapWorld, taskID, 'test of new feedback', numAttempts); 
        AG_bar_ungraded(outputLog);
        return outputLog;
    }
}

/* Checks to see if the Snap! XML has changed and updates the
 * AG status bar. If Snap! is restored to its former state
 * the grading log and status bar are also restored.
 * @return {gradingLog} outputLog
 * Note:
 *  - Should only be called from a "mouseup" event.
 */
function AGUpdate(snapWorld, taskID) {
    // TODO: Are there any optional parameters that may be useful?
    // Grabs HTML divs
    var menu_button = document.getElementById("onclick-menu");
    var grade_button = document.getElementById("autograding_button");
   // Get the current Snap XML string
    var ide = snapWorld.children[0];
    var curr_xml = ide.serializer.serialize(ide.stage);
    // Retrieve previously graded Snap XML strings (if in sessionStorage).
    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var c_prev_log = sessionStorage.getItem(taskID + "_c_test_log");
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");
    var prev_log = sessionStorage.getItem(taskID + "_test_log");
    // Retrieve previous grade logs (if in sessionStorage). As {String}s
    
    if (!prev_xml || !curr_xml) {
        console.log('AGUpdate: Either prev_xml or curr_xml do not exist.');
    }
    // menu bar grays out options that are not available 
    // (ex. current state is same as best attempt) and restores the button state
    grayOutButtons(snapWorld, taskID);
    var outputLog;

    if (!graded) {
        AG_bar_nograde();
        return
    }
    
    // If current XML is different from prev_xml
    if (c_prev_xml && isSameSnapXML(c_prev_xml, curr_xml)) {               
       // Restore the AG status bar to a graded state
        
        // TODO: Write a good comment
        // TODO: Give gradeLog ability to recover log data and xml string
        console.log('AGUpdate: Thinks this is the "correct" XML.');
        sessionStorage.setItem(taskID + "_test_log", c_prev_log);
        sessionStorage.setItem(taskID + "_test_state", curr_xml);

       // Retrieve the correct test log from sessionStorage
        outputLog = JSON.parse(c_prev_log);
        outputLog.savedXML = curr_xml;
        outputLog.snapWorld = snapWorld;
        if (outputLog.allCorrect === true) {
            AG_bar_graded(outputLog);
        } else {
            AG_bar_semigraded(outputLog);
        }

    } else if (prev_xml && isSameSnapXML(prev_xml, curr_xml, true)) {
       // Restore the AG status bar to a graded state
        console.log('AGUpdate: Thinks this is just the "last" XML.');
        outputLog = JSON.parse(prev_log);
        outputLog.savedXML = curr_xml;
        outputLog.snapWorld = snapWorld;
        AG_bar_semigraded(outputLog);
    } else {
        // console.log("AGUpdate: Button should be ungraded");
        // Restore the AG status bar to a graded state
        var numAttempts = setNumAttempts(taskID);
        outputLog = new FeedbackLog(snapWorld, taskID, "", numAttempts);
        console.log(outputLog);
        AG_bar_ungraded(outputLog);
        console.log("button should change");
    }
    return outputLog;
}

/* Updates the AG_status_bar with respect to the outputLog. 
 *  - Formats CSS for 'autograding_flag' and 'autograding_button'
 * If the outputLog is correct, save the Snap XML string into 
 * sessionStorage.
 *  - key = outputLog.taskID + "_c_test_state"
 * Note:
 *  - Should only be called from outputLog.evaluateLog()
 */
function AGFinish(outputLog) {
    var c_prev_log = JSON.parse(sessionStorage.getItem(outputLog.taskID + "_c_test_log"));

    if (!graded) {
        AG_bar_nograde();
        return;
    }
    
    // Verify correctness
    if (outputLog.allCorrect) {
        // Save the correct XML string into sessionStorage
        AG_bar_graded(outputLog);
        outputLog.saveSnapXML(outputLog.taskID + "_c_test_state");
        // TODO: Refactor this conditional. 
    } else if (outputLog.pScore > 0 && 
        ((c_prev_log && outputLog.pScore >= c_prev_log.pScore)
        || (!c_prev_log))) {
        // Update AG_status_bar to 'graded, but incorrect state
    } else {
        AG_bar_semigraded(outputLog);
    }
   // Save the current XML. Log is saved in gradingLog.scoreLog(...)
    outputLog.saveSnapXML(outputLog.taskID + "_test_state");
    if (showFeedback) {
        populateFeedback(outputLog);
    }
    console.log('Autograder test Results:');
    console.log(outputLog);
    if (isEDXurl()) {
        edX_check_button.click();
    }
    if (submitAutograderResults) {
        console.log('SUBMITTING AG RESULTS');
        submitAutograderResults(outputLog);
    }
    if (!isEDXurl()) {
        populateFeedback(outputLog, false)
        openResults();
    }
}

/*
 * Reset state removes all saved logs and XML files, and opens a new
 * Snap! file. 
 */
function resetState(snapWorld, taskID) {
    var ide, numAttempts = 0, prevState;

    prevState = sessionStorage.getItem(taskID + "_test_log");
    if (prevState) {
        numAttempts = JSON.parse(prevState).numAttempts;
    }

    sessionStorage.removeItem(taskID + "_test_log");
    sessionStorage.removeItem(taskID + "_test_state");
    sessionStorage.removeItem(taskID + "_c_test_log");
    sessionStorage.removeItem(taskID + "_c_test_state");

    ide = snapWorld.children[0];

    if (starter_path) {
        $.get(
            starter_path,
            function(data) {
                ide.openProjectString(data);
            }, 
            "text"
        );
    } else {
        ide.newProject();
    }
    var new_log = AGStart(snapWorld, taskID);
    new_log.numAttempts = numAttempts;
    sessionStorage.setItem(taskID + "_test_state", ide.serializer.serialize(ide.stage));
    new_log.saveLog();
    grayOutButtons(snapWorld, taskID);
}

function revertToBestState(snapWorld, taskID) {
    var ide = snapWorld.children[0];

    var numAttempts = JSON.parse(sessionStorage.getItem(taskID + "_test_log")).numAttempts;

    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var c_prev_log = sessionStorage.getItem(taskID + "_c_test_log");
    sessionStorage.setItem(taskID + "_test_state", c_prev_xml);
    sessionStorage.setItem(taskID + "_test_log", c_prev_log);

    var prev_log = JSON.parse(sessionStorage.getItem(taskID + "_test_log"));
    // prev_log.savedXML = c_prev_xml;
    // prev_log.snapWorld = snapWorld;
    AG_bar_graded(prev_log);
    if (showFeedback) {
        populateFeedback(prev_log);
    }
    // TODO: Is this line necessary?
    prev_log.numAttempts = numAttempts;
    ide.openProjectString(c_prev_xml);
    grayOutButtons(snapWorld, taskID);
}

function revertToLastState(snapWorld, taskID) {
    var ide = snapWorld.children[0];
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");
    var prev_log = JSON.parse(sessionStorage.getItem(taskID + "_test_log"));
    // prev_log.savedXML = prev_xml;
    // prev_log.snapWorld = snapWorld;
    if (prev_log['allCorrect']) {
        AG_bar_graded(prev_log);
    } else {
        AG_bar_semigraded(prev_log);
    }
    if (showFeedback) {
        populateFeedback(prev_log);
    }
    ide.openProjectString(prev_xml);
    grayOutButtons(snapWorld, taskID);
}

/* Checks if two Snap! XML strings have approximately the same state.
 * The positions of scripts are ignored, as well as the order in which
 * they were most recently manipulated. 
 * @param {String} prev_xml
 * @param {String} curr_xml
 * @return {Boolean} Equivalence of prev_xml and curr_xml, false if
 * either are strings are undefined.
 * Currently only works for one sprite with scripts
 * TODO: Improve XML scrubbing (Consider the following)
 *  - If correct solution (scripts) is subset of other [DONE]
 *  - Optional tags for variables, sprite position  
 *  - Option to restore the highest scoring {gradingLog}
 *  
 * Note: Apparently works with multiple sprites, but produces a malformed
 * Snap XML string. Each sprite gets all scripts in sorted order. Needs
 * further testing.
*/
function isSameSnapXML(prev_xml, curr_xml, no_subset) {
   // replace script coordinates with generic 'x="0" y="0"'
    // console.log('isSameSnapXML');
    if ((prev_xml === null) || (curr_xml === null)) { return false; }
   // Remove script coordinates
    // prev_xml = prev_xml.replace(/script x="[\d]*" y="[\d]*"/g, 'script x="0" y="0"');
    // curr_xml = curr_xml.replace(/script x="[\d]*" y="[\d]*"/g, 'script x="0" y="0"');
    prev_xml = prev_xml.replace(/script x="(.*?)" y="(.*?)"/g, 'script x="0" y="0"');
    curr_xml = curr_xml.replace(/script x="(.*?)" y="(.*?)"/g, 'script x="0" y="0"');
   // Remove data hashes hashes (to allow coherence b/w reloads).
    prev_xml = prev_xml.replace(/data:image(.*?)(?=<)/g, '');
    curr_xml = curr_xml.replace(/data:image(.*?)(?=<)/g, '');
   // If XML is identical other than images and script positions, short-circuit
    if (prev_xml === curr_xml) { return true; }
    // split between brackets
    prev_xml_scripts = prev_xml.match(/(<script x)(.*?)(<\/script>)/g);
    curr_xml_scripts = curr_xml.match(/(<script x)(.*?)(<\/script>)/g);
   // split between custom blocks
    prev_xml_blocks = prev_xml.match(/(<block-definition s)(.*?)(\/block-definition>)/g);
    curr_xml_blocks = curr_xml.match(/(<block-definition s)(.*?)(\/block-definition>)/g);
    // sort script tags and convert back to strings
    // lol. weird syntax. doesn't sort if curr_xml_scripts === null.
    prev_xml_scripts && prev_xml_scripts.sort().join("");
    curr_xml_scripts && curr_xml_scripts.sort().join("");
    // If the custom block definitions have changed
    prev_xml_blocks && prev_xml_blocks.sort().join("");
    curr_xml_blocks && curr_xml_blocks.sort().join("");
    if(JSON.stringify(prev_xml_blocks) !== JSON.stringify(curr_xml_blocks)) {
        return false;
    }
    // If the previous scripts are a subset of current scripts
    if (!no_subset && isArrSubset(curr_xml_scripts, prev_xml_scripts)) {
        // Then the solution is still present and in-tact
        return true;
    }
    // replace unsorted scripts with sorted scripts
    // TODO: Replace them properly
    prev_xml = prev_xml.replace(/(<script x)(.*)(<\/script>)/g,prev_xml_scripts);
    curr_xml = curr_xml.replace(/(<script x)(.*)(<\/script>)/g,curr_xml_scripts);
    return prev_xml === curr_xml;
}

/*
 * Helper Function for isSameSnapXML(...). Used to check if a previous
 * solution is a sub-set of the current Snap! scripts.
 * @param {Array:Strings} big
 * @param {Array:String} small
 * @return {Boolean} If 'small' is a sub-set of 'big'
 */
function isArrSubset(big, small) {
    if (!big || !small) {
        return false;
    }
    nbig = big.slice();
    var index;
    for (var elem of small) {
        index = nbig.indexOf(elem);
        if (nbig.indexOf(elem) >= 0) {
            nbig.slice(index, 1);
        } else {
            return false;
        }
    }
    return true;
}

function regradeOnClick(outputLog, testId) {
    var test = outputLog[testId];
    test.graded = false;
    test.correct = false;
    outputLog.numAttempts += 1;
    if (test.testClass === "r") {
        outputLog.startSnapTest(parseInt(testId, 10));

    // for assertion tests, change feedback accordingly to whether assertion is true or false
    } else if (test.testClass === "a") {
        if (test.assertion()) {
            test.feedback = test.pos_fb;
            test.correct = true;
        } else {
            test.feedback = test.neg_fb;
            test.correct = false;
        }
        test.graded = true;
    }

    // What about other types of tests?
    outputLog.scoreLog();
    console.log(outputLog);
}

function setNumAttempts(taskID) {
    var prev_log = sessionStorage.getItem(taskID + "_test_log");
    if (prev_log !== null && JSON.parse(prev_log).numAttempts !== undefined) {
        return JSON.parse(prev_log).numAttempts;
    } else {
        return 0;
    }
}

