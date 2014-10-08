'use strict';

var loader = require('../src/index');

describe('module flexible-module', function() {
    
    beforeEach(function() {
        loader.reset();
        
        // mock require function
        loader._require = function(str) {
            if(!loader._require.cache[str]) {
                var module = loader._require.available[str];
                if(!module) {
                    throw new Error('No module with name "' + str + '" available');
                }
                loader._require.cache[str] = (typeof module === "function") ? module() : module;
            }
            return loader._require.cache[str];
        };
        loader._require.resolve = function(str) {
            return str;
        };
        loader._require.cache = {};
        loader._require.available = {};
    });

    describe('function addLoader', function() {

        it('should have function addLoader', function() {
            expect(loader.addLoader).toBeDefined();
        });

        it('should provide loader function after calling this function', function() {
            loader.addLoader('lib', function() {});
            expect(loader.lib).toBeDefined();
        });
        
        it('should provide test loader function after calling this function', function() {
            loader.addLoader('lib', function() {});
            expect(loader.test.lib).toBeDefined();
        });

    });
    
    describe('loader function', function() {
        
        it('should be callable with string attribute', function() {
            // set available modules of mocked require function
            var mockedModule = {};
            loader._require.available = {
                'lib/calculations/test': mockedModule,
            };
            
            var libLoader = jasmine.createSpy().andReturn('lib/calculations/test');
            
            // add loader function
            loader.addLoader('lib', libLoader);
            loader.setPath('project/path');
            var loadedModule = loader.lib('calculations.test');
            
            expect(libLoader).toHaveBeenCalledWith('project/path', 'calculations.test');
            expect(libLoader.callCount).toBe(1);
            expect(loadedModule).toBe(mockedModule);
        });
        
        it('should return object', function() {
            // set available modules of mocked require function
            var mockedModule = {};
            
            var libLoader = jasmine.createSpy().andReturn(mockedModule);
            
            // add loader function
            loader.addLoader('lib', libLoader);
            loader.setPath('project/path');
            var loadedModule = loader.lib('calculations.test');
            
            expect(libLoader).toHaveBeenCalledWith('project/path', 'calculations.test');
            expect(libLoader.callCount).toBe(1);
            expect(loadedModule).toBe(mockedModule);
        });
        
    });
    
    describe('test loader function', function() {
        
        it('should work normal without locals', function() {
            // set available modules of mocked require function
            var mockedModule = {};
            
            loader._require.available = {
                'project/path/lib/calculations/test': function() {
                    return loader.lib('network/upload');
                },
                'project/path/lib/network/upload': mockedModule
            };
            
            // add loader function
            loader
                .setPath('project/path')
                .addLoader('lib', function(path, identifier) {
                    return path + '/lib/' + identifier;
                });
                
            var loadedModule = loader.test.lib('calculations/test');
            
            expect(loadedModule).toBe(mockedModule);
        });
        
        it('should use locals', function() {
            // set available modules of mocked require function
            var mockedModule = {};
            
            loader._require.available = {
                'project/path/lib/calculations/test': function() {
                    return loader.lib('network/upload');
                }
            };
            
            // add loader function
            loader.addLoader('lib', function(path, identifier) {
                console.log(path, identifier);
                return path + '/lib/' + identifier;
            });
            loader.setPath('project/path');
            var loadedModule = loader.test.lib('calculations/test', {
                lib: {
                    'network/upload': mockedModule
                }
            });
            
            expect(loadedModule).toBe(mockedModule);
        });
        
    });
});