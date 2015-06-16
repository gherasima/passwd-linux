# passwd-linux
Node.js module for checking and changing Linux user password


# Example
var passwd = require('passwd-linux');

passwd.checkPassSHA512('share', 'qwerty', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});
