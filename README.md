# passwd-linux
Node.js module for checking and changing Linux user and password


## Installation
```bash
$  npm install passwd-linux
```


## Features

    * Check if user exist.
    * Check if old password is correct.
    * Change password if user exist but without verify the old password.
    * Change password if user exist and old password is correct


## Usage

Check if user exist
```js
var passwd = require('passwd-linux');

passwd.checkUser('username', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response); // if user exist 'response' will contain 'userExist'
    }
});
```

Change password if user exist but without verify the old password first

```js
var passwd = require('passwd-linux');

passwd.changePassNV('username', 'password', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response); // if password successfully changed 'response' will contain 'passChangeOK'
    }
});
```

Change password if user exist and old password is correct

```js
var passwd = require('passwd-linux');

passwd.changePass('username', 'password', 'newpassword', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response); // if password successfully changed 'response' will contain 'passChangeOK'
    }
});
```

Check if old password is correct

```js
var passwd = require('passwd-linux');

passwd.checkPass('username', 'password', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response); // response: passwordCorrect or passwordIncorrect
    }
});
```

Check if old password is correct (SHA512 only)

```js
var passwd = require('passwd-linux');

passwd.checkPassSHA512('username', 'password', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response);  // response: passwordCorrect or passwordIncorrect
    }
});
```

Check if old password is correct (MD5 only)

```js
var passwd = require('passwd-linux');

passwd.checkPassMD5('username', 'password', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response); // response: passwordCorrect or passwordIncorrect
    }
});
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



## Todo

* Change method checkPassMD5 from OpenSSL check (using ("child_process").exec) to javascript.


## License

[MIT](LICENSE.md)

