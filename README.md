flexible-loader
===============

A flexible dependency loader for nodejs.

Usage:

``` javascript
var loader = require('flexible-loader');

// configuration    
loader
    .setPath(__dirname)
    .addLoader('model', function(path, identifier) {
        require(path + '/models/' + identifier.toLowerCase());
    })
    .addLoader('controller', function(path, identifier) {
        require(path + '/controllers/' + identifier.toLowerCase());
    });

// loading
var UserModel = loader.model('User'),
    UserController = loader.controller('User');
```
