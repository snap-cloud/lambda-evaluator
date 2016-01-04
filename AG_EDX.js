// var courseID = "";  // e.g. "BJCx"
// // taskID uniquely identifies the task for saving in browser localStorage.
// var taskID = "AG_D1_T1";
// var id = courseID + taskID;

var AG_state = {
    'checkState': false,
    'comment': "Please run the Snap! Autograder to view feedback.",
    'feedback': {}
};

var AG_EDX = (function() {
    var channel;

    if (window.parent !== window) {
        channel = Channel.build({
            window: window.parent,
            origin: "*",
            scope: "JSInput"
        });

        channel.bind("getGrade", getGrade);
        channel.bind("getState", getState);
        channel.bind("setState", setState);
    }

    // The following return value may or may not be used to grade
    // server-side.
    // If getState and  are used, then the Python grader also gets
    // access to the return value of getState and can choose it instead to
    // grade.
    function getGrade() {
        console.log("getGrade");
        // console.log("THE ID IS: " + id);
        if (sessionStorage.getItem(id + "_test_log") !== null){
            var glog = JSON.parse(sessionStorage.getItem(id + "_test_log"));
            var snapXML = sessionStorage.getItem(id + "_test_state");
            // console.log(snapXML);
            //Save Snap XML in Local Storage
            // localStorage.setItem(id, xmlString); 
            //If AGTest() has been called, save the gradeLog in 
            if (glog !== undefined) {
                //Convert to an AG_state
                glog["showFeedback"] = showFeedback;
                //var edx_log = AG_log(glog, snapXML);
                var edx_log = glog;
                edx_log["snapXML"] = snapXML;
            }
            console.log("GET GRADE SUCCEEDING");
            return encodeURIComponent(JSON.stringify(edx_log));
        } else {
            return JSON.stringify(AG_state);
        }
    }

    function getState() {
        console.log("getState");

        var graded_xml = sessionStorage.getItem(id + "_test_state");
        var graded_log = sessionStorage.getItem(id + "_test_log");
        var correct_xml = sessionStorage.getItem(id + "_c_test_state");
        var correct_log = sessionStorage.getItem(id + "_c_test_log");

        if (!graded_xml || !graded_log) {
            return 'never graded';
        }

        var output = {
            out_log: graded_log,
            state: encodeURIComponent(graded_xml)
        };

        if (correct_xml && correct_log) {
            output['c_log'] = correct_log;
            output['c_state'] = encodeURIComponent(correct_xml);
        }

        return encodeURI(JSON.stringify(output));
    }

    // EDX: Used to save the world state into edX. FOR RELOAD
    function setState() {
        console.log('SET STATE IS CALLED');
        var last_state_string = arguments.length === 1 ? arguments[0] : arguments[1];

        // TODO: Migrate conditional to switch / case
        if (last_state_string === 'starter file') {
            var starter_xml = $.get(
                starter_path,
                function(data) {
                    sessionStorage.setItem(id + "starter_file", data)
                },
                "text"
            ); // TODO: Loading here still unsafe
            return;
        } else if (last_state_string === 'never graded') {
            return;
        } else if (last_state_string === 'no starter file') {
            return;
        } else {
            var last_state = JSON.parse(last_state_string);
            last_state.state = decodeURIComponent(last_state.state);
            sessionStorage.setItem(id + '_test_state', last_state.state);
            sessionStorage.setItem(id + '_test_log', last_state.out_log);
            if (last_state.c_state && last_state.c_log) {
                sessionStorage.setItem(
                    id + '_c_test_state',
                    decodeURIComponent(last_state.c_state)
                );
                sessionStorage.setItem(id + '_c_test_log', last_state.c_log);
            }
            console.log("submitted...");
        }
    }
    
    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade
    };
}());