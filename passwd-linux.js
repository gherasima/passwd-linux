// Global variables
// var shadowLocation = '/etc/shadow';
var shadowLocation = '/Users/gherasima/dev/node/passwd-linux/tmp/shadowmd5';

function checkPassSHA512(username, password, callback) {
    "use strict";

    // Require
    var fs = require('fs');
    var sha512crypt = require('sha512crypt-node');

    // Static Parameters
    var userNameInput = username;
    var passwordCheck = password;

    // Open shadow file
    fs.readFile(shadowLocation, function (error, file) {
        if (error) {
            return callback(error); // file does not exit
        }
        // file is a buffer, convert to string and then to array
        var shadowFile = file.toString().split('\n');

        // Check if user exist on the shadow file
        //  If user exist, set variable 'passwordHashFromFile' to contain full password
        var passwordHashFromFile; // Example: $6$/tDzh.dK$AwngrsMR/BihvbnTeXo9GIWJPd... (qwerty)
        shadowFile.forEach(function (line) {
            var shadowLineArray = line.split(":");
            var userNameFromFile = shadowLineArray[0];
            if (userNameFromFile === userNameInput) {
                passwordHashFromFile = shadowLineArray[1];
            }
        });

        // If user exist on the shadow file, check if password matches
        if (passwordHashFromFile) {
            var fullShadowSplit = passwordHashFromFile.split('$');
            //var passwordAlgorithm = fullShadowSplit[1];   // Example: 6
            var passwordSalt = fullShadowSplit[2];          // Example: /tDzh.dK$
            //var passwordHash = fullShadowSplit[3];        // Example: AwngrsMR/BihvbnTeXo9GIWJPd... (qwerty)

            // create password from user input and passwordSalt
            // and check if it matches to passwordHashFromFile
            if (sha512crypt.sha512crypt(passwordCheck, passwordSalt) === passwordHashFromFile) {
                callback(null, 'passwordCorrect');
            } else {
                callback(null, 'passwordIncorrect');
            }
        } else {
            callback(null, 'unknownUser');
        }
    });
}

function checkPassMD5(username, password, callback) {
    "use strict";

    // Require
    var fs = require('fs');
    var exec = require("child_process").exec;

    // Static Parameters
    var userNameInput = username;
    var passwordCheck = password;

    // Open shadow file
    fs.readFile(shadowLocation, function (error, file) {
        if (error) {
            return callback(error); // file does not exit
        }
        // file is a buffer, convert to string and then to array
        var shadowFile = file.toString().split('\n');

        // Check if user exist on the shadow file
        //  If user exist, set variable 'passwordHashFromFile' to contain full password
        var passwordHashFromFile; // Example: $1$LkDlMBW4$YgmI0u/JHyYgRY6ioaX7J
        shadowFile.forEach(function (line) {
            var shadowLineArray = line.split(":");
            var userNameFromFile = shadowLineArray[0];
            if (userNameFromFile === userNameInput) {
                passwordHashFromFile = shadowLineArray[1];
            }
        });

        // If user exist on the shadow file, check if password matches
        if (passwordHashFromFile) {
            var fullShadowSplit = passwordHashFromFile.split('$');
            //var passwordAlgorithm = fullShadowSplit[1];   // Example: 1
            var passwordSalt = fullShadowSplit[2];          // Example: LkDlMBW4
            //var passwordHash = fullShadowSplit[3];        // Example: YgmI0u/JHyYgRY6ioaX7J

            // create password from user input and passwordSalt
            // and check if it matches to passwordHashFromFile
            exec('openssl passwd -1 -salt $salt $pass', {
                env: {
                    salt: passwordSalt,
                    pass: passwordCheck
                }
            }, function (error, stdout, stderr) {
                // stdout contain the md5 password that openssl generate
                if (stdout.trim() === passwordHashFromFile) {
                    callback(null, 'passwordCorrect');
                } else {
                    callback(null, 'passwordIncorrect');
                }
            });
        } else {
            callback(null, 'unknownUser');
        }
    });
}

function changePass(username, password, newPassword, callback) {
    "use strict";

    // Require
    var exec = require("child_process").exec;

    // First check user and password
    checkPassSHA512(username, password, function (error, response) {
        if (error) {
            callback(error);
        }

        // if password correct, change user password
        if (response === 'passwordCorrect') {
            exec('echo $pass | passwd --stdin $user', {
                env: {
                    user: username,
                    pass: newPassword
                }
            });             //
            callback(null, 'passChangeOK');
        } else if (response === 'passwordIncorrect') {
            callback(null, 'passChangeERROR');
        } else if (response === 'unknownUser') {
            callback(null, 'passChangeERROR');
        } else {
            callback(null, 'passChangeERROR');
        }
    });
}

function changePassNV(username, newPassword, callback) {
    "use strict";

    // Require
    var exec = require("child_process").exec;

    // First check user and password
    checkUser(username, function (error, response) {
        if (error) {
            console.log(error);
        }

        // if user exist, change user password
        if (response === 'userExist') {
            exec('echo $pass | passwd --stdin $user', {
                env: {
                    user: username,
                    pass: newPassword
                }
            });

            callback(null, 'passChangeOK');
        } else {
            callback(null, 'unknownUser');
        }
    });
}

function checkUser(username, callback) {
    "use strict";

    // Require
    var fs = require('fs');

    // Static Parameters
    var userNameInput = username;

    // Open shadow file
    fs.readFile(shadowLocation, function (error, file) {
        if (error) {
            return callback(error); // file does not exit
        }
        // file is a buffer, convert to string and then to array
        var shadowFile = file.toString().split('\n');

        // Check if user exist on the shadow file
        //  If user exist, set variable 'passwordHashFromFile' to contain full password
        var passwordHashFromFile;
        shadowFile.forEach(function (line) {
            var shadowLineArray = line.split(":");
            var userNameFromFile = shadowLineArray[0];
            if (userNameFromFile === userNameInput) {
                passwordHashFromFile = shadowLineArray[1];
            }
        });
        if (passwordHashFromFile) {
            callback(null, 'userExist');
        } else {
            callback(null, 'unknownUser');
        }

    });
}

module.exports.checkUser = checkUser;
module.exports.changePassNV = changePassNV;
module.exports.changePass = changePass;
module.exports.checkPassSHA512 = checkPassSHA512;
module.exports.checkPassMD5 = checkPassMD5;


