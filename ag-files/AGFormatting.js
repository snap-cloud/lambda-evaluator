/*
* Makes AG status bar reflect the ungraded state of the outputLog.
*/

var onclick_menu;
var menu_style;
var menu_right;

var button;
var button_style;
var button_right;

// TODO: Pull out first 6 lines in a shared function
function AG_bar_ungraded(outputLog) {
    var button_text = "Get Feedback ";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }
    button_elem.fadeOut('fast', function() {
        button_elem.html(button_text);
        button_elem.slideDown('fast');
        $('#autograding_button').css('background', 'orange');
    }); 
     
    $('#autograding_button .hover_darken').show();
    $('#onclick-menu').css('color', 'white');
    if (sessionStorage.getItem(outputLog.taskID + "_test_log")) {
        $('#feedback-button').html("View Previous Feedback");
    } else {
        $('#feedback-button').html("No Feedback Available");
    }
}

/*
 * Makes AG status bar reflect the graded state of the outputLog. This
 * only occurs when all tests on the outputLog have passed.
 */
function AG_bar_graded(outputLog) {
    var button_text = "Get Feedback  ";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }

    button_elem.html(button_text);
    $('#autograding_button').css('background', '#29A629');
    $('#autograding_button .hover_darken').hide();
    $('#onclick-menu').css('color', 'white');
    $('#feedback-button').html("Review Feedback");
}

/*
 * Makes AG status bar reflect the semi graded state of the outputLog. 
 * This is called when any test on the outputLog fails.
 */
function AG_bar_semigraded(outputLog) {
    var button_text = "Get Feedback";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp("FEEDBACK","g");
    var num_errors = outputLog.testCount - outputLog.numCorrect;
    var plural = "";
    if (num_errors > 1) { plural = "s"};
    $('#feedback-button').html("View Feedback ("+ 
        num_errors +" Error" + plural + ")");
    if (button_elem.html().match(regex) !== null) {
        return;
    }

    button_elem.html(button_text);
    $('#autograding_button').css('background', 'red');
    $('#autograding_button .hover_darken').show();
    $('#onclick-menu').css('color', 'orange');
}

function AG_bar_nograde() {
    var button_text = "NOT GRADED";
    var button_elem = $('#autograding_button span');
    button_elem.html(button_text);
    $('#autograding_button').css({"background":"gray", "cursor":"default"});
    document.getElementById('autograding_button').style.pointerEvents = 'none';
}

/*
    TODO: Add documentation
*/
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceall(string, find, replace) {
    return (string.replace(new RegExp(escapeRegExp(find), 'g'), replace));
}

/*
 * Re-format the contents of a the hint string to add HTML tags and
 * appropriate CSS. Return the re-formatted string.
 */
function formatFeedback(hint) {
    var tags = 
    [['collapsedivstart', '<input class="toggle-box" id="expander' + String(id_problem) + '" type="checkbox" ><label for="expander' + String(id_problem) + '">Details</label><div id="table-wrapper">'], 
    ['collapsedivend', '</div>'], 
    ['linebreak', '<br /></br />'], 
    ['tablestart', '<table class="results">'], 
    ['tableend', '</table>'], 
    ['rowstart', '<tr>'], 
    ['rowend', '</tr>'], 
    ['headstart', '<th class="titles" style="text-align: center;">'], 
    ['headend', '</th>'], 
    ['datastart', '<td class="data" style="text-align: center;">'], 
    ['evenstart', '<td class="evens" style="text-align: center;">'],
    ['dataend', '</td>'], 
    ['correctstart', '<td class="correctans" style="text-align: center;">'],
    ['wrongstart', '<td class="incorrectans" style="text-align: center;">'],
    ['teststart', '<td class="tests" style="text-align: center;">'],
    ['spanend', '</span>'], 
    ['spanstart', '<span class="message">']];

    var taglength = tags.length;
    var message = String(hint.innerHTML);

    for (var i = 0; i < taglength; i++) {
        message = replaceall(message, tags[i][0], tags[i][1]);
    }
    return message;
}


function toggleMenu() {
    var menu_items = document.getElementsByClassName("bubble")[0];
    if (menu_items.id === "dropdown-closed") {
        menu_items.id = "dropdown-open";
    } else {
        menu_items.id = "dropdown-closed";
    }
}

function openPopup() {
    var overlay = document.getElementById('overlay');
    overlay.classList.remove("is-hidden");
}

function closePopup() {
    var overlay = document.getElementById('overlay');
    overlay.classList.add("is-hidden");
}

function openResults() {
    var overlay = document.getElementById('ag-output');
    overlay.classList.remove("is-hidden");
}

function closeResults() {
    var overlay = document.getElementById('ag-output');
    overlay.classList.add("is-hidden");
}

function addBasicHeadings() {
    basicCols = ["Test", "Points", "Feedback"];
    for (i=0; i<basicCols.length; i++) {
        var header = document.createElement("th");
        var text = document.createTextNode(basicCols[i]);
        // var lastCol = document.getElementById("reporter-last-column");
        var titles = document.getElementById("table-titles");
        header.classList.add("titles", "non-reporter");
        header.appendChild(text);
        titles.appendChild(header);
    }
}

function addReporterHeadings() {
    var columns = ["Test", "Points", "Block", "Input", "Output", "Expected", "Feedback"];
    for (i = 0; i < columns.length; i++) {
        var header = document.createElement("th");
        var text = document.createTextNode(columns[i]);
        var repTitles = document.getElementById("reporter-table-titles");
        header.classList.add("titles", "reporter");
        header.appendChild(text);
        repTitles.appendChild(header);
    }
}

function addTableCell(text, elemClass, row) {
    var data = document.createElement("td");
    var text = document.createTextNode(text);
    data.appendChild(text);
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else {
        data.classList.add(elemClass);
    }
    row.appendChild(data);
}

function addRegradeButton(text, elemClass, row) {
    var data = document.createElement("td");
    var button = document.createElement("p");
    var text = document.createTextNode(text);
    button.classList.add("regrade-button");
    button.appendChild(text);
    data.appendChild(button);
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else {
        data.classList.add(elemClass);
    }
    row.appendChild(data);
}

function grayOutButtons(snapWorld, taskID) {
    var ide = snapWorld.children[0];
    var curr_xml = ide.serializer.serialize(ide.stage);
    // Retrieve previously graded Snap XML strings (if in sessionStorage).
    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");

    var revert_button = document.getElementById("revert-button");
    if (c_prev_xml === null || isSameSnapXML(c_prev_xml, curr_xml)) {
        revert_button.style.pointerEvents = "none";
        revert_button.parentNode.id = "disabled-button";
    } else {
        revert_button.parentNode.id = "enabled-button";
        revert_button.style.pointerEvents = "auto";
    }

    var undo_button = document.getElementById("undo-button");
    if (prev_xml === null || isSameSnapXML(prev_xml, curr_xml)) {
        undo_button.style.pointerEvents = "none";
        undo_button.parentNode.id = "disabled-button";
    } else {
        undo_button.parentNode.id = "enabled-button";
        undo_button.style.pointerEvents = "auto";
    }
}


function makeOverlayButton() {
    var grade_button = document.getElementById("autograding_button");
    var overlay_button = parent.document.createElement('button');
    var overlay_button_text = parent.document.createTextNode('Grade');
    overlay_button.appendChild(overlay_button_text);
    overlay_button.classList.add('overlay-button');
    var button = parent.document.getElementsByName('problem_id')[id_problem];
    button.parentNode.insertBefore(overlay_button, button.nextSibling);
    overlay_button.onclick = function() { 
        overlay_button.style.display = "none";
        grade_button.click(); 
    }
}

function makeFullScreenButton() {
    var autograding_bar = document.getElementById('autograding_bar');
    var full_screen_button = document.createElement('button');
    var full_screen_button_text = document.createTextNode("Full-Screen");
    full_screen_button.appendChild(full_screen_button_text);
    full_screen_button.id = "full-screen";
    full_screen_button.className = "off";
    autograding_bar.parentNode.insertBefore(full_screen_button, autograding_bar.nextSibling);
}

function toggleSnapWindow(button, taskID) {
    var iframe = parent.document.getElementsByTagName('iframe')[id_problem];
    if (button.className === "off") {
        fullScreenSnap(button, taskID);
    } else {
        iframe.style.position = 'initial';
        iframe.style.top = 'initial';
        iframe.style.right = 'initial';
        iframe.style.height = '500px';
        iframe.style.zIndex = 'initial';
        button.className = "off";
        button.innerHTML = "Full-Screen";
        sessionStorage.removeItem(taskID + "full-screen-on");
    }
}

function fullScreenSnap(button, taskID) {
    var iframe = parent.document.getElementsByTagName('iframe')[id_problem];
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.zIndex = '16777270';
    button.className = "on";
    button.innerHTML = "Windowed";
    sessionStorage.setItem(taskID + "full-screen-on", JSON.stringify(true));
}

// TODO: REFACTOR THIS
IDE_Morph.prototype.originalToggleStageSize = IDE_Morph.prototype.toggleStageSize;
IDE_Morph.prototype.toggleStageSize = function (isSmall) {
    this.originalToggleStageSize(isSmall);
    setTimeout(function() {
        moveAutogradingBar();
    }, 100);
}

function moveAutogradingBar() {
    var autograding_bar = document.getElementById('autograding_bar');
    var ide = world.children[0];
    if (ide.stageRatio === 1) {
        autograding_bar.style.right = '9em';
    } else {
        autograding_bar.style.right = '16em';
    }
}

function closeInitialHelp() {
    var initial_overlay = document.getElementById("initial-help");
    initial_overlay.classList.add("is-hidden");
}

function setInitialHelpDisplay(bool) {
    if (localStorage) {
        localStorage['-snap-autograder-inital-help'] = JSON.stringify(bool);
    }
}

function hasShownInitalHelp() {
    if (localStorage) {
        return JSON.parse(localStorage['-snap-autograder-inital-help'] || null);
    }
    return false;
}


function createInitialHelp() {
    initial_help = document.createElement("div");
    initial_help.classList.add("overlay");
    initial_help.id = "initial-help";

    $(initial_help).insertAfter("#overlay")

    hamburger_help = document.createElement("p");
    hamburger_text = document.createTextNode("Click this button to access helpful auto-feedback functions.");
    hamburger_help.appendChild(hamburger_text);
    hamburger_help.id = "hamburger-menu-help";
    hamburger_help.classList.add("help-text");

    hamburger_help_arrow = document.createElement("p");
    hamburger_help_arrow_text = document.createTextNode("↑");
    hamburger_help_arrow.appendChild(hamburger_help_arrow_text);
    hamburger_help_arrow.id = "hamburger-menu-arrow";


    document.getElementById("initial-help").appendChild(hamburger_help);
    document.getElementById("initial-help").appendChild(hamburger_help_arrow);
    $("#full-screen-arrow").clone().appendTo("#initial-help");
    $("#full-screen-help").clone().appendTo("#initial-help");

    var arrow = document.getElementById("ag-button-arrow"), 
        arrow_clone = arrow.cloneNode(true);
    var help = document.getElementById("ag-button-help"), 
        help_clone = help.cloneNode(true);

    arrow_clone.id = "initial-ag-button-arrow";
    help_clone.id = "initial-ag-button-help";

    document.getElementById("initial-help").appendChild(arrow_clone);
    document.getElementById("initial-help").appendChild(help_clone);
    
    setInitialHelpDisplay(true)
}

function previousFeedbackButton() {
    var prev_feedback = document.createElement("li");
    prev_feedback.classList.add("menu-item-sub-menu");
    prev_feedback.id = "enabled-button";

    var prev_feedback_link = document.createElement("a");
    var prev_feedback_text = document.createTextNode("View Previous Feedback");
    prev_feedback_link.appendChild(prev_feedback_text);
    prev_feedback_link.id = "feedback-button";

    prev_feedback.appendChild(prev_feedback_link);

    var menu_divider = document.createElement("li");
    menu_divider.classList.add("menu-item-sub-menu");
    menu_divider.id = "menu-divider";

    $(".bubble").prepend(menu_divider);
    $(".bubble").prepend(prev_feedback);
}


function initializeSnapAdditions(snapWorld, taskID) {
    var prevFeedbackButton = false;
    if (!hasShownInitalHelp()) {
        createInitialHelp();
        moveHelp();
    }
    if (showPrevFeedback && !prevFeedbackButton) {
        previousFeedbackButton();
        prevFeedbackButton = true;
    }
    if (isEDX) {
        current_iframe.parentNode.parentNode.parentNode.style.width = "100%";
    }

    var pageLocation = JSON.parse(sessionStorage.getItem(taskID + "pageLocation"));
    if (pageLocation) {
        parent.window.scrollTo(pageLocation[0], pageLocation[1]);
        sessionStorage.removeItem(taskID + "pageLocation");
    }

    ide = snapWorld.children[0];

    // AUTOGRADER ADDITION - FEEDBACK FORMATTING
    // Checks if problem has been checked and modifies the autograded output if it has been checked

    /*if (isEDX && parent.document.getElementsByClassName("message")[id_problem]) {
        var hint = parent.document.getElementsByClassName("message")[id_problem];
        hint.innerHTML = formatFeedback(hint);
        hint.style.display = "inline";
    }*/

    // AUTOGRADER ADDITION
    // Check if Pre-requisite task has completed
    /*var req_check = parent.document.getElementById("pre_req");
    if (preReqTaskID !== null) {
        var preReqLog = JSON.parse(sessionStorage.getItem(preReqID + "_test_log"));
        if ((preReqLog === null || !preReqLog.allCorrect) && req_check) {
            req_check.innerHTML = "[WARNING: The previous task must be completed before continuing.]"
        }
    }*/

    setTimeout(function() {
        // If page has already been loaded, restore previously tested XML
        // TODO: Separate this into its own function.
        // Moved this into the timeout so that keys in session storage have time to be set from setstate in AGEDX before they are called
        var prev_xml = sessionStorage.getItem(taskID + "_test_state");
        if (prev_xml !== null) {
            ide.openProjectString(prev_xml);
        } else if (preReqTaskID !== null) {
            if (preReqLog !== null && preReqLog.allCorrect) {
                ide.openProjectString(sessionStorage.getItem(preReqID));
            }
        }
    }, 500);

    var prev_log = JSON.parse(sessionStorage.getItem(taskID + "_test_log"));

    var reset_button = document.getElementById("reset-button");
    var revert_button = document.getElementById("revert-button");
    var undo_button = document.getElementById("undo-button");
    var menu_button = document.getElementsByClassName("hover_darken")[0];
    var help_overlay = document.getElementById('overlay');
    var results_overlay = document.getElementById("ag-output");
    var regrade_buttons = document.getElementsByClassName("regrade");
    var grade_button = document.getElementById("autograding_button");
    var world_canvas = document.getElementById('world');
    var snap_menu = document.getElementsByClassName('bubble')[0];

    if (showPrevFeedback) {
        var feedback_button = document.getElementById("feedback-button");
        feedback_button.onclick = function() { openResults(); };
    }


    document.addEventListener(
        "click",
        function() {
            grayOutButtons(snapWorld, taskID);
        }
    );
    snap_menu.addEventListener('click', popup_listener);
    reset_button.onclick = function () {
        resetState(snapWorld, taskID);
        toggleMenu(taskID);
    };
    revert_button.onclick = function (e) {
        revertToBestState(snapWorld, taskID);
        toggleMenu(taskID);
    };
    undo_button.onclick = function (e) {
        revertToLastState(snapWorld, taskID);
        toggleMenu(taskID);
    };
    menu_button.onclick = function (e) {
        toggleMenu(taskID);
    };

    help_overlay.onclick = function(e) {
        closePopup();
    }

    results_overlay.onclick = function(e) {
        if (!(document.getElementById('ag-results').contains(e.target)) && e.target.className.indexOf("regrade") === -1) {
            closeResults();
        }
    }

    world_canvas.onclick = function(e) {
        if (document.getElementById('dropdown-open') !== null && !(document.getElementById('onclick-menu').contains(e.target))) {
            toggleMenu();
        }
    }

    var popup_listener = function(event) {
        event.stopPropagation();
    }

    $(".bubble").mouseover(moveHelp);

    var initial_overlay = document.getElementById('initial-help');
    if (initial_overlay) {
        initial_overlay.onclick = function(e) { closeInitialHelp(); }
    }

    checkButtonExists = false;
    if (isEDX) {
        var timesChecked = 0;

        checkButtonExists = true;
        var checkExist = setInterval(function() {
            timesChecked += 1;
            console.log("checking...." + id_problem);
            if (parent.document.getElementsByClassName('check-label')[id_problem]) {
            // if (edX_check_button) {
                console.log("Exists!");
                clearInterval(checkExist);
                edX_check_button = current_iframe.parentNode.parentNode.parentNode.parentNode.parentNode.nextElementSibling.children[1];

                edX_check_button.onclick = function () {
                    sessionStorage.setItem(
                        taskID + "pageLocation",
                        JSON.stringify([
                            parent.window.scrollX,
                            parent.window.scrollY
                        ])
                    );
                };

                edX_check_button.style.display = "none";
            }
            if (timesChecked === 5) {
                isEDX = false;
                checkButtonExists = false;
                clearInterval(checkExist);
            }
        }, 100);

        makeFullScreenButton();
        var full_screen = document.getElementById('full-screen');
        full_screen.onclick = function() {
            toggleSnapWindow(full_screen, id);
            moveHelp();   
        }
        var full_screen_on = JSON.parse(sessionStorage.getItem(taskID + "full-screen-on"));
        if (full_screen_on) {
            fullScreenSnap(full_screen, id);
        }
    }

    setTimeout(function() {
        document.getElementById("toggle-correct-tests").innerHTML = '<div class="toggle-correct isOff" id="toggle-correct">See Correct Tests</div><div id="correct-table-wrapper">';
        if (!graded) {return; }
    },1000);

    setTimeout(function() {
        onclick_menu = document.getElementById('onclick-menu');
        menu_style = window.getComputedStyle(onclick_menu);
        menu_right = menu_style.getPropertyValue('right');

        button = document.getElementById('autograding_button');
        button_style = window.getComputedStyle(button);
        button_right = button_style.getPropertyValue('right');

        if (prev_log) {
            var outputLog = prev_log;
        } else {
           var outputLog = AGStart(snapWorld, taskID);
        }

        // for some reason, the for loop in populateFeedback doesn't increment
        // correctly the first time it is run, so populateFeedback has to be
        // called twice at the very beginning...
        if (showFeedback && sessionStorage.getItem(taskID + "_popupFeedback") !== null) {
            populateFeedback(outputLog); 
            populateFeedback(outputLog);
            openResults();
            sessionStorage.removeItem(taskID + "_popupFeedback");
        }
        grayOutButtons(snapWorld, taskID);
        moveAutogradingBar();

        var tip_tests = document.getElementsByClassName("data");
        for(var i=0; i < tip_tests.length; i++){
            tip_tests[i].style.maxWidth = String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px";
        }

        StageHandleMorph.prototype.originalFixLayout = StageHandleMorph.prototype.fixLayout;
        StageHandleMorph.prototype.fixLayout = function() {
            this.originalFixLayout();
            // console.log(this.target.right());
            // console.log(this.target.width());
            if (this.target.width() > 225) {
                if (this.target.width() > 390) {
                    $('#autograding_bar').css({
                        right: 150,
                        left: 'auto',
                    });
                } else {
                    $('#autograding_bar').css({
                        left:  this.target.left() - 140,
                    });
                }
            }
        }
    }, 1000);

    setTimeout(function() {
        var starter_xml = sessionStorage.getItem(taskID + "starter_file");
        if (starter_xml) {
            ide.openProjectString(starter_xml);
            sessionStorage.removeItem(taskID + "starter_file");
        }
    }, 1500);
}

// Call the test suite when this element is clicked.
var update_listener = function() {
    var outputLog = AGUpdate(world, id);
};

var button_listener = function(event) {
    event.stopPropagation();
    var numAttempts = setNumAttempts(id);
    outputLog = new FeedbackLog(world, id, numAttempts);
    outputLog.numAttempts += 1;
    runAGTest(world, id, outputLog);

    var tip_tests = document.getElementsByClassName("data");
    for(var i = 0; i < tip_tests.length; i++) {
        tip_tests[i].style.maxWidth = String(Number(document.getElementsByClassName("inner-titles")[0].offsetWidth) - 50) + "px";
    }
    sessionStorage.setItem(id + "_popupFeedback", "");
}

function moveHelp() {
    var pos = $(".bubble").offset();
    var menu_pos = $("#onclick-menu").offset();

    $("#menu-item-help").css({
        position: "absolute",
        top: pos.top + 100 + "px",
        left: pos.left - 250 + "px"
    });
    $("#menu-item-arrow").css({
        position: "absolute",
        top: pos.top + 60 + "px",
        left: pos.left - 30 + "px"
    });
    $("#ag-button-help").css({
        position: "absolute",
        top: pos.top + "px",
        left: pos.left + 200 + "px"
    });
    $("#ag-button-arrow").css({
        position: "absolute",
        top: pos.top - 30 + "px",
        left: pos.left + 270 + "px"
    });

    $("#initial-ag-button-help").css({
        position: "absolute",
        top: pos.top + "px",
        left: pos.left + 200 + "px"
    });
    $("#initial-ag-button-arrow").css({
        position: "absolute",
        top: pos.top - 33 + "px",
        left: pos.left + 200 + "px"
    });
    $("#hamburger-menu-help").css({
        position: "absolute",
        top: menu_pos.top + 40 + "px",
        left: menu_pos.left - 100 + "px"
    });
    $("#hamburger-menu-arrow").css({
        position: "absolute",
        top: menu_pos.top + 5 + "px",
        left: menu_pos.left + 5 + "px"
    });
}


function appendElement(elem, text, elemClass, selector) {
    var data = document.createElement(elem);
    if (text !== null) {
        var text = document.createTextNode(text);
        data.appendChild(text);
    }
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else if (elemClass !== null) {
        data.classList.add(elemClass);
    }
    selector.appendChild(data);
}

function addReporterHeadings(selector) {
    var columns = ["Input", "Output", "Expected", "Comment"];
    var newRow = document.createElement("tr");
    for (z = 0; z < columns.length; z++) {
        var header = document.createElement("th");
        var text = document.createTextNode(columns[z]);
        header.classList.add("titles", "reporter");
        header.appendChild(text);
        newRow.appendChild(header);
    }
    selector.appendChild(newRow);
}

function createCollapsibleCorrectSection(selector) {
    var identifier = "something";
    var correct_collapse = document.createElement("div");
    var correct_tip = document.createElement("div");
    correct_tip.id = "correct-tip" + String(identifier);
    correct_tip.classList.add("correct-tip");

    correct_collapse.innerHTML = '<br><input class="details correct-details" id="correct-expander' + String(identifier) + '" type="checkbox" ><label for="correct-expander' + String(identifier) + '">' + "Here are the parts you did correctly!" + '</label><div id="correct-table-wrapper' + String(identifier) + '">';
    correct_collapse.innerHTML = '<br><div class="toggle-correct" id="toggle-correct' + String(identifier) + '">Click Here</div><span class="correct-expander correct-expander' + String(identifier) + '">Here are the parts you did correctly!</span><div id="correct-table-wrapper' + String(identifier) + '">';
    correct_collapse.innerHTML = '<br><div class="toggle-correct" id="toggle-correct' + String(identifier) + '">See Correct Tests</div><div id="correct-table-wrapper' + String(identifier) + '">';

    selector.insertBefore(correct_tip, selector.firstChild);

    correct_tip.appendChild(correct_collapse);
}

/*
    TODO: Update this to use jQuery, and maybe _ templates
    http://underscorejs.org/#template
    * This needs to be broken into at least a few functions
    * Cache all document.get*() calls which are used more than one
    * Cleanup all the x["y"] calls to be x.y
    * Remove add extra String() coercions, and document any that are necessary
*/
function populateFeedback(feedbackLog, allFeedback, chunknum, tipnum) {
    // TODO: Declare move variables up here:
    var i, j, x;
    
    // TODO: Extract this function
    document.getElementById("toggle-correct-tests").onclick = function () {
        if (toggleButton.classList.contains("isOff")) {
            toggleButton.classList.remove("isOff");
            allFeedback = true;
            toggleButton.innerHTML = "Hide Correct Tests";
        } else {
            toggleButton.classList.add("isOff");
            allFeedback = false;
            toggleButton.innerHTML = "See Correct Tests";
        }
        populateFeedback(feedbackLog, allFeedback);
        setTimeout(function() {
            openResults();
        }, 100);
    }

    var comment = document.getElementById("comment");

    comment.innerHTML = "";
    while (comment.nextSibling) {
        document.getElementById("ag-results").removeChild(comment.nextSibling);
    }

    var log = feedbackLog;
    var chunks = log.chunk_list;
    var linebreak = document.createElement("br");
    var numtips = 0;
    var plural = "";
    var chunkHasCorrectTip = false;
    var tipHasCorrectTest = false;


    onclick_menu.style.right = menu_right;
    button.style.right = button_right;
    document.getElementById("numtips").innerHTML = String(numtips) + " tip" + plural;
    var tipwidth = document.getElementById("numtips").offsetWidth;

    onclick_menu.style.right = String(Number(menu_right.slice(0, menu_right.length - 2)) + tipwidth - 2) + "px";
    
    button.style.right = String(Number(button_right.slice(0, button_right.length - 2)) + tipwidth - 2) + "px";

    button.style.borderRadius = "0px";

    var correct_section = document.createElement("div");
    var incorrect_section = document.createElement("div");
    var correct_section_text = document.createTextNode("Here is what you did well!");
    var incorrect_section_text = document.createTextNode("Here is what you may want to look at again!");
    correct_section.appendChild(correct_section_text);
    incorrect_section.appendChild(incorrect_section_text);
    correct_section.id = "correct-section";
    incorrect_section.id = "incorrect-section";

    document.getElementById("ag-results").appendChild(correct_section);
    document.getElementById("ag-results").appendChild(incorrect_section);

    document.getElementById("correct-section").style.display = "none";
    document.getElementById("incorrect-section").style.display = "none";

    // TODO: What is this doing? It seems redundant.
    var chunknum = typeof chunknum !== 'undefined' ? chunknum : undefined;
    var tipnum = typeof tipnum !== 'undefined' ? tipnum : undefined;
    
    if (!showPoints) {
        showPoints = false;
    }

    for (i = 0; i < chunks.length; i++) {
        var chunk = chunks[i];

        var chunkPlural = "";
        var chunkPoints = "";
        if (showPoints) {
            if (chunk.totalPoints !== 1) {
                chunkPlural = "s";
            }
            chunkPoints = " (" + chunk["totalPoints"] + " possible point" + chunkPlural + ")";
        }

        var tips = chunk.tip_list;
        var header = document.createElement("p");
        header.innerHTML = String(chunk["chunk_title"]) + chunkPoints + '<br><br>';
        
        header.classList.add("chunk-header", "chunk" + String(i));
        
        var correct_chunk = header.cloneNode(true);
        correct_chunk.classList.add("correct-chunk" + String(i));
        
        if (chunk.allCorrect) {
            document.getElementById("correct-section").style.display = "block";
            document.getElementById("correct-section").appendChild(correct_chunk);
        } else {
            var incorrect_chunk = header.cloneNode(true);
            incorrect_chunk.classList.add("incorrect-chunk" + String(i));
            document.getElementById("incorrect-section").style.display = "block";
            document.getElementById("incorrect-section").appendChild(incorrect_chunk);
        }

        var currRank = 1;
        tipLoop:

        for (x = 0; x < tips.length; x++) {
            var tip = tips[x];
            var allFeedback = typeof allFeedback !== 'undefined' ? allFeedback : false;
            var div = document.createElement("div");
            var label_class = "incorrectans";
            var current_chunk = document.getElementsByClassName("incorrect-chunk"+String(i))[0];
            if (tip.allCorrect) {
                document.getElementById("correct-section").style.display = "block";
                document.getElementById("correct-section").appendChild(correct_chunk);
                current_chunk = document.getElementsByClassName("correct-chunk"+String(i))[0];
                label_class = "correctans";
                var suggestion = tip.complement;
            } else {
                numtips += 1;
                var suggestion = tip.suggestion;
            }

            var tipPoints = "";

            // TODO: Clean this up
            div.innerHTML = '<input class="details" id="expander' + i + x + '" type="checkbox" ><label class="' + label_class + '" for="expander' + i + x + '">' + tipPoints + String(suggestion) + '</label><div id="table-wrapper' + i + x + '">';

            current_chunk.appendChild(div);
            var details = document.getElementById("table-wrapper" + i + x);
            details.previousSibling.click();
            var allTests = tip["test_list"];
            appendElement(
                "p",
                "",
                ["inner-titles", "observations" + i + x ],
                details
            );

            for (j = 0; j < allTests.length; j++) {
                var newRow = document.createElement("tr");
                var thisTest = allTests[j];
                var testPlural = "";
                var testPoints = "";
                if (showPoints) {
                    if (thisTest.points !== 1) {
                        testPlural = "s";
                    }
                    testPoints = "(" + thisTest.points + " point" + testPlural + ") ";
                }
                
                if (thisTest.testClass !== "r") {
                    if (document.getElementsByClassName("observations-section" + i + x[0]) !== []) {
                        incorrect_assertions = 0;
                        correct_assertions = 0;
                        appendElement(
                            "div",
                            "",
                            ["results", "observations-section" + i + x],
                            document.getElementsByClassName("observations" + i + x)[0]
                        );
                    }

                    if (!tip.allCorrect && thisTest.correct) {
                        tipHasCorrectTest = true;
                        if (!document.getElementById("correct-tip" + i + x)) {
                            // TODO: What's this for?
                        }
                    }
                    
                    if (thisTest.correct) {
                        correct_assertions += 1;
                        if (allFeedback || tip.allCorrect) {
                            appendElement(
                                "p",
                                "✔",
                                "data",
                                document.getElementsByClassName("observations-section" + i + x)[0]
                            );
                            appendElement(
                                "p",
                                testPoints + "Tests Passed! " + thisTest.feedback,
                                ["data", "assertion"],
                                document.getElementsByClassName("observations-section" + i + x)[0]
                            );
                            appendElement(
                                "br",
                                null,
                                null,
                                document.getElementsByClassName("observations-section" + i + x)[0]
                            );
                        }
                    } else { // Non-r class failing cases.
                        appendElement(
                            "p",
                            "✖",
                            "data",
                            document.getElementsByClassName("observations-section" + i + x)[0]
                        );
                        incorrect_assertions += 1;
                        appendElement(
                            "p",
                            testPoints + "Error Found! " + thisTest.feedback,
                            ["data", "assertion"],
                            document.getElementsByClassName("observations-section" + i + x)[0]
                        );
                        appendElement(
                            "br",
                            null,
                            null,
                            document.getElementsByClassName("observations-section" + i + x)[0]
                        );
                    }
                } else { // TESTS WITH CLASS 'r'
                    if (document.getElementsByClassName("tests-section" + i + x[0]) !== []) {
                        incorrect_tests = 0;
                        correct_tests = 0;
                        appendElement(
                            "div",
                            "",
                            ["results", "tests-section" + i + x],
                            document.getElementsByClassName("observations" + i + x)[0]
                        );
                    }
                    if (thisTest["correct"] === true && tip["allCorrect"] === false) {
                        tipHasCorrectTest = true;
                        if (!document.getElementById("correct-tip" + i + x)) {
                            // TODO: This?
                        }
                    }

                    if (thisTest.correct) {
                        correct_tests += 1;
                    } else {
                        incorrect_tests += 1;
                    }

                    var htmlString, string_reporter, testSectionDiv;
                    
                    string_reporter = document.createElement("div")
                    string_reporter.classList.add("data", "assertion");
                    
                    if (thisTest.correct) {
                        if ((allFeedback) || tip.allCorrect) {
                            appendElement(
                                "p",
                                "✔",
                                "data",
                                document.getElementsByClassName("tests-section" + i + x)[0]
                            );
                            
                            htmlString = [
                                '<p class="data assertion">',
                                testPoints + thisTest.feedback,
                                ' The <p class="data assertion bold">input: ',
                                thisTest.input,
                                '</p>'
                            ].join('');
                            /*if (typeof thisTest.expOut === "function") {
                            //if (thisTest.expOut.constructor !== Function) {
                                htmlString += [
                                    '<p class="data assertion">, returned the </p>',
                                    '<p class="data assertion bold">expected value: ',
                                    thisTest.expOut,
                                    '</p>'
                                ].join('');
                            } else {
                                htmlString += '<p class="data assertion">passed the tests.</p>';
                            }*/
                            htmlString += '<p class="data assertion">passed the tests.</p>';
                            string_reporter.innerHTML = htmlString;
                            // TODO: Clean up this...
                            document.getElementsByClassName(
                                "tests-section" + i + x
                            )[0].appendChild(string_reporter);
                            appendElement(
                                "br",
                                null,
                                null,
                                document.getElementsByClassName("tests-section" + i + x)[0]
                            );
                        }
                    } else {
                        appendElement(
                            "p",
                            "✖",
                            "data",
                            document.getElementsByClassName("tests-section" + i + x)[0]
                        );

                        string_reporter.classList.add("data", "assertion");
                        // TODO Clean these strings up.
                        htmlString = [
                            '<p class="data assertion">',
                            testPoints + thisTest.feedback,
                            ' The <p class="data assertion bold">input: ',
                            thisTest.input,
                            '</p> '
                        ].join('');
                        
                        // Don't show "expected output" if the output check is
                        // a custon JS function (where no output type is known.)
                        if (thisTest.expOut && thisTest.expOut.constructor !== Function) {
                            htmlString += [
                                '<p class="data assertion">did <em>not</em> return the </p>',
                                '<p class="data assertion bold">expected value: ',
                                thisTest.expOut
                            ].join('');
                        }
                        if (thisTest.output === null) {
                            htmlString += [
                                '<p class="data assertion"> did <em>not</em> return the expected value.</p>',
                                ''
                            ].join('');
                            htmlString += '<p class="data assertion"> Instead it returned no output.</p>';
                        } else {
                            htmlString += '<p class="data assertion bold">output: ' + thisTest.output + '</p>';
                        }
                        string_reporter.innerHTML = htmlString;
                        document.getElementsByClassName(
                            "tests-section" + i + x
                        )[0].appendChild(string_reporter);

                        appendElement(
                            "br",
                            null,
                            null,
                            document.getElementsByClassName("tests-section" + i + x)[0]
                        );
                    } // 'r' test cases
                } // end adding test div

                if (tip.rank === currRank || tip.rank !== 0) {
                    if (!tip.allCorrect) {
                        break tipLoop;
                    } else {
                        currRank += 1;
                    }
                }
            } // end j loop
        } // end x loop
    } // end i loop
    
    if (document.getElementsByClassName("incorrectans")[0] !== undefined) {
        document.getElementsByClassName("incorrectans")[0].click();
    }
    correct_width = document.getElementById("correct-section").offsetWidth;
    incorrect_width = document.getElementById("incorrect-section").offsetWidth;
    popup_width = document.getElementById("ag-results").offsetWidth - 60; // TODO: make the subtracted value work for any padding values
    if (document.getElementsByClassName("incorrectans")[0] !== undefined) {
        document.getElementsByClassName("incorrectans")[0].click();
    }

    var correct_section = document.getElementById('correct-section');
    var correct_section_style = window.getComputedStyle(correct_section);
    var correct_section_display = correct_section_style.getPropertyValue('display');

    var incorrect_section = document.getElementById('incorrect-section');
    var incorrect_section_style = window.getComputedStyle(incorrect_section);
    var incorrect_section_display = incorrect_section_style.getPropertyValue('display');

    if ((correct_width + incorrect_width) <= popup_width) {
        if (correct_section_display !== "none") {
            correct_section.style.display = "inline-block";
        }
        if (incorrect_section_display !== "none") {
            incorrect_section.style.display = "inline-block";
        }
    } else {
        if (correct_section_display !== "none") {
            correct_section.style.display = "default";
        }
        if (incorrect_section_display !== "none") {
            incorrect_section.style.display = "default";
        }
    }

    if (numtips !== 1) {
        plural = "s";
    }

    var problemPlural = "";
    var problemPoints = "";
    if (showPoints) {
        if (log["totalPoints"] !== 1) {
            problemPlural = "s";
        } 
        log["totalPoints"] = Math.round(log["totalPoints"]);
        problemPoints = " (" + log["totalPoints"] + " possible point" + problemPlural + ") ";
    }

    document.getElementById("comment").innerHTML = "We have " + String(numtips) + " tip" + plural + " for you!" + problemPoints;

    onclick_menu.style.right = menu_right;
    button.style.right = button_right;
    document.getElementById("numtips").innerHTML = String(numtips) + " tip" + plural;
    var tipwidth = document.getElementById("numtips").offsetWidth;

    // TODO: Fix this or document why corercion is needed.
    onclick_menu.style.right = String(Number(menu_right.slice(0, menu_right.length - 2)) + tipwidth - 2) + "px";
    
    button.style.right = String(Number(button_right.slice(0, button_right.length - 2)) + tipwidth - 2) + "px";

    button.style.borderRadius = "0px";

    var toggleButton = document.getElementById("toggle-correct");
    if (tipHasCorrectTest) {
        toggleButton.style.display = "block";
    } else {
        toggleButton.style.display = "none";
    }

    if (!isEDX) {
        var noCreditWarning = document.createElement("p");
        var noCreditText = document.createTextNode("Please note you won't receive a score from edX for attempting this problem.");
        noCreditWarning.appendChild(noCreditText);
        document.getElementById("comment").appendChild(noCreditWarning);
        openResults();
    }
}