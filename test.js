"use strict";

var passwd = require('./passwd-linux');

var username = process.argv[2]
var password = process.argv[3]
passwd.changePassword(username, password, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('Password successfully changed');
            console.log(response);
        } else {
            console.log('Error changing password');
            console.log(response);
        }
    }
}, 6);


var username = process.argv[2]
var password = process.argv[3]
passwd.checkPassword(username, password, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('Password match');
            console.log(response);
        } else {
            console.log('Password does not match');
            console.log(response);
        }
    }
});


var username = process.argv[2]
var old_pass = process.argv[3]
var new_pass = process.argv[4]
passwd.userExist(username, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('User exist');
            console.log(response);
        } else {
            console.log('Unknown user');
            console.log(response);
        }
    }
});
