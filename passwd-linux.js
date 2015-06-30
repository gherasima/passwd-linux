// Global variables
var shadowLocation = '/etc/shadow';

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

function checkPass(username, password, callback) {
    "use strict";

    // Require
    var fs = require('fs');

    var usernameInput = username;
    var passwordCheck = password;

    // First check if the password is md5 or sha512
    // Open shadow file
    fs.readFile(shadowLocation, function (error, file) {
        if (error) {
            return callback(error); // file does not exit
        }

        // file is a buffer, convert to string and then to array
        var shadowArray = file.toString().split('\n');

        // Check if user exist on the shadow file
        // If user exist, set variable 'passwordHashFromFile' to contain full password
        var fullPasswordHashFromFile;   // Example: $6$/tDzh.dK$AwngrsMR/BihvbnTeXo9GIWJPd... (qwerty)
        shadowArray.forEach(function (line) {
            var shadowLineArray = line.split(":");
            var usernameOrg = shadowLineArray[0];
            if (usernameOrg === usernameInput) {
                fullPasswordHashFromFile = shadowLineArray;
            }
        });

            if (typeof fullPasswordHashFromFile !== 'undefined') {
                var passwordArray = fullPasswordHashFromFile[1].split('$');
                var passwordAlgorithm = passwordArray[1];
                // sha512 password change
                if (passwordAlgorithm === '6') {
                    // First check user and password
                    checkPassSHA512(username, passwordCheck, function (error, response) {
                        if (error) {
                            callback(error);
                        }
                        // if password correct
                        if (response === 'passwordCorrect') {
                            callback(null, response);
                            // if user exit but old password is incorrect
                        } else if (response === 'passwordIncorrect') {
                            callback(null, response);
                            // if user don't exist
                        } else if (response === 'unknownUser') {
                            callback(null, 'unknownUser-passChangeERROR');
                        } else {
                            callback(null, 'passChangeERROR');
                        }
                    });
                    // md5 password change
                } else if (passwordAlgorithm === '1') {
                    // First check user and password
                    checkPassMD5(username, passwordCheck, function (error, response) {
                        if (error) {
                            callback(error);
                        }
                        // if password correct
                        if (response === 'passwordCorrect') {
                            callback(null, response);
                            // if user exit but old password is incorrect
                        } else if (response === 'passwordIncorrect') {
                            callback(null, response);
                            // if user don't exist
                        } else if (response === 'unknownUser') {
                            callback(null, 'unknownUser-passChangeERROR');
                        } else {
                            callback(null, 'passChangeERROR');
                        }
                    });
                } else if (passwordAlgorithm === undefined) {
                    callback(null, 'userDisabled');
                } else {
                    // if algorithm is not 6 or 1
                    callback(null, 'unknown-password-algorithm ' + passwordAlgorithm);
                }

            } else {
                callback(null, 'unknownUser');
            }



    });
}

function changePass(username, password, newPassword, callback) {
    "use strict";

    // Require
    var exec = require("child_process").exec;
    var fs = require('fs');

    var usernameInput = username;
    var passwordCheck = password;

    // First check if the password is md5 or sha512
    // Open shadow file
    fs.readFile(shadowLocation, function (error, file) {
        if (error) {
            return callback(error); // file does not exit
        }

        // file is a buffer, convert to string and then to array
        var shadowArray = file.toString().split('\n');

        // Check if user exist on the shadow file
        // If user exist, set variable 'passwordHashFromFile' to contain full password
        var fullPasswordHashFromFile;   // Example: $6$/tDzh.dK$AwngrsMR/BihvbnTeXo9GIWJPd... (qwerty)
        shadowArray.forEach(function (line) {
            var shadowLineArray = line.split(":");
            var usernameOrg = shadowLineArray[0];
            if (usernameOrg === usernameInput) {
                fullPasswordHashFromFile = shadowLineArray;
            }
        });

        if (typeof fullPasswordHashFromFile !== 'undefined') {
                var passwordArray = fullPasswordHashFromFile[1].split('$');
                var passwordAlgorithm = passwordArray[1];
                // sha512 password change
                if (passwordAlgorithm === '6') {
                    // First check user and password
                    checkPassSHA512(username, passwordCheck, function (error, response) {
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
                            }, function (error, stdout, stderr) {
                                if (error) {
                                    return callback(null, 'passChangeError');
                                }
                                // if we have stderr defined then the password did not change
                                if (stderr) {
                                    callback(null, 'passChangeError');

                                    //  if stdout contain 'successfully.' then password change successfully
                                } else if (/successfully\./.test(stdout)) {
                                    callback(null, 'passChangeOK');
                                } else {
                                    // everything else then password did not change
                                    callback(null, 'passChangeError');

                                }
                            });
                            // if user exit but old password is incorrect
                        } else if (response === 'passwordIncorrect') {
                            callback(null, 'passwordIncorrect');
                            // if user don't exist
                        } else if (response === 'unknownUser') {
                            callback(null, 'unknownUser-passChangeERROR');
                        } else {
                            callback(null, 'passChangeERROR');
                        }
                    });
                    // md5 password change
                } else if (passwordAlgorithm === '1') {
                    // First check user and password
                    checkPassMD5(username, passwordCheck, function (error, response) {
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
                            }, function (error, stdout, stderr) {
                                if (error) {
                                    return callback(null, 'passChangeError');
                                }
                                // if we have stderr defined then the password did not change
                                if (stderr) {
                                    callback(null, 'passChangeError');
                                    //  if stdout contain 'successfully.' then password change successfully
                                } else if (/successfully\./.test(stdout)) {
                                    callback(null, 'passChangeOK');
                                } else {
                                    // everything else then password did not change
                                    callback(null, 'passChangeError');
                                }
                            });
                            // if user exit but old password is incorrect
                        } else if (response === 'passwordIncorrect') {
                            callback(null, 'oldPasswordIncorrect');
                            // if user don't exist
                        } else if (response === 'unknownUser') {
                            callback(null, 'unknownUser-passChangeERROR');
                        } else {
                            callback(null, 'passChangeERROR');
                        }
                    });
                } else if (passwordAlgorithm === undefined) {
                    callback(null, 'userDisabled');
                } else {
                    // if algorithm is not 6 or 1
                    callback(null, 'unknown-password-algorithm ' + passwordAlgorithm);
                }
            } else {
                callback(null, 'unknownUser');
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
            callback(error);
        }

        // if user exist, try to change user password
        if (response === 'userExist') {
            exec('echo $pass | passwd --stdin $user', {
                env: {
                    user: username,
                    pass: newPassword
                }
            }, function (error, stdout, stderr) {
                if (error) {
                    return callback(null, 'passChangeError');
                }
                // if we have stderr defined then the password did not change
                if (stderr) {
                    callback(null, 'passChangeError');
                    //  if stdout contain 'successfully.' then password change successfully
                } else if (/successfully\./.test(stdout)) {
                    callback(null, 'passChangeOK');
                } else {
                    // everything else then password did not change
                    callback(null, 'passChangeError');
                }
            });
        } else {
            // return that user don't exist
            callback(null, response);
        }
    });
}

function checkUser(username, callback) {
    "use strict";

    // Require
    var fs = require('fs');

    // Static Parameters
    var usernameInput = username;

    // Open shadow file
    fs.readFile(shadowLocation, function (error, file) {
        if (error) {
            return callback(error); // file does not exit
        }
        // file is a buffer, convert to string and then to array
        var shadowArray = file.toString().split('\n');

        // Check if user exist on the shadow file
        //  If user exist, set variable 'passwordHashOrg' to contain full password
        var passwordHashOrg;
        shadowArray.forEach(function (line) {
            var shadowLineArray = line.split(":");
            var usernameOrg = shadowLineArray[0];
            if (usernameOrg === usernameInput) {
                passwordHashOrg = shadowLineArray[1];
            }
        });
        if (passwordHashOrg) {
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
module.exports.checkPass = checkPass;


