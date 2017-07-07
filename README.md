# Snap<em>!</em>  Autograder

An extension to Snap<em>!</em> which enables client-side autograding.

## Cloning __README__
Clone with `git clone --recursive` to download the snap source as a submodule.

If you've already cloned without `--recursive` do:

* `git submodule init`
* `git submodule update`

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

## Writing Tests
This is the recommended approach:

* Start a local host server, such as:
	* `cd` into this directory.
	* `python -m SimpleHTTPServer` or `python3 -m http.server`
	* Navigate to [http://localhost:8000/](http://localhost:8000/)
* Use the file: `local-snap-ag.html`
* Set `#test_file=path` in the URL.
	* For example:  [`http://localhost:8000/local-snap-ag.html#test_file=mooc3/week1_gps.js`](http://localhost:8000/local-snap-ag.html#test_file=mooc3/week1_gps.js)
* If you have a starter XML file, it must be in the same directory as `test_file`
	* Example: In the above case you have `week1_gps.js` in the `mooc3/` folder and a starter file `W1_L1_Starter_GPS_Scraping.xml` also in `mooc3/`
	* NOTE: When referring to the path to the starter file, don't write the directory in your test file.
* If the Snap! page does not load, and the console shows that the files in the `snap` folder cannot be found, `cd` into the `snap` folder and type the git commands from the "Cloning README" section above
	

## edX Setup

* Upload `snap/` which is an exact copy of the Snap<em>!</em> repo, and `lib/`
	* Export a tar file from studio.edx, and uncompress it
	* then add `snap/` to the `static/` folder
	* add `lib/` to `static/`
	* Recompress the course folder and use edX's import tool.
* Upload all the files in `ag-files` to edX, but not in a subfolder.
* Upload all the files in `lib` to edX, but not in a subfolder.
* Upload `edx-snap-ag.html` but not in a subfolder.
* Upload a `*.js` file for each problem
