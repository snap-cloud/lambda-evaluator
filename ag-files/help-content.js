// All utilities relating to displaying or manipulating autograder
// help functionality.

function closeInitialHelp() {
    var initial_overlay = document.getElementById("initial-help");
    initial_overlay.classList.add("hidden");
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

    var arrow = document.getElementById("ag-button-arrow"), 
        arrow_clone = arrow.cloneNode(true);
    var help = document.getElementById("ag-button-help"), 
        help_clone = help.cloneNode(true);

    arrow_clone.id = "initial-ag-button-arrow";
    help_clone.id = "initial-ag-button-help";

    document.getElementById("initial-help").appendChild(arrow_clone);
    document.getElementById("initial-help").appendChild(help_clone);
    
    setInitialHelpDisplay(true);
}

function moveHelp() {
    var pos = $(SELECT.dropdown).offset();
    var menu_pos = $("#ag-action-menu").offset();

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
