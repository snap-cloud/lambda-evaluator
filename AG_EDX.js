// var courseID = "";  // e.g. "BJCx"
// // taskID uniquely identifies the task for saving in browser localStorage.
// var taskID = "AG_D1_T1";
// var id = courseID + taskID;

var AG_state = {
    'checkState': false,
    'comment': "Please run the Snap Autograder before clicking the 'Submit' button.",
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
        //Grab Snap ide and testLog, null if AGTest() has not been called.
        var ide = world.children[0];
        // console.log("THE ID IS: " + id);
        if (localStorage.getItem(id + "_test_log") !== null){
            var glog = JSON.parse(localStorage.getItem(id + "_test_log"));
            var snapXML = localStorage.getItem(id + "_test_state");
            // console.log(snapXML);
            //Save Snap XML in Local Storage
            // localStorage.setItem(id, xmlString); 
            //If AGTest() has been called, save the gradeLog in 
            if (glog !== undefined) {
                //Convert to an AG_state
                var edx_log = AG_log(glog, snapXML);
                edx_log["snapXML"] = snapXML;
                console.log(JSON.stringify(edx_log));

                //saves correct student answer, as well as state, in case student returns to question
                localStorage.setItem(id + "_last_submitted_log", localStorage.getItem(id + "_test_log"));
                localStorage.setItem(id + "_last_submitted_state", snapXML);
                localStorage.setItem(id + "_ag_output", JSON.stringify(edx_log));
            }
            console.log("GET GRADE SUCCEEDING");
            console.log(encodeURIComponent(JSON.stringify(edx_log)));

            return encodeURIComponent(JSON.stringify(edx_log));
        } else {
            return JSON.stringify(AG_state);
        }



    }

    function getState() {
        // return encodeURIComponent(JSON.stringify(AG_state));
        /*var last_xml = localStorage.getItem(id + "_test_state");
        if (last_xml !== null) {
            return encodeURIComponent(last_xml);
        } else {
            var ide = world.children[0];
            var world_string = ide.serializer.serialize(ide.stage);
            return encodeURIComponent(world_string);
        }*/

        var ide = world.children[0];
        var world_string = ide.serializer.serialize(ide.stage);
        //console.log("get state working");
        //console.log(JSON.stringify(world_string));
        //return encodeURIComponent(JSON.stringify(world_string));
        return encodeURI(encodeURIComponent(world_string));
    }
    //EDX: Used to save the world state into edX. FOR RELOAD 
    function setState() {
        var last_xml = arguments.length === 1 ? arguments[0] : arguments[1];
        //var last_xml = arguments.length === 1 ? arguments[0] : arguments[1];
        //state = JSON.parse(stateStr);
        var ide = world.children[0];
        ide.openProjectString(decodeURIComponent(last_xml));


    }

    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade};
}());