'use strict';

var loaders = {},
    projectPath = '',
    // variables for testing
    locals = {},
    depth = 0;

exports._require = require;

exports.test = {};

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
    exports._require = require;
    projectPath = '';
    for(var name in loaders) {
        delete exports[name];
        delete exports.test[name];
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
    var req = exports._require;
    exports[name] = loaders[name] = function(identifier) {
        var returnValue = callback.call(exports, projectPath, identifier);
        
        return (typeof returnValue === 'string') ? req(returnValue) : returnValue;
    };
    exports.test[name] = function(identifier, loc) {
        var locals = loc || {},
            depth = 0;
        
        // change how the normal loader function reacts
        for(var loaderName in loaders) {
            exports[loaderName] = (function(loader, local) {
                return function(identifier) {
                    var module;
                    depth++;
                    if(depth === 1 && local && local[identifier]) {
                        module = local[identifier];
                    } else {
                        module = loader(identifier);
                    }
                    depth--;
                    return module;
                };
            }(loaders[loaderName], locals[loaderName]));
        }
        
        var returnValue = callback.call(exports, projectPath, identifier);
        
        var filename = req.resolve(returnValue),
            cached = req.cache[filename],
            isCached = !!cached;
        
        // delete cache
        delete req.cache[filename];
        var moduleToTest = req(returnValue);
        // restore cache
        if(isCached) {
            req.cache[filename] = cached;
        } else {
            delete req.cache[filename];
        }
        

        // reset the normal loader function
        for(var loaderName in loaders) {
            exports[loaderName] = loaders[loaderName];
        }
        
        return moduleToTest;
    };
    
    // fluent interface
    return exports;
};