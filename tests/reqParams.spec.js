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
        it('should work if present - string', function() {
            var scope = { myService: {}, anotherService: {} };
            var run = function() { service(scope).has('myService').has('anotherService'); };
            expect(run).not.toThrow();
        });

        it('should work if present - array', function() {
            var scope = { myService: {}, anotherService: {} };
            var run = function() { service(scope).has(['myService', 'anotherService']); };
            expect(run).not.toThrow();
        });
      
        it('should fail if not present', function() {
            var scope = { myService: {} };
            var run = function() { service(scope).has(['myService', 'anotherService']); };
            expect(run).toThrow();
        });
    });

    describe('present because of', function () {
        it('should work if present because of - string', function() {
            var scope = { myService: {}, anotherService: {} };
            var run = function() { service(scope).hasWhen('myService', 'anotherService'); };
            expect(run).not.toThrow();
        });

        it('should work if present because of - array', function() {
            var scope = { myService: {}, anotherService: {} };
            var run = function() { service(scope).hasWhen('myService', ['anotherService']); };
            expect(run).not.toThrow();
        });

        it('should fail correctly', function() {
            var scope = { myService: {}, anotherService: undefined };
            var run = function() { service(scope).hasWhen('myService', ['anotherService']); };
            expect(run).toThrow();
        });
    });

    describe('one must be present', function () {
        it('should work if one is present', function() {
            var scope = { myService: undefined, anotherService: undefined, someService: undefined, itsThisService: {} };
            var run = function() { service(scope).hasOne(['myService', 'itsThisService']).hasOne(['anotherService', 'itsThisService']); };
            expect(run).not.toThrow();
        });

        it('should fail correctly', function() {
            var scope = { myService: undefined, anotherService: undefined, someService: undefined, itsThisService: {} };
            var run = function() { service(scope).hasOne(['myService', 'itsThisService']).hasOne(['anotherService', 'someService']); };
            expect(run).toThrow();
        });
    });
});