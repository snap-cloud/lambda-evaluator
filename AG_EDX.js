

var AG_state = {
    'checkState': false,
    'comment': "Please run the Snap Autograder before using the 'Check' button.",
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
<<<<<<< HEAD
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
            localStorage.setItem(id + 'answer', JSON.stringify(AG_state));
            localStorage.setItem(id + "correctstate", snapXML); 
        } 
        console.log("GET GRADE SUCCEEDING");

        return encodeURIComponent(JSON.stringify(edx_log));
=======
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
                localStorage.setItem(id + "answer", JSON.stringify(AG_state));
                localStorage.setItem(id + "correctstate", snapXML); 
            }
            console.log("GET GRADE SUCCEEDING");

            /*return encodeURIComponent(JSON.stringify(edx_log));*/
            return encodeURIComponent(JSON.stringify(edx_log));
        } else {
            return JSON.stringify(AG_state);
        }
>>>>>>> 9d25f0b8cc587464b395904b5ae6cc937a15c8c7
        // return encodeURIComponent(JSON.stringify(edx_log));
        // //Return the gradeable object (either anew or from previously saved state)
        // //TODO: [Tina] This needs to be fixed for the new saving strategy
        // if (localStorage.getItem(id + "answer") !== null && 
        //     xmlString === localStorage.getItem(id + "correctstate")) {
        //     return localStorage.getItem(id + "answer");
        // } else { return JSON.stringify(AG_state); }



    }

    function getState() {
        return encodeURIComponent(JSON.stringify(AG_state));
    }
    //EDX: Used to save the world state into edX. FOR RELOAD 
    function setState() {
        
    }

    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade};
}());