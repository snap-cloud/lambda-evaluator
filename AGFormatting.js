 /*
 * Makes AG status bar reflect the ungraded state of the outputLog.
 */
function AG_bar_ungraded(outputLog) {
    var button_text = "GRADE";
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
    document.getElementById("different-feedback").innerHTML = "This feedback does not match what is in the scripting area."
}

/*
 * Makes AG status bar reflect the graded state of the outputLog. This
 * only occurs when all tests on the outputLog have passed.
 */
function AG_bar_graded(outputLog) {
    var button_text = "TESTS PASS";
    var button_elem = $('#autograding_button span');
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }
    button_elem.fadeOut('fast', function() {
        button_elem.html(button_text);
        button_elem.slideDown('fast');
        $('#autograding_button').css('background', '#29A629');
    });
    $('#autograding_button .hover_darken').hide();
    $('#onclick-menu').css('color', 'white');
    $('#feedback-button').html("Review Feedback");
}
/*
 * Makes AG status bar reflect the semi graded state of the outputLog. 
 * This is called when any test on the outputLog fails.
 */
function AG_bar_semigraded(outputLog) {
    var button_text = "&#x2770&#x2770 FEEDBACK";
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
    button_elem.fadeOut('fast', function() {
        button_elem.html(button_text);
        button_elem.slideDown('fast');
        $('#autograding_button').css('background', 'red');
    });
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

function openPopup(){
    var overlay = document.getElementById('overlay');
    overlay.classList.remove("is-hidden");
}

function closePopup(){
    var overlay = document.getElementById('overlay');
    overlay.classList.add("is-hidden");
}

function openResults(){
    var overlay = document.getElementById('ag-output');
    overlay.classList.remove("is-hidden");
}

function closeResults(){
    var overlay = document.getElementById('ag-output');
    overlay.classList.add("is-hidden");
}

function populateFeedback(outputLog) {
    var taskID = outputLog.taskID;
    //var last_log = sessionStorage.getItem(taskID + "_last_submitted_log");
    var prev_log = sessionStorage.getItem(taskID + "_test_log");
    var edx_caution = document.getElementById("edx-submit-different");
    var caution = document.getElementById("different-feedback");

    console.log(outputLog);
    var glog = outputLog;
    var log = AG_log(glog);
    var feedback = log["feedback"];
    var title = log["comment"];

    console.log(feedback);

    // Wipes the feedback clean, including if it has been populated before. 
    caution.innerHTML = "";
    edx_caution.innerHTML = "";
    document.getElementById("comment").innerHTML = "";
    var tableTitles = document.getElementsByClassName("titles");
    var tableResults = document.getElementById("table-data");
    var repTableResults = document.getElementById("reporter-table-data");
    while (tableResults.children.length > 1) {
        tableResults.removeChild(tableResults.children[1]);
    }
    while (repTableResults.children.length > 1) {
        repTableResults.removeChild(repTableResults.children[1]);
    }

    document.getElementById("comment").innerHTML = title;

    // Checks if the grading button has been clicked
    if (title === "Please run the Snap! Autograder to view feedback.") {
        document.getElementById("table-data").style.display = "none";
        document.getElementById("reporter-table-data").style.display = "none";
    } else {
        document.getElementById("table-data").style.display = "table";
        document.getElementById("reporter-table-data").style.display = "table";
        document.getElementById("comment").innerHTML += " (" + String(Math.round(feedback["totalPoints"] * feedback["pScore"])) + "/" + String(feedback["totalPoints"]) + ")";
    }


    // Warnings for when student's feedback differ from what's on the scripting area/what's been submitted to edX
    //document.getElementById("comment").innerHTML = title + "(" + String(Math.round(feedback["totalPoints"] * feedback["pScore"])) + "/" + String(feedback["totalPoints"]) + ")";
    /*if (!last_log) {
        edx_caution.innerHTML = "[WARNING: You have not submitted your results to edX yet.]"
    }
    else if (last_log !== prev_log) {
        edx_caution.innerHTML = "[WARNING: These results differ from your last edX submission.]"
    }*/

    var nonRepTest = 1;
    var repTest = 1;
    for (i=1; i<=feedback["testCount"]; i++) {
        var test = String(i);
        console.log(test);
        var newRow = document.createElement("tr");

        // If test is not a reporter test, only add columns for Test # and Feedback
        if (feedback[test]["testClass"] !== "r") {
            if (document.getElementsByClassName("non-reporter").length === 0) {
                addBasicHeadings();
            }
            addTableCell(String(nonRepTest), "tests", newRow);
            if (nonRepTest % 2 === 0) {
                addTableCell(feedback[test]["pointValue"], ["data", "evens"], newRow);
            } else {
                addTableCell(feedback[test]["pointValue"], "data", newRow);
            }
            nonRepTest += 1;
        }

        // If test is a reporter test, add all columns, including input, output, and expected. Makes the background of every other row light gray.
        if (feedback[test]["testClass"] === "r") {
            if (document.getElementsByClassName("reporter").length === 0) {
                addReporterHeadings();
            }
            addTableCell(String(repTest), "tests", newRow);
            var keys = ["pointValue", "blockSpec", "input", "output", "expOut"];
            for (key=0; key<keys.length; key++) {
                if (keys[key] === "blockSpec") {
                    var blockSpec = feedback[test][keys[key]];
                    // var blockSpecSliced = blockSpec.slice(2, blockSpec.length - 2);
                    // console.log(blockSpecSliced);
                    if (repTest % 2 === 0) {
                        addTableCell(blockSpec, ["data", "evens"], newRow);
                    } else {
                        addTableCell(blockSpec, "data", newRow);
                    }
                } else {
                    if (repTest % 2 === 0) {
                        addTableCell(feedback[test][keys[key]], ["data", "evens"], newRow);
                    } else {
                        addTableCell(feedback[test][keys[key]], "data", newRow);
                    }
                }
            }
            repTest += 1;
        }

        // If test is correct, make the feedback appropriately colored. 
        if (feedback[test]["correct"] === true) {
            addTableCell(feedback[test]["feedback"], "correctans", newRow);
            if (regradeOn) {
                addRegradeButton("Regrade", ["data", "hidden"], newRow);
            }
        } else {
            addTableCell(feedback[test]["feedback"], "incorrectans", newRow);
            if (regradeOn) {
                addRegradeButton("Regrade", ["data", "regrade", test], newRow);
            }
        }

        if (feedback[test]["testClass"] === "r") {
            document.getElementById("reporter-table-data").appendChild(newRow);
        } else {
            document.getElementById("table-data").appendChild(newRow);
        }  
    }
    console.log(outputLog);
    //outputLog.saveLog();

    if (regradeOn) {
        // makes recently created regrade buttons clickable 
        var regrade_buttons = document.getElementsByClassName("regrade");
        for(var i=0; i<regrade_buttons.length; i++) {
            regrade_buttons[i].onclick = function() {
                var testId = this.classList[2];
                regradeOnClick(outputLog, testId);
            }
        }
    }
}

function addBasicHeadings() {
    basicCols = ["Test", "Points", "Feedback"];
    for (i=0; i<basicCols.length; i++) {
        var header = document.createElement("th");
        var text = document.createTextNode(basicCols[i]);
        //var lastCol = document.getElementById("reporter-last-column");
        var titles = document.getElementById("table-titles");
        header.classList.add("titles", "non-reporter");
        header.appendChild(text);
        titles.appendChild(header);
    }
}

function addReporterHeadings() {
    var columns = ["Test", "Points", "Block", "Input", "Output", "Expected", "Feedback"];
    for (i=0; i<columns.length; i++) {
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
    //Retrieve previously graded Snap XML strings (if in sessionStorage).
    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");

    /*var last_xml = sessionStorage.getItem(taskID + "_last_submitted_state");

    var last_submit = document.getElementById("last-submit");
    if (last_xml === null || isSameSnapXML(last_xml, curr_xml)) {
        last_submit.style.color = "#373737";
        last_submit.style.pointerEvents = "none";
        last_submit.parentNode.id = "disabled-button";
    } else {
        last_submit.parentNode.id = "enabled-button";
        last_submit.style.color = "white";
        last_submit.style.pointerEvents = "auto";
    }*/

    var revert_button = document.getElementById("revert-button");
    if (c_prev_xml === null || isSameSnapXML(c_prev_xml, curr_xml)) {
        //revert_button.parent.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        revert_button.style.pointerEvents = "none";
        revert_button.parentNode.id = "disabled-button";
    } else {
        revert_button.parentNode.id = "enabled-button";
        //revert_button.parent.style.backgroundColor = "white";
        revert_button.style.pointerEvents = "auto";
    }

    var undo_button = document.getElementById("undo-button");
    if (prev_xml === null || isSameSnapXML(prev_xml, curr_xml)) {
        //undo_button.parent.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        undo_button.style.pointerEvents = "none";
        undo_button.parentNode.id = "disabled-button";
    } else {
        undo_button.parentNode.id = "enabled-button";
        //undo_button.parent.style.backgroundColor = "white";
        undo_button.style.pointerEvents = "auto";
    }
}


function makeOverlayButton() {
    var overlay_button = parent.document.createElement('button');
    var overlay_button_text = parent.document.createTextNode('Grade');
    overlay_button.appendChild(overlay_button_text);
    overlay_button.id = 'overlay-button';
    var button =  parent.document.getElementsByName('problem_id')[id_problem];
    button.parentNode.insertBefore(overlay_button, button.nextSibling);
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
        //iframe.style.width = 'initial';
        iframe.style.height = '500px';
        iframe.style.zIndex = 'initial';
        button.className = "off";
        button.innerHTML = "Full-Screen";
        sessionStorage.removeItem(taskID + "full-screen-on");
        /*button.style.position = 'absolute';
        button.style.right = '31px';
        button.style.bottom = '225px';*/
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

IDE_Morph.prototype.originalToggleStageSize = IDE_Morph.prototype.toggleStageSize;
IDE_Morph.prototype.toggleStageSize = function (isSmall) {
    this.originalToggleStageSize(isSmall);
    setTimeout(function() {
        moveAutogradingBar()
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


function initializeSnapAdditions(snapWorld, taskID) {
    var reset_button = document.getElementById("reset-button");
    var revert_button = document.getElementById("revert-button");
    var undo_button = document.getElementById("undo-button");
    //var menu_button = document.getElementsByClassName("onclick-menu")[0];
    //var menu_button = document.getElementById("menu-icon");
    var menu_button = document.getElementsByClassName("hover_darken")[0];
    var help_overlay = document.getElementById('overlay');
    var feedback_button = document.getElementById("feedback-button");
    var results_overlay = document.getElementById("ag-output");
    var regrade_buttons = document.getElementsByClassName("regrade");
    var grade_button = document.getElementById("autograding_button");
    var world_canvas = document.getElementById('world');
    var snap_menu = document.getElementsByClassName('bubble')[0];


    document.addEventListener("click", function() { grayOutButtons(world, id); });
    snap_menu.addEventListener('click', popup_listener);
    //grade_button.addEventListener('click', button_listener);
    //world_canvas.addEventListener("mouseup", update_listener);
    reset_button.onclick = function() { resetState(world, id); toggleMenu(id); };
    revert_button.onclick = function() { revertToBestState(world, id); toggleMenu(id); };
    undo_button.onclick = function() { revertToLastState(world, id); toggleMenu(id); };
    menu_button.onclick = function() { toggleMenu(id); };
    feedback_button.onclick = function() {openResults(); };

    help_overlay.onclick = function(e) {
        closePopup();
    }

    /*help_overlay.onmousemove = function() {
        moveHelp();
    }*/

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

    $(".bubble").mouseover(function() {

        moveHelp();
        // .position() uses position relative to the offset parent, 
        // so it supports position: relative parent elements
        /*var pos = $(this).offset();


        //show the menu directly over the placeholder
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
        });*/
    });

    var button_text = parent.document.getElementsByClassName('check-label')[id_problem];
    button_text.innerHTML = "Submit";
}

//Call the test suite when this element is clicked.
var update_listener = function() {
    var outputLog = AGUpdate(world, id);
};
var button_listener = function(event) {
    event.stopPropagation();
    console.log('PROPAGATION SHOULD STOP');
    var numAttempts = setNumAttempts(id);
    outputLog = new gradingLog(world, id, numAttempts);
    outputLog.numAttempts += 1;
    runAGTest(world, id, outputLog);
}

function moveHelp() {
    var pos = $(".bubble").offset();

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
}












