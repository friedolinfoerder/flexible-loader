flexible-loader
===============

A flexible dependency loader for nodejs which allows easy testing.

Usage:

``` javascript
var loader = require('flexible-loader');

// configuration    
loader
    .setPath(__dirname)
    .addLoader('model', function(path, identifier) {
        return path + '/models/' + identifier;
    })
    .addLoader('controller', function(path, identifier) {
        return path + '/controllers/' + identifier;
    })
    .addLoader('route', function(path, identifier) {
        return path + '/routes/' + identifier;
    });

// loading
var UserModel = loader.model('User'),
    UserController = loader.controller('User');

// testing
var UserControllerMock = {
        add:    function() {},
        remove: function() {}
    },
    UserModelTest = loader.test.model('User', {
        controller: {
            User: UserControllerMock
        },
        model: {
            Page: {}
        } 
    });
```
