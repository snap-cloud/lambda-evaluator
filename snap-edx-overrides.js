// These are Snap! changes. Keep them isolated.

// edX doesn't support folders and instead uses _
IDE_Morph.prototype.resourceURL = function (folder, file) {
  return folder + '_' + file;
}

// Fix the Cloud URL stuff.
// These are overrides for specific functions in cloud.js
SnapCloud = new Cloud('https://snap.apps.miosoft.com/SnapCloudLocal');

// Below instead of just adding + Public, we need to replace the word
// Local with the word public. We've C&P the entire function.
Cloud.prototype.getPublicProject = function (
  id,
  callBack,
  errorCall
) {
  // id is Username=username&projectName=projectname,
  // where the values are url-component encoded
  // callBack is a single argument function, errorCall take two args
  var request = new XMLHttpRequest(),
      responseList,
      myself = this;
  try {
      request.open(
          "GET",
          (this.hasProtocol() ? '' : 'http://')
              + this.url.replace('Local', 'Public')
              + '?'
              + id,
          true
      );
      request.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
      );
      request.withCredentials = true;
      request.onreadystatechange = function () {
          if (request.readyState === 4) {
              if (request.responseText) {
                  if (request.responseText.indexOf('ERROR') === 0) {
                      errorCall.call(
                          this,
                          request.responseText
                      );
                  } else {
                      responseList = myself.parseResponse(
                          request.responseText
                      );
                      callBack.call(
                          null,
                          responseList[0].SourceCode
                      );
                  }
              } else {
                  errorCall.call(
                      null,
                      myself.url + 'Public',
                      localize('could not connect to:')
                  );
              }
          }
      };
      request.send(null);
  } catch (err) {
      errorCall.call(this, err.toString(), 'Snap!Cloud');
  }
};

Cloud.prototype.signup = function (
  username,
  email,
  callBack,
  errorCall
) {
  // both callBack and errorCall are two-argument functions
  var request = new XMLHttpRequest(),
      myself = this;
  try {
      request.open(
          "GET",
          (this.hasProtocol() ? '' : 'http://')
              + this.url.replace('Local', 'SignUp')
              + '?Username='
              + encodeURIComponent(username)
              + '&Email='
              + encodeURIComponent(email),
          true
      );
      request.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
      );
      request.withCredentials = true;
      request.onreadystatechange = function () {
          if (request.readyState === 4) {
              if (request.responseText) {
                  if (request.responseText.indexOf('ERROR') === 0) {
                      errorCall.call(
                          this,
                          request.responseText,
                          'Signup'
                      );
                  } else {
                      callBack.call(
                          null,
                          request.responseText,
                          'Signup'
                      );
                  }
              } else {
                  errorCall.call(
                      null,
                      myself.url + 'SignUp',
                      localize('could not connect to:')
                  );
              }
          }
      };
      request.send(null);
  } catch (err) {
      errorCall.call(this, err.toString(), 'Snap!Cloud');
  }
};

Cloud.prototype.resetPassword = function (
  username,
  callBack,
  errorCall
) {
  // both callBack and errorCall are two-argument functions
  var request = new XMLHttpRequest(),
      myself = this;
  try {
      request.open(
          "GET",
          (this.hasProtocol() ? '' : 'http://')
              + this.url.replace('Local', 'ResetPW')
              + '?Username='
              + encodeURIComponent(username),
          true
      );
      request.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
      );
      request.withCredentials = true;
      request.onreadystatechange = function () {
          if (request.readyState === 4) {
              if (request.responseText) {
                  if (request.responseText.indexOf('ERROR') === 0) {
                      errorCall.call(
                          this,
                          request.responseText,
                          'Reset Password'
                      );
                  } else {
                      callBack.call(
                          null,
                          request.responseText,
                          'Reset Password'
                      );
                  }
              } else {
                  errorCall.call(
                      null,
                      myself.url + 'ResetPW',
                      localize('could not connect to:')
                  );
              }
          }
      };
      request.send(null);
  } catch (err) {
      errorCall.call(this, err.toString(), 'Snap!Cloud');
  }
};
