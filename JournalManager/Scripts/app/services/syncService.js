﻿(function () {
    'use strict';
    var app = angular.module('app');
    app.service('syncService',
    [
        'Offline', 'localDBService', 'dbModel', '$q', 'remotePersistenceStrategy',
        function (Offline, localDBService, dbModel, $q, remotePersistenceStrategy) {
            var svc = {
                check: function() {
                    var deferred = $q.defer();
                    localDBService.open(dbModel).then(function() {
                        localDBService.getCount(dbModel.objectStoreName).then(
                            function (count) {
                                if (count != undefined) {
                                    deferred.resolve(count > 0);
                                } else {
                                    deferred.resolve(false);
                                }
                            }, deferred.reject);
                    }, deferred.rejec);
                    return deferred.promise;
                },
                monitorUp: function() {
                    var deferred = $q.defer();
                    Offline.on('confirmed-up', function() {
                        svc.check().then(function(result) {
                            deferred.resolve(result);
                        }, deferred.reject);
                    });
                    return deferred.promise;
                },
                monitorDown: function() {
                    var deferred = $q.defer();
                    Offline.on('confirmed-down', function() {
                        deferred.resolve(false);
                    });
                    return deferred.promise;
                },
                sync: function() {
                    var deferred = $q.defer();
                    localDBService.open(dbModel).then(function() {
                        localDBService.getAll(dbModel.objectStoreName).then(function(homes) {
                            remotePersistenceStrategy.save(homes).then(function(result) {
                                if (result) {
                                    localDBService.clear(dbModel.objectStoreName).then(function(res) {
                                        deferred.resolve(true);
                                    }, deferred.reject);
                                } else {
                                    deferred.reject('Unable to clear object store');
                                }
                            }, deferred.reject);
                        }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                }
            };
            return svc;
        }]);
}());