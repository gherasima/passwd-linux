# passwd-linux
Node.js module for checking and changing Linux user password

## Installation
```bash
$ ...
```

## Features

    * Supporting SHA512 only

# Quick Start
```js
var passwd = require('passwd-linux');

passwd.checkPassSHA512('username', 'password', function (error, response) {
    "use strict";
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});
```

## License

MIT