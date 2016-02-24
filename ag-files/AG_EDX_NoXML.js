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
    // If getState and setState are used, then the Python grader also gets
    // access to the return value of getState and can choose it instead to
    // grade.
    function getGrade() {
        console.log("getGrade");
        //Grab Snap ide and testLog, null if AGTest() has not been called.
        //var ide = world.children[0];
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
                //edx_log["snapXML"] = snapXML;
                //console.log(JSON.stringify(edx_log));

                //saves correct student answer, as well as state, in case student returns to question
                //sessionStorage.setItem(id + "_last_submitted_log", sessionStorage.getItem(id + "_test_log"));
                //sessionStorage.setItem(id + "_last_submitted_state", snapXML);
                //localStorage.setItem(id + "_ag_output", JSON.stringify(edx_log));
            }
            console.log("GET GRADE SUCCEEDING");
            //console.log(encodeURIComponent(JSON.stringify(edx_log)));

            return encodeURIComponent(JSON.stringify(edx_log));
        } else {
            return JSON.stringify(AG_state);
        }
    }

    function getState() {
        console.log("getState");
        // return encodeURIComponent(JSON.stringify(AG_state));

        // if _test_state and _test_log exist
            // encode world and state
        // else
            // return 'never graded'

        var graded_xml = sessionStorage.getItem(id + "_test_state");
        var graded_log = sessionStorage.getItem(id + "_test_log");
        var correct_xml = sessionStorage.getItem(id + "_c_test_state");
        var correct_log = sessionStorage.getItem(id + "_c_test_log");
        /*var submit_xml = sessionStorage.getItem(id + "_last_submitted_state");
        var submit_log = sessionStorage.getItem(id + "_last_submitted_log");*/

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
        /*if (submit_xml && submit_log) {
            output['submit_log'] = submit_log;
            output['submit_state'] = encodeURIComponent(submit_xml);
        }*/
        //console.log(encodeURIComponent(correct_xml));
        output = encodeURI(JSON.stringify(output));
        console.log(decodeURI(output));
        return output;

        // var last_xml = localStorage.getItem(id + "_test_state");
        // if (last_xml !== null) {
        //     return encodeURI(encodeURIComponent(last_xml));
        // } else {
        //     var ide = world.children[0];
        //     var world_string = ide.serializer.serialize(ide.stage);
        //     return encodeURI(encodeURIComponent(world_string);
        // }

        // var ide = world.children[0];
        // var world_string = ide.serializer.serialize(ide.stage);
        // //return encodeURI(encodeURIComponent(world_string));
        // return encodeURI(world_string);
    }

    // EDX: Used to save the world state into edX. FOR RELOAD 
    function setState() {
        console.log('SET STATE IS CALLED');
        var last_state_string = arguments.length === 1 ? arguments[0] : arguments[1];
        //var ide = world.children[0];
        if (last_state_string === 'starter file') {
            var starter_xml = $.get(starter_path, function(data) {
                sessionStorage.setItem(id + "starter_file", data)
            }, "text"); // TODO: Loading here still unsafe
            return;
        } else if (last_state_string === 'never graded') {
            return;
        } else if (last_state_string === 'no starter file') {
            return;
        } else {
            var last_state = JSON.parse(last_state_string);
            //console.log(last_state);
            //console.log(last_state.out_log)
            last_state.state = decodeURIComponent(last_state.state);
            //console.log(last_state.out_log);
            sessionStorage.setItem(id + '_test_state', last_state.state);
            sessionStorage.setItem(id + '_test_log', last_state.out_log);
            if (last_state.c_state && last_state.c_log) {
                sessionStorage.setItem(id + '_c_test_state', decodeURIComponent(last_state.c_state));
                sessionStorage.setItem(id + '_c_test_log', last_state.c_log);
            }
            console.log("submitted...");
            /*if (last_state.submit_state && last_state.submit_log) {
                sessionStorage.setItem(id + '_last_submitted_state', decodeURIComponent(last_state.submit_state));
                sessionStorage.setItem(id + '_last_submitted_log', last_state.submit_log);
            }*/
        }





        // var last_xml = arguments.length === 1 ? arguments[0] : arguments[1];

        // var ide = world.children[0];
        // if (last_xml === "starter file") {
        //     var starter_xml = $.get(starter_path, function(data) {
        //         console.log(data);
        //         ide.openProjectString(data)}, "text");
        //     return
        // }
        // console.log(last_xml);
        // //var last_xml = arguments.length === 1 ? arguments[0] : arguments[1];
        // //state = JSON.parse(stateStr);

        // //ide.openProjectString(decodeURIComponent(last_xml));
        // ide.openProjectString(last_xml);

    }
    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade
    };
}());