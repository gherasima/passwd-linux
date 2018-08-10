'use strict';

var shadowFile = '/etc/shadow';


function userExist(username, callback) {
    var fs = require('fs');

    fs.readFile(shadowFile, 'utf-8', function (err, file) {
        if (err) {
            return callback('Error: Can\'t open shadow file!', null);
        }
        var shadowArray = file.toString().split('\n');
        var userFinded = false;
        shadowArray.forEach(function (line) {
            var line = line.split(":");
            if (line[0] === username) {
                userFinded = true;
            }
        });
        callback(null, userFinded);

    });
}


function checkPassword(username, password, callback) {
    var fs = require('fs');

    fs.readFile(shadowFile, 'utf-8', function (err, file) {
        if (err) {
            return callback('Error: Can\'t open shadow file!', null);
        }
        var shadowArray = file.toString().split('\n');
        var passwordHash;

        shadowArray.forEach(function (line) {
            var shadowLine = line.split(":");
            if (shadowLine[0] === username) {
                passwordHash = shadowLine[1];

            }
        });
        if (passwordHash) {
            var shadowSplit = passwordHash.split('$');
            var algorithm = shadowSplit[1];
            var passwordSalt = shadowSplit[2];
            if (algorithm === '6') {
                var sha512crypt = require('sha512crypt-node');
                if (sha512crypt.sha512crypt(password, passwordSalt) === passwordHash) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            } else if (algorithm === '1') {
                var exec = require("child_process").exec;
                exec('openssl passwd -1 -salt $salt $pass', {
                    env: {
                        salt: passwordSalt,
                        pass: password
                    }
                }, function (err, stdout, stderr) {
                    if (stdout.trim() === passwordHash) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                });
            }
        } else {
            callback(null, false);
        }
    });
}


function changePassword(username, password, callback, algorithm = 6) {
    var fs = require('fs');

    fs.readFile(shadowFile, 'utf-8', function (err, file) {
        if (err) {
            return callback('Error: Can\'t open shadow file!', null);
        }
        var shadowArray = file.toString().split('\n');
        var shadowArrayNew = [];
        var userFinded = false;
        var userSetting;
        shadowArray.forEach(function (line) {
            var line = line.split(":");
            if (line[0] === username) {
                userFinded = true;
                userSetting = line.slice(2,20).join(':')
            }

        });

        if (userFinded) {
            var passwordHash;
            var passwordSalt;;
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++)
            passwordSalt += possible.charAt(Math.floor(Math.random() * possible.length));

            if (algorithm === 6) {
                var sha512crypt = require('sha512crypt-node');
                passwordHash = sha512crypt.sha512crypt(password, passwordSalt);
                var newLine = username + ':' + passwordHash + ':' + userSetting
                var argRegEx = new RegExp(username + '.*');
                var newShadow = file.toString().replace(argRegEx, newLine);
                fs.writeFile(shadowFile, newShadow, 'utf-8', function (err) {
                    if (err) {
                        return callback('Error: Can\'t open shadow file!', null);
                    }
                    callback(null, true);
                });
            } else if (algorithm === 1) {
                var exec = require("child_process").exec;
                exec('openssl passwd -1 -salt $salt $pass', {
                    env: {
                        salt: passwordSalt,
                        pass: password
                    }
                }, function (err, stdout, stderr) {
                    passwordHash = stdout.trim()

                    var newLine = username + ':' + passwordHash + ':' + userSetting
                    var argRegEx = new RegExp(username + '.*');
                    var newShadow = file.toString().replace(argRegEx, newLine);
                    fs.writeFile(shadowFile, newShadow, 'utf-8', function (err) {
                        if (err) {
                            return callback('Error: Can\'t open shadow file!', null);
                        }
                        callback(null, true);
                    });
                });
            } else {
                callback(null, false);
            }
        } else {
            callback(null, false);
        }
    });
}


module.exports.userExist = userExist;
module.exports.checkPassword = checkPassword;
module.exports.changePassword = changePassword;

