/*
* Makes AG status bar reflect the ungraded state of the outputLog.
*/

// Store all the data about the feedback bar in one place that can be updated.
var FeedbackDisplay = {
    // JQuery selectors. (Will need to update the rest of the file.)
    selectors: {
        // The entire nav bar div
        header_background: '#ag-header',
        // Specific 'Get Feedback' button element
        ag_button: '#autograding_button',
        // Button + menu items Formerly 'ag-action-menu'
        ag_menu: '#ag-menu-group',
        // Formerly .bubble
        dropdown: '.dropdown-menu',
        revert_button: '#revert-button',
        undo_button: '#undo-button',
        reset_button: '#reset-button',
        status_button: '#numtips', // FIXME
        help_button: '#help-button',
        ag_html_output: '#comment',
        toggle_correct_button: '#toggle-correct-button'
    }
};

var SELECT = FeedbackDisplay.selectors;

// TODO: Pull out first 6 lines in a shared function
function AG_bar_ungraded(outputLog) {
    var button_text = "Get Feedback ";
    var button_elem = $('#autograding_button');
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }
    
    if (sessionStorage.getItem(outputLog.taskID + "_test_log")) {
        // TODO: Set the number of tips
        // This is currently a no-op
        $('#feedback-button').html("View Previous Feedback");
    }
}

/*
 * Makes AG status bar reflect the graded state of the outputLog. This
 * only occurs when all tests on the outputLog have passed.
 */
function AG_bar_graded(outputLog) {
    var button_text = "Get Feedback";
    var button_elem = $(SELECT.ag_button);
    var regex = new RegExp(button_text,"g");
    if (button_elem.html().match(regex) !== null) {
        return;
    }

    button_elem.html(button_text);
    // TODO: FIXME:
    // button_elem.css('background', '#29A629');
    // $('#ag-action-menu').css('color', 'white');
    // $('#feedback-button').html("Review Feedback");
}

/*
 * Makes AG status bar reflect the semi graded state of the outputLog. 
 * This is called when any test on the outputLog fails.
 */
function AG_bar_semigraded(outputLog) {
    var button_text = "Get Feedback";
    var button_elem = $(SELECT.ag_button);
    var regex = new RegExp("FEEDBACK","g");
    var num_errors = outputLog.testCount - outputLog.numCorrect;
    if (button_elem.html().match(regex) !== null) {
        return;
    }

    button_elem.html(button_text);
    setVisualGradedState('incorrect');
}

function AG_bar_nograde() {
    var button_text = "NOT GRADED";
    var button_elem = $(SELECT.ag_button);
    button_elem.html(button_text);
    button_elem.css({
        "background": "gray",
        "cursor": "default",
        'pointerEvents': 'none'
    });
}

/*
    Replace a blockSpec with a generated scriptPic of the block. If a pic isn't
    found, use <code> tags.
    Note: This should be used before DISPLAYING HTML, but not for the stuff
    that will be logged to a DB.
    @param{string} blockSpec
    @param{string} hintHTML
    @returns{string} html with the blockSpec replaced.
*/
function createBlockIamges(blockSpec, hintHTML) {
    var blockImg = AG_UTIL.specToImage(blockImg),
        regexp = new RegExp(blockSpec, 'gi');

    return hintHTML.replace(regexp, blockImg);
}

/*
    TODO: Rename these functions
*/
function openPopup() {
    $('#overlay').removeClass("hidden");
}

function closePopup() {
    $('#overlay').addClass("hidden");
}

// TODO: Make this simply `toggleResults`
function openResults() {
    // TODO: There should be a safer way of getting this.
    var numTips = $('.tips-msg .badge').text();
    if (numTips == "0") {
        alert('No tips yet! Try clicking "Get Feedback".');
    }
    $('#ag-output').show();
}

// TODO: Replace this function with just `toggleResults`
function closeResults() {
    $('#ag-output').hide();
}

//////////////////////////////////

function grayOutButtons(snapWorld, taskID) {
    var ide = snapWorld.children[0];
    var curr_xml = ide.serializer.serialize(ide.stage);
    // Retrieve previously graded Snap XML strings (if in sessionStorage).
    var c_prev_xml = sessionStorage.getItem(taskID + "_c_test_state");
    var prev_xml = sessionStorage.getItem(taskID + "_test_state");

    var revert_button = $("#revert-button");
    if (c_prev_xml === null || isSameSnapXML(c_prev_xml, curr_xml)) {
        revert_button.addClass('disabled');
    } else {
        revert_button.removeClass('disabled');
    }

    var undo_button = $("#undo-button");
    if (prev_xml === null || isSameSnapXML(prev_xml, curr_xml)) {
        undo_button.addClass('disabled');
    } else {
        undo_button.removeClass('disabled');
    }
}

/*
    Create the function bindings for when various elements are clicked.
*/
function initializeButtonMouseListeners(snapWorld, taskID) {
    // TODO: Reduce the scope of this?
    $(document).click(function() {
        grayOutButtons(snapWorld, taskID);
    });
    $("#reset-button").click(function () {
        resetState(snapWorld, taskID);
    });
    $("#revert-button").click(function (e) {
        // revertToBestState(snapWorld, taskID);
    });
    $("#undo-button").click(function (e) {
        // revertToLastState(snapWorld, taskID);
    });
    // $('#initial-help').click(function(e) {
    //     closeInitialHelp();
    // });
    $('#overlay').click(function(e) {
        closePopup();
    });
    $("#ag-output").click(function(e) {
        if (!(document.getElementById('ag-results').contains(e.target)) && e.target.className.indexOf("regrade") === -1) {
            closeResults();
        }
    });

    $(SELECT.dropdown).mouseover(moveHelp);
}

function initializeSnapAdditions(snapWorld, taskID) {
    var prevFeedbackButton = false, ide;

    // TODO: renable soon
    // if (!hasShownInitalHelp()) {
    //     createInitialHelp();
    //     moveHelp();
    // }

    // TODO: Renable at some point showPrevFeedback is always false.
    // if (showPrevFeedback && !prevFeedbackButton) {
    //     previousFeedbackButton();
    //     prevFeedbackButton = true;
    // }

    var pageLocation = JSON.parse(
        sessionStorage.getItem(taskID + "pageLocation")
    );

    if (pageLocation) {
        parent.window.scrollTo(pageLocation[0], pageLocation[1]);
        sessionStorage.removeItem(taskID + "pageLocation");
    }

    ide = snapWorld.children[0];

    // Load a starter file.
    setTimeout(function() {
        // If page has already been loaded, restore previously tested XML
        // TODO: Separate this into its own function.
        // Moved this into the timeout so that keys in session storage have time to be set from setstate in AGEDX before they are called
        var prev_xml = sessionStorage.getItem(taskID + "_test_state");
        var starter_xml = sessionStorage.getItem(taskID + "starter_file");
        if (prev_xml !== null) {
            ide.openProjectString(prev_xml);
        } else if (preReqTaskID !== null) {
            if (preReqLog !== null && preReqLog.allCorrect) {
                ide.openProjectString(sessionStorage.getItem(preReqID));
            }
        } else if (starter_xml) {
            ide.openProjectString(starter_xml);
            sessionStorage.removeItem(taskID + "starter_file");
        } else if (starter_path) {
            ide.showMessage('Loading the starter file.');
            $.get(
                starter_path,
                function(data) {
                    ide.openProjectString(data);
                }, 
                "text"
            );
        }
    }, 500);

    // if (showPrevFeedback) {
    //     $("#feedback-button").click(function() { openResults(); });
    // }

    initializeButtonMouseListeners(snapWorld, taskID);

    // TODO: Write this in HTML directly
    setTimeout(function() {
        var button = $('<button>').attr({
            'class': 'btn btn-info isOff',
            'id': 'toggle-correct-button',
            'title': 'Coming Soon'
        }).html('See Correct Tests');

        $("#toggle-correct-tests").append(button).append(
            $('<div>').attr({'id': 'correct-table-wrapper'})
        );

        // TODO: explain this line.
        // if (!graded) {return; }
    }, 1000);

    setTimeout(function() {
        var outputLog,
            prev_log = JSON.parse(sessionStorage.getItem(taskID + "_test_log"));

        if (prev_log) {
            outputLog = prev_log;
        } else {
            // Not sure if this is the best place...
            outputLog = AGStart(snapWorld, taskID);
        }

        // for some reason, the for loop in populateFeedback doesn't increment
        // correctly the first time it is run, so populateFeedback has to be
        // called twice at the very beginning...
        if (showFeedback && sessionStorage.getItem(taskID + "_popupFeedback") !== null) {
            populateFeedback(outputLog); 
            populateFeedback(outputLog);
            // openResults();
            sessionStorage.removeItem(taskID + "_popupFeedback");
        }
        grayOutButtons(snapWorld, taskID);

        // TODO: extract this.
        // Sets each 'test content' piece to have a max-width, but WHY?
        var tip_tests = $(".data"),
            offsetWidth = $(".inner-titles");
            if (offsetWidth.length) {
                offsetWidth = offsetWidth[0].offsetWidth - 50 + "px";
                for (var i = 0; i < tip_tests.length; i += 1) {
                    $(tip_tests[i]).css('max-width', offsetWidth);
                }
        }
    }, 1500);
}

// Call the test suite when this element is clicked.
// TODO: Rename this and cleanup outputLog
var update_listener = function() {
    // TODO: Why is `var` here?
    var outputLog = AGUpdate(world, id);
};

// Called from "Get Feedback" Button -- begins test execution
function doExecAndDisplayTests(event) {
    event.stopPropagation();
    var numAttempts = setNumAttempts(id);
    outputLog = new FeedbackLog(world, id, numAttempts);
    outputLog.numAttempts += 1;
    runAGTest(world, id, outputLog);

    // TODO: extract and document this...
    var tip_tests = document.getElementsByClassName("data"),
        offsetWidth = $(".inner-titles");
    if (offsetWidth.length) {
        offsetWidth = offsetWidth[0].offsetWidth - 50 + "px";
        for(var i = 0; i < tip_tests.length; i++) {
            tip_tests[i].style.maxWidth = offsetWidth;
        }
    }
    sessionStorage.setItem(id + "_popupFeedback", '');
}

/*
    TODO: Rewrite this with jQuery. 
    Then, probably remove this from use
*/
function appendElement(elem, text, elemClass, selector) {
    var data = document.createElement(elem);
    if (text !== null) {
        data.innerHTML = text;
    }
    if (Array.isArray(elemClass)) {
        DOMTokenList.prototype.add.apply(data.classList, elemClass);
    } else if (elemClass !== null) {
        data.classList.add(elemClass);
    }
    selector.appendChild(data);
}

function createCorrectIncorrectGrouping(sectName) {
    var text_content = {
        correct: 'Nice work! Here are passing tests:',
        incorrect: 'Here are some test cases you should review:'
    },
    div = $('<div>')
        .html(text_content[sectName])
        .attr('id', sectName + '-section')
        .css({display: 'none'});

    $('#ag-results').append(div)
}

/*
    Sets the background color of the AG controls bar to the right color.
*/
function setVisualGradedState(status) {
    var statusClassBase = 'agStatus--'
    $(SELECT.status_button).removeClass (function (index, className) {
        return (className.match (/(^|\s)agStatus-\S+/g) || []).join(' ');
    });
    $(SELECT.status_button).addClass(statusClassBase + status);
}

/*
    
*/
function toggleCorrectTests() {
    var toggleButton = $(SELECT.toggle_correct_button), allFeedback;
    if (toggleButton.hasClass("isOff")) {
        toggleButton.removeClass("isOff");
        allFeedback = true;
        toggleButton.html("Hide Correct Tests");
    } else {
        toggleButton.addClass("isOff");
        allFeedback = false;
        toggleButton.html("Show Correct Tests");
    }

    // TODO: IMPROVE THIS
    // No need to redraw the entire table each time.
    populateFeedback(feedbackLog, allFeedback);
    setTimeout(function() {
        openResults();
    }, 100);
}
/*
    TODO: Update this to use jQuery, and maybe _.template() ?
    http://underscorejs.org/#template
    * This should be broken into at least a few functions
    * Cache all document.get*() calls which are used more than one
*/
function populateFeedback(feedbackLog, allFeedback, chunknum, tipnum) {
    // TODO: Declare move variables up here:
    var i, j, x;
    
    $("#toggle-correct-tests").click(toggleCorrectTests);

    var comment = document.getElementById("comment");
    comment.innerHTML = "";
    
    while (comment.nextSibling) {
        document.getElementById("ag-results").removeChild(comment.nextSibling);
    }

    var log = feedbackLog;
    var chunks = log.chunk_list;
    var linebreak = document.createElement("br");
    var numtips = 0;
    var chunkHasCorrectTip = false;
    var tipHasCorrectTest = false;

    var tipsDiv = document.getElementById("numtips");

    [ 'correct', 'incorrect' ].forEach(createCorrectIncorrectGrouping);

    // TODO: What is this doing? It seems redundant.
    var chunknum = typeof chunknum !== 'undefined' ? chunknum : undefined;
    var tipnum = typeof tipnum !== 'undefined' ? tipnum : undefined;
    
    // TODO: Break up these loops and document.
    for (i = 0; i < chunks.length; i++) {
        var chunk = chunks[i];

        var chunkPoints = "";
        if (showPoints) {
            chunkPoints = " ({0} possible {1}) ".format(
                chunk.totalPoints, pluralize('point', chunk.totalPoints));
        }

        var tips = chunk.tip_list;
        var header = document.createElement("p");
        header.innerHTML = chunk.chunk_title + chunkPoints + '<br><br>';
        
        header.classList.add("chunk-header", "chunk" + i);
        
        var correct_chunk = header.cloneNode(true);
        correct_chunk.classList.add("correct-chunk" + i);
        
        if (chunk.allCorrect) {
            document.getElementById("correct-section").style.display = "block";
            document.getElementById("correct-section").appendChild(correct_chunk);
        } else {
            var incorrect_chunk = header.cloneNode(true);
            incorrect_chunk.classList.add("incorrect-chunk" + i);
            document.getElementById("incorrect-section").style.display = "block";
            document.getElementById("incorrect-section").appendChild(incorrect_chunk);
        }

        var allFeedback = allFeedback !== undefined ? allFeedback : false;
        var currRank = 1;
        tipLoop:
        // TODO: Document this

        for (x = 0; x < tips.length; x++) {
            var tip = tips[x];
            var label_class = "incorrectans";
            var div = document.createElement("div");
            var current_chunk = document.getElementsByClassName("incorrect-chunk" + i)[0];
            if (tip.allCorrect) {
                document.getElementById("correct-section").style.display = "block";
                document.getElementById("correct-section").appendChild(correct_chunk);
                current_chunk = document.getElementsByClassName("correct-chunk" + i)[0];
                label_class = "correctans";
                var suggestion = tip.complement;
            } else {
                numtips += 1;
                var suggestion = tip.suggestion;
            }

            var tipPoints = "";

            // TODO: Clean this up
            // TODO: Use a button and bootstrap collapse.
            div.innerHTML = '<input class="details" id="expander' + i + x + '" type="checkbox" ><label class="' + label_class + '" for="expander' + i + x + '">' + tipPoints + suggestion + '</label><div id="table-wrapper' + i + x + '">';

            current_chunk.appendChild(div);
            var details = document.getElementById("table-wrapper" + i + x);
            details.previousSibling.click();
            var allTests = tip.test_list;
            appendElement(
                "p",
                "",
                ["inner-titles", "observations" + i + x ],
                details
            );

            for (j = 0; j < allTests.length; j++) {
                var newRow = document.createElement("tr");
                var thisTest = allTests[j];
                var testPoints = showPoints ? "({0}) ".format(
                        pluralizeWithNum('point', thisTest.points)
                    ) : '';
                
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
                        // TODO: Consider removing this conditional and always showing the test.
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
                            testPoints + thisTest.feedback,
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
                    if (thisTest.correct && !tip.allCorrect) {
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
                    
                    // TODO: Try extracting this out.
                    if (thisTest.correct) {
                        // TODO: FIX THE CSS LIST HERE
                        // passing-test-case is used for the show/hide button
                        if (allFeedback || tip.allCorrect) {
                            appendElement(
                                "p",
                                "✔",
                                ["data", "passing-test-case"],
                                document.getElementsByClassName("tests-section" + i + x)[0]
                            );
                            // TODO Clean these strings up.
                            var input = thisTest.input;
                            if (input instanceof List || input instanceof Array) {
                                input = arrayFormattedString(input);
                            }
                            
                            htmlString = [
                                '<p class="data assertion">',
                                testPoints + thisTest.feedback,
                                ' The input: <code class="data assertion">',
                                input,
                                '</code>'
                            ].join('');
                            if (thisTest.expOut.constructor !== Function) {
                                var expOut = thisTest.expOut;
                                if (expOut instanceof List || expOut instanceof Array) {
                                    expOut = arrayFormattedString(expOut);
                                }
                                htmlString += [
                                    '<p class="data assertion">, returned the',
                                    ' expected value: <code class="data assertion">',
                                    expOut,
                                    '</code></p>'
                                ].join('');
                            } else {
                                htmlString += '<p class="data assertion">passed the tests.</p>';
                            }
                            // TODO: Make a block ==> image call here!
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
                        var input = thisTest.input;
                        if (input instanceof List || input instanceof Array) {
                            input = arrayFormattedString(input);
                        }
                        
                        htmlString = [
                            '<p class="data assertion">',
                            testPoints + thisTest.feedback,
                            'The input: <code>',
                            input,
                            '</code></p> '
                        ].join('');
                        
                        // Don't show "expected output" if the output check is
                        // a custon JS function (where no output type is known.)
                        if (thisTest.expOut && thisTest.expOut.constructor !== Function) {
                            var expOut = thisTest.expOut;
                            if (expOut instanceof List || expOut instanceof Array) {
                                expOut = arrayFormattedString(expOut);
                            }
                            htmlString += [
                                '<p class="data assertion">did <em>not</em> return the',
                                ' expected value: ',
                                '<code>', expOut, '</code></p>'
                            ].join('');
                        }
                        if (thisTest.output === null) {
                            htmlString += [
                                '<p class="data assertion"> did <em>not</em> return the expected value.</p>',
                                ''
                            ].join('');
                            htmlString += '<p class="data assertion"> Instead it returned no output.</p>';
                        } else {
                            var output = thisTest.output;
                            if (output instanceof List || output instanceof Array) {
                                output = arrayFormattedString(output);
                            }
                            htmlString += '<p class="data assertion">output: <code>' + output + '</code></p>';
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
                    // TODO: document this....
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
    popup_width = document.getElementById("ag-results").offsetWidth - 60;
    // TODO: make the subtracted value work for any padding values
    
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

    var problemPoints = '';
    if (showPoints) {
        problemPoints = " ({0} possible {1}) ".format(
            log.totalPoints, pluralize('point', Math.round(log.totalPoints))
        );
    }

    var tipText;
    if (numtips === 0) {
        tipText = 'Awesome work! You passed all tests.';
    } else {
        tipText = "We have {0} for you! ".format(
            pluralizeWithNum('tip', numtips)
        );
    }
    $("#comment").html(tipText + problemPoints);

    // TODO Make a function for this.
    tipsDiv.innerHTML = '<span class="badge">{0}</span>'.format(numtips) + pluralize('tip', numtips);

    if (tipHasCorrectTest) {
        $(SELECT.toggle_correct_button).show();
    }

    openResults();
}
