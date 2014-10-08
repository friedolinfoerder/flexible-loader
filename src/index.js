'use strict';

var loaders = {},
    projectPath = '';

/**
 * Set the project path
 * 
 * @param {String} path
 * 
 * @returns {Object} The module object 
 */
exports.setPath = function(path) {
    projectPath = path;
    
    // fluent interface
    return exports;
};

/**
 * Reset the loader module
 * 
 * @returns {Object} The module object
 */
exports.reset = function() {
    projectPath = '';
    for(var name in loaders) {
        delete exports[name];
    }
    loaders = {};
    
    // fluent interface
    return exports;
};

/**
 * Add a loader function
 * 
 * @param {String}   name     The name of the loader function
 * @param {Function} callback The loader function
 * 
 * @returns {Object} The module object
 */
exports.addLoader = function(name, callback) {
    exports[name] = loaders[name] = function() {
        var args = Array.prototype.slice.call(arguments);
        return callback.apply(exports, [projectPath].concat(args));
    };
    
    // fluent interface
    return exports;
};