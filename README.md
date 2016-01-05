# Snap<em>!</em>  Autograder

An extension to Snap<em>!</em> which enables client-side autograding.

## Architecture Overview

Files List:

* edx-problem-code.xml
	* This is the code that belongs in edX for each autograded exercise.
	* You will need to modify parameters in this file when pasting it into edX. (See the README comments at the top.)
* AG_EDX.js
	* TODO
* AG_EDX_NoXML.js
	* TODO
* AGAgent.js
	* TODO
* AGFormatting.js
	* TODO
* feedbackLog.js
	* TODO
* scriptAnalysis.js
	* TODO
* spriteEventLog.js
	* TODO
* snap-edx-overrides.js
    * These are the only customizations to the Snap! source
    * (Not true right now, but eventually things will be refactored.)

* Dependencies:
    * jQuery
        * duh!
    * jschannel.js
        * Used for communication with edX via iframes
    * underscore-min.js
        * used once in scriptAnalysis.js

## edX Setup

* Upload a folder `snap` which is an exact copy of the Snap<em>!</em> repo.
	* To do this you need to export a tar file, then add `snap` to the `static` folder
	* Recompress the course folder and use edX's import tool.
* Upload all the files in `ag-files` to edX, but not in a subfolder.
* TODO: Upload lib?
* Upload `edx-snap-ag.html` but not in a subfolder.
* Upload a `*.js` file for each problem
