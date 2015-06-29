// var id = (window.location != window.parent.location)
//             ? document.referrer
//             : document.location;
var id = ""

var AG_state = {
    'checkState': false,
    'comment': "Please run 'Grade Question' before clicking the 'Check' button.",
    'feedback': {}
}
//This is unsafe. Store this elsewhere
var testLog;
var preReqID = null;
var taskID = "AG_M1_L1_T1";
id = id + taskID;
function AGTest() {
    testLog = testScriptPresent('[{"blockSp":"move %n steps","inputs":["A"]}]', ["A"], 0);
    console.log(testLog);
}

var AG_M1_L1_T1 = (function() {
	
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

        // console.log("Getting Grade!");
        
        //Store the item in localStorage
        //TODO: Consider using sessionStorage
        var ide = world.children[0];
        var glog = testLog;

        //Convert world to XML and store in local Storage
        var xmlString = ide.serializer.serialize(ide.stage);
        localStorage.setItem(id, xmlString); 

        if (glog !== undefined) {

            
            AG_state['feedback'] = dictLog(glog);
            AG_state['comment'] = "Autograder Score:";
            AG_state['checkState'] = glog.allCorrect;
            console.log(JSON.stringify(AG_state));
            //saves correct student answer, as well as state, in case student returns to question
            localStorage.setItem(id + "answer", JSON.stringify(AG_state));
            localStorage.setItem(id + "correctstate", xmlString);
            
        } 


        //Return the gradeable object (either anew or from previously saved state)
        if (localStorage.getItem(id + "answer") !== null && xmlString === localStorage.getItem(id + "correctstate")) {
            return localStorage.getItem(id + "answer");
        } else {
            return JSON.stringify(AG_state);
        }
        //return JSON.stringify(AG_state);
    }

    function getState() {
        return JSON.stringify(AG_state);
    }

    function setState() {
        
    }

    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade};
}());