// All utilities relating to displaying or manipulating autograder
// help functionality.



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
