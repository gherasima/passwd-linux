"use strict";

var passwd = require('./passwd-linux');

var username = process.argv[2]
var old_pass = process.argv[3]
var new_pass = process.argv[4]

passwd.userExist(username, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('User OK');
            console.log(response);
        } else {
            console.log('Unknown user');
            console.log(response);
        }
    }
});


