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


                self.getRemoteItem = function(id) {
                    return remotePersistenceStrategy.getById(id);
                };
                self.getLocalItem = function (id) {
                    return localPersistenceStrategy.getById(id);
                };

                self.getById = function(id) {
                    var deferred = $q.defer();
                    if (Offline.state = 'up') {
                        var remoteItem = {},
                            localItem = {};
                        self.getRemoteItem(id).then(function(rItem) {
                            remoteItem = rItem;
                            self.getLocalItem(id).then(function(lItem) {
                                localItem = lItem;
                                if (localItem.modifiedDate > (new Date(remoteItem.modifiedDate))) {
                                    deferred.resolve(localItem);
                                } else {
                                    deferred.resolve(remoteItem);
                                }
                            }, deferred.reject);
                        }, deferred.reject);
                    } else {
                        self.getLocalItem(id).then(deferred.resolve, deferred.reject);
                    }
                    return deferred.promise;
                };
                return self;
            }
        ]);
    }()
);