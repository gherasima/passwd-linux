# passwd-linux
Node.js module for checking and changing Linux user and password


## Installation
```bash
$  npm install passwd-linux
```


## Features

    * Check if user exist.
    * Check if password is correct.
    * Change password if user exist.


## Usage

Check if user exist
```js
passwd.userExist(username, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('User exist');
        } else {
            console.log('Unknown user');

        }
    }
});

```

Check if password is correct

```js
passwd.checkPassword(username, password, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('Password correct');
        } else {
            console.log('Password is not correct');
        }
    }
});
```

Change password if user exist

```js
passwd.changePassword(username, password, function (err, response) {
    if (err) {
        console.log(err);
    } else {
        if (response) {
            console.log('Password successfully changed');
        } else {
            console.log('Error changing password');
        }
    }
}, 6);

```





## Release History

|Version  |Status|Functionality |
|---      |---  |---           |
|1.0.0      |released  |Initial release   |
|1.0.1      |released  |Bug fixes   |
|1.0.2      |released  |Bug fixes   |
|1.0.3      |released  |Bug fixes   |
|1.0.4      |released  |Bug fixes   |
|1.1.0      |released  |Added checkUser and changePassNV methods|
|1.2.0      |released  |Added checkPassMD5 method|
|1.2.1      |released  |Bug fixes for: changePassNV and checkUser |
|1.2.2      |released  |Bug fixes for: changePass |
|1.2.3      |released  |Added support for MD5 to the change password method |
|1.2.4      |released  |Bug fixes |
|1.2.5      |released  |Bug fixes |
|1.3.0      |released  |Combine checkPassMD5 and checkPassSHA512 to single method: checkPass |
|1.3.1      |released  |Bug fixes: Now changePass and checkPass return unknownUser|
|2.0.0      |released  |Rewrite all methods to satisfy 2 open issues|

## Todo

* Change method checkPassMD5 from OpenSSL check (using ("child_process").exec) to javascript.


## License

[MIT](LICENSE.md)

