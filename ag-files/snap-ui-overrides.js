// AG-agent: Opening Projects
IDE_Morph.prototype.originalOpenProject = IDE_Morph.prototype.openProjectString;
IDE_Morph.prototype.openProjectString = function (name) {
    this.originalOpenProject(name);
    setTimeout(function() {
        AGUpdate(world, id);
    }, 1000);
}

IDE_Morph.prototype.originalCloudOpenProject = IDE_Morph.prototype.openCloudDataString;
IDE_Morph.prototype.openCloudDataString = function (name) {
    this.originalCloudOpenProject(name);
    setTimeout(function() {
        AGUpdate(world, id);
    }, 1000);
}

// AG-UI: Keep autograding bar aligned

// IDE_Morph.prototype.originalToggleStageSize = IDE_Morph.prototype.toggleStageSize;
// IDE_Morph.prototype.toggleStageSize = function (isSmall) {
//     this.originalToggleStageSize(isSmall);
//     setTimeout(function() {
//         moveAutogradingBar();
//     }, 100);
// };