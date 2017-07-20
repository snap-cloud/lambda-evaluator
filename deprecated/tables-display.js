/*
    This was code from the original view that displayed tables.
*/

function addBasicHeadings() {
    basicCols = ["Test", "Points", "Feedback"];
    for (i=0; i < basicCols.length; i++) {
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

/*
    TODO: Add documentation
*/
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceall(string, find, replace) {
    return (string.replace(new RegExp(escapeRegExp(find), 'g'), replace));
}

function makeOverlayButton() {
    var grade_button = $("#autograding_button");
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

/*
    TODO: Restore this when appropriate.
*/
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

    $(SELECT.dropdwn).prepend(menu_divider);
    $(SELECT.dropdwn).prepend(prev_feedback);
}
