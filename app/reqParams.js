angular.module('reqParams', []).factory('reqParams', function() {
    return function ($scope) {

        function deepFind(obj, path) {
            var paths = path.split('.'),
            current = obj,
            i;

            for (i = 0; i < paths.length; ++i) {
                if (current[paths[i]] === undefined) {
                    return undefined;
                } else {
                    current = current[paths[i]];
                }
            }

            return current;
        }

        function hasAny(arr) {
            return arr && arr.some(function(i) { return i !== undefined; });
        }

        function paramMissingFromScope(p) {
            return deepFind($scope, p) === undefined;
        }

        function convertStringToArray(p) {
            return p instanceof Array ? p : [p];
        }

        function validate(results) {
            if(hasAny(results)) {
                var missingParams = '';

                var processList = function(list) {
                    missingParams += (missingParams.length > 0 ? ' ' : '') +  list.join(', ');
                };

                processList(results);

                throw new Error('Missing required params: ' + missingParams);
            }
        }

        this.has = function(params) {
            var anyMissing = convertStringToArray(params).filter(paramMissingFromScope);
            validate(anyMissing);
            return this;
        };

        this.hasWhen = function(ifPresent, hasThese) {
            if (!paramMissingFromScope(ifPresent)) {
                var notPresent = convertStringToArray(hasThese).filter(paramMissingFromScope);
                validate(notPresent);
            }

            return this;
        };

        this.hasOne = function(hasOneOf) {
            var allAreMissing = hasOneOf.every(paramMissingFromScope);

            var anyHasOneOf = [];
            if (allAreMissing) {
                anyHasOneOf = anyHasOneOf.concat('One of: ' + hasOneOf.join(', '));
            }

            validate(anyHasOneOf);

            return this;
        };

        return this;
    };
});