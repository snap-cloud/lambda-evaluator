
var AGDrawSquareState = {
    'checkState': false,
    'comment': "Please run 'Grade Question' before clicking the 'Check' button.",
    'feedback': {}
}
//This is unsafe. Store this elsewhere
var testLog;

function AGTest() {
    testLog = multiTestBlock("%s my plus %s", [[1,2],[2,2],[2,3],[3,3]], [3,4,5,6]);
}

var AGDrawSquare = (function() {
	
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

    // function isCorrect() {
    //     return AGstate["checkState"];
    // }

	function getGrade() {
        // The following return value may or may not be used to grade
        // server-side.
        // If getState and setState are used, then the Python grader also gets
        // access to the return value of getState and can choose it instead to
        // grade.
        // console.log("Getting Grade!");
        
        //Store the item in localStorage
        //TODO: Consider using sessionStorage
        var ide = world.children[0];
        // scripts = ide.sprites.contents[0].scripts.children;
        
        // console.log(scripts);
        // for (i in scripts) {
        //     console.log(scripts[i].blockSpec);
        //     if (typeof scripts[i].blockSpec !== "undefined" &&
        //         scripts[i].blockSpec === "Draw Square") {
        //         console.log("SUCCESS");
        //         AGDrawSquareState['checkState'] = true;
        //     }
        //     console.log("SCRIPT NOT FOUND OIIS");
        // }
        console.log("I GOT HERE");
        var glog = testLog;

        //Convert world to XML and store in local Storage
        var xmlString = ide.serializer.serialize(ide.stage);
        localStorage.setItem(id, xmlString); 

        if (glog !== undefined) {

            
            AGDrawSquareState['feedback'] = dictLog(glog);
            AGDrawSquareState['comment'] = "Autograder Finished"
            AGDrawSquareState['checkState'] = glog.allCorrect;
            console.log(JSON.stringify(AGDrawSquareState));
            //saves correct student answer, as well as state, in case student returns to question
            localStorage.setItem("answer", JSON.stringify(AGDrawSquareState));
            localStorage.setItem("correctstate", xmlString);
            
        } 


        //Return the gradeable object (either anew or from previously saved state)
        console.log("I got all the way down here?");
        if (localStorage.getItem("answer") !== null && xmlString === localStorage.getItem("correctstate")) {
            return localStorage.getItem("answer");
        } else {
            return JSON.stringify(AGDrawSquareState);
        }
        //return JSON.stringify(AGDrawSquareState);
    }

    function getState() {
        return JSON.stringify(AGDrawSquareState);
    }

    function setState() {
        
    }

    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade};
}());