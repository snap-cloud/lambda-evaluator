// These are Snap! changes. Keep them isolated.
// This file is specific to edX only.
      
// edX doesn't support folders and instead uses _
IDE_Morph.prototype.resourceURL = function (folder, file) {
  var args = Array.prototype.slice.call(arguments, 0);
  return args.join('_');
}

