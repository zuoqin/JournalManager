(function() {
        'use strict';
        var app = angular.module('app');
        app.service('persistenceService',
        [
            '$q', 'Offline', 'remotePersistenceStrategy', 'localPersistenceStrategy',
            function($q, Offline, remotePersistenceStrategy, localPersistenceStrategy) {
                var self = this;

                self.persistenceType = 'remote';
                self.action = remotePersistenceStrategy;

                Offline.on('confirmed-down', function() {
                    self.action = localPersistenceStrategy;
                    self.persistenceType = 'local';
                });
                Offline.on('confirmed-up', function () {
                    self.action = remotePersistenceStrategy;
                    self.persistenceType = 'remote';
                });


                self.getRemoteHome = function(id) {
                    return remotePersistenceStrategy.getById(id);
                };
                self.getLocalHome = function (id) {
                    return localPersistenceStrategy.getById(id);
                };

                self.getById = function(id) {
                    var deferred = $q.defer();
                    if (Offline.state = 'up') {
                        var remoteHome = {},
                            localHome = {};
                        self.getRemoteHome(id).then(function(rHome) {
                            remoteHome = rHome;
                            self.getLocalHome(id).then(function(lHome) {
                                localHome = lHome;
                                if (localHome.modifiedDate > (new Date(remoteHome.modifiedDate))) {
                                    deferred.resolve(localHome);
                                } else {
                                    deferred.resolve(remoteHome);
                                }
                            }, deferred.reject);
                        }, deferred.reject);
                    } else {
                        self.getLocalHome(id).then(deferred.resolve, deferred.reject);
                    }
                    return deferred.promise;
                };
                return self;
            }
        ]);
    }()
);