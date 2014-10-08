'use strict';

var loader = require('../src/index');

describe('module flexible-module', function() {
    
    beforeEach(function() {
        loader.reset();
    });

    describe('function addLoader', function() {

        it('should have function addLoader', function() {
            expect(loader.addLoader).toBeDefined();
        });

        it('should provide loader function after calling this function', function() {
            loader.addLoader('lib', function() {});
            
            expect(loader.lib).toBeDefined();
        });

    });
    
    describe('loader function', function() {
        
        it('should call loader function with string attribute', function() {
            var returnedModule = {},
                spy = jasmine.createSpy().andReturn(returnedModule);
            
            // add loader function
            loader.addLoader('lib', spy);
            loader.setPath('project/path');
            var loadedModule = loader.lib('calculations.test');
            
            expect(spy).toHaveBeenCalledWith('project/path', 'calculations.test');
            expect(spy.callCount).toBe(1);
            expect(loadedModule).toBe(returnedModule);
        });
        
    });
});