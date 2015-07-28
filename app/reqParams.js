angular.module('reqParams', []).factory('reqParams', function() {
    return function ($scope, params, ifPresent, mustHaveOne) {

        if(!params) {
            params = [];
        }

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

        var paramMissingFromScope = function (p) {
            return deepFind($scope, p) === undefined;
        };

        var any = params.filter(paramMissingFromScope);

        var anyBecauseOf = [];
        for (var prop in ifPresent) {
            if (!paramMissingFromScope(prop)) {
                var notPresent = ifPresent[prop].filter(paramMissingFromScope);

                anyBecauseOf = anyBecauseOf.concat(notPresent);
            }
        }

        var anyHasOneOf = [];
        if (_.any(mustHaveOne)) {
            mustHaveOne.forEach(function(mho) {
                var allAreMissing = mho.every(paramMissingFromScope);

                if (allAreMissing) {
                    anyHasOneOf = anyHasOneOf.concat('One of: ' + mho.join(', '));
                }
            });
        }

        if (_.any(any) || _.any(anyBecauseOf) || _.any(anyHasOneOf)) {
            var missingParams = '';

            var processList = function(list) {
                missingParams += (missingParams.length > 0 ? ' ' : '') +  list.join(', ');
            };

            processList(any);
            processList(anyBecauseOf);
            processList(anyHasOneOf);

            throw new Error('Missing required params: ' + missingParams);
        }
    };
});