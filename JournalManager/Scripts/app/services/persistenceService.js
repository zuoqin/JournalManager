(function() {
        'use strict';
        var app = angular.module('app');
        app.service('persistenceService',
        [
            '$q', 'Offline', 'remotePersistenceStrategy', 'localPersistenceStrategy',
            function($q, Offline, remotePersistenceStrategy, localPersistenceStrategy) {
                var self = this;

                self.persistenceType = 'local';
                
                //Offline.options = { checks: { xhr: { url: '/favicon.ico' } } };
                //Offline.check();
                //if (Offline.state === 'up')
                //    self.action = remotePersistenceStrategy;
                //else
                    self.action = localPersistenceStrategy;
                

                //Offline.on('confirmed-down', function() {
                //    self.action = localPersistenceStrategy;
                //    self.persistenceType = 'local';
                //});
                //Offline.on('confirmed-up', function () {
                //    self.action = remotePersistenceStrategy;
                //    self.persistenceType = 'remote';
                //});
                    self.ClearLocalDB = function () {
                        var deferred = $q.defer();
                        localPersistenceStrategy.clearAll().then(
                            function() {
                                deferred.resolve();
                            }, deferred.reject
                            );
                        return deferred.promise;
                }
                self.setAction = function (id) {
                    if (id === 0) {
                        self.action = remotePersistenceStrategy;
                    } else {
                        self.action = localPersistenceStrategy;
                    }
                };
                self.getAction = function() {
                    if (self.action === remotePersistenceStrategy) {
                        return 0;
                    } else {
                        return 1;
                    }
                }
                self.getRemoteItem = function(id) {
                    return remotePersistenceStrategy.getById(id);
                };
                self.getLocalItem = function (id) {
                    return localPersistenceStrategy.getById(id);
                };
                self.getUser = function (username) {
                    return localPersistenceStrategy.getUser(username);
                };
                self.setUser = function (user) {
                    return localPersistenceStrategy.setUser(user);
                };
                self.getById = function (id) {
                    var deferred = $q.defer();
                    //if (Offline.state === 'up') {
                    if (self.action === remotePersistenceStrategy) {
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