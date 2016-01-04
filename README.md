# Snap<em>!</em>  Autograder

An extension to Snap<em>!</em> which enables client-side autograding.

## Architecture Overview

Files List:
* AG_EDX.js
* AGAgent.js
* AGFormatting.js
* feedbackLog.js
* scriptAnalysis.js
* spriteEventLog.js

* snap-edx-overrides.js
	* These are the only customizations to the Snap! source
	* (Not true right now, but eventually things will be refactored.)

* Libraries:
	* jQuery
		* duh!
	* jschannel.js
		* Used for communication with edX via iframes
	* underscore-min.js
		* used once in scriptAnalysis.js