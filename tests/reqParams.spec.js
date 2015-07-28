/*jslint node: true */
/*global angular, describe, it, jasmine, expect, beforeEach, spyOn */
"use strict";

describe('reqParams factory', function() {
    var service;

    beforeEach(function() {
        angular.mock.module('reqParams');
        angular.mock.inject(function($injector) {
            service = $injector.get('reqParams');
        });
    });

    describe('must be present', function() {
        it('should work if present', function() {
            var scope = { myService: {}, anotherService: {} };
            var run = function() { service(scope, ['myService', 'anotherService']); };
            expect(run).not.toThrow();
        });
      
        it('should fail if not present', function() {
            var scope = { myService: {} };
            var run = function() { service(scope, ['myService', 'anotherService']); };
            expect(run).toThrow();
        });
    });

    describe('present because of', function () {
        it('should work if present because of', function() {
            var scope = { myService: {}, anotherService: {} };
            var run = function() { service(scope, null, { myService: ['anotherService'] }); };
            expect(run).not.toThrow();
        });

        it('should fail correctly', function() {
            var scope = { myService: {}, anotherService: undefined };
            var run = function() { service(scope, null, { myService: ['anotherService'] }); };
            expect(run).toThrow();
        });
    });

    describe('one must be present', function () {
        it('should work if one is present', function() {
            var scope = { myService: undefined, anotherService: undefined, someService: undefined, itsThisService: {} };
            var run = function() { service(scope, null, null, [['myService', 'itsThisService'], ['anotherService', 'itsThisService']]); };
            expect(run).not.toThrow();
        });

        it('should fail correctly', function() {
            var scope = { myService: undefined, anotherService: undefined, someService: undefined, itsThisService: {} };
            var run = function() { service(scope, null, null, [['myService', 'itsThisService'], ['anotherService', 'someService']]); };
            expect(run).toThrow();
        });
    });
});