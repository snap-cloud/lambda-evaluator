// These are Snap! changes. Keep them isolated.
      
// edX doesn't support folders and instead uses _
IDE_Morph.prototype.resourceURL = function (folder, file) {
  return folder + '_' + file;
}

function saveToTempStorage(value) {
    window.tempStorage = value;
}
// Keep these around for proxying.
var originalSaveCavasAs = IDE_Morph.prototype.saveCanvasAs;

var originalPopUp = SpeechBubbleMorph.prototype.popUp;

SyntaxElementMorph.prototype.returnResultBubble = function (value) {
    // Show Snap lists as a normal list watcher
    if (value instanceof List) {
        value = new ListWatcherMorph(value);
    }
    window.tempStorage = null;
    // Overwrite functions temporilty.
    // Prevent the bubble from showing up.
    SpeechBubbleMorph.prototype.popUp = nop;
    // Stuff the canvas in the global variable.
    IDE_Morph.prototype.saveCanvasAs = saveToTempStorage;
    // This is the actual call but will stuff the resulting image in tempStorage
    this.showBubble(value, true);
    // Restore functions for the rest of Snap!
    SpeechBubbleMorph.prototype.popUp = originalPopUp;
    IDE_Morph.prototype.saveCanvasAs = originalSaveCavasAs;
    
    return window.tempStorage;
};
