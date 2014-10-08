'use strict';

var loaders = {},
    projectPath = '';

exports.setPath = function(path) {
    projectPath = path;
};

exports.reset = function() {
    projectPath = '';
    for(var name in loaders) {
        delete exports[name];
    }
    loaders = {};
};

exports.addLoader = function(name, callback) {
    exports[name] = loaders[name] = function() {
        var args = Array.prototype.slice.call(arguments);
        return callback.apply(exports, [projectPath].concat(args));
    };
};