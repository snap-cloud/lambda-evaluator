function initializeSnapAdditions(snapWorld, taskID) {
	var reset_button = document.getElementById("reset-button");
    var revert_button = document.getElementById("revert-button");
    var undo_button = document.getElementById("undo-button");
    var menu_button = document.getElementsByClassName("onclick-menu")[0];
    var help_overlay = document.getElementById('overlay');
    var feedback_button = document.getElementById("feedback-button");
    var results_overlay = document.getElementById("ag-output");
    var regrade_buttons = document.getElementsByClassName("regrade");
    var grade_button = document.getElementById("autograding_button");
    var world_canvas = document.getElementById('world');
    var snap_menu = document.getElementsByClassName('bubble')[0];


    document.addEventListener("click", function() { grayOutButtons(world, id); });
    snap_menu.addEventListener('click', popup_listener);
    grade_button.addEventListener('click', button_listener);
    world_canvas.addEventListener("mouseup", update_listener);
    reset_button.onclick = function() { resetState(world, id); toggleMenu(id); };
    revert_button.onclick = function() { revertToBestState(world, id); toggleMenu(id); };
    undo_button.onclick = function() { revertToLastState(world, id); toggleMenu(id); };
    menu_button.onclick = function() { toggleMenu(id); };
    feedback_button.onclick = function() {openResults(); };

    help_overlay.onclick = function(e) {
        if (!(document.getElementById('help-popup').contains(e.target))) {
            closePopup();
        }
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

    //Call the test suite when this element is clicked.
    var update_listener = function() {
        var outputLog = AGUpdate(snapWorld, taskID);
    };
    var button_listener = function(event) {
        event.stopPropagation();
        console.log('PROPAGATION SHOULD STOP');
        var numAttempts = setNumAttempts(id);
        outputLog = new gradingLog(snapWorld, taskID, numAttempts);
        outputLog.numAttempts += 1;
        runAGTest(snapWorld, taskID, outputLog);
    }

    var popup_listener = function(event) {
        event.stopPropagation();
    }

    $(".bubble").mouseover(function() {
        // .position() uses position relative to the offset parent, 
        // so it supports position: relative parent elements
        var pos = $(this).offset();


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
        });
    });
}