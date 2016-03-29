// Global stuff

var SnapCloud = new Cloud(
    'https://snap.apps.miosoft.com/SnapCloudLocal'
);

// Cloud /////////////////////////////////////////////////////////////


// Cloud: Snap! API

Cloud.prototype.getPublicProject = function (
    id,
    callBack,
    errorCall
) {
    // id is Username=username&projectName=projectname,
    // where the values are url-component encoded
    // callBack is a single argument function, errorCall take two args
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open(
            "GET",
            (this.hasProtocol() ? '' : 'http://') // EDITED THIS
                + this.url.replace('Local', 'RawPublic') +
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
                        callBack.call(
                            null,
                            request.responseText
                        );
                    }
                } else {
                    errorCall.call(
                        null,
                        myself.url.replace('Local', 'Public'),
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
            (this.hasProtocol() ? '' : 'http://') // EDITED THIS
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
                        myself.url.replace('Local', 'ResetPW'),
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

