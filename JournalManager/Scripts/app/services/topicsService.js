(function () {
    'use strict';
    var app = angular.module('app');

    app.factory('topicsService',
    [
        '$http', '$q',
        function ($http, $q) {
            var topicsvc = {
                save: function (topic) {
                    var deferred = $q.defer();
                    $http.post('/api/Topic', topic)
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                },
                getAll: function () {
                    var deferred = $q.defer();
                    $http.get('/api/Topic')
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                },
                getById: function (id) {
                    var deferred = $q.defer();
                    $http.get('/api/Topic/' + id)
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                },
                'delete': function (id) {
                    var deferred = $q.defer();
                    $http.delete('/api/Topic/' + id)
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                }
            };
            return topicsvc;
        }
    ]);


}());