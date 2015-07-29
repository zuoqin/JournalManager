(function () {
    'use strict';
    var app = angular.module('app');

    app.factory('remotePersistenceStrategy',
    [
        '$http', '$q','authenticationService',
    function($http, $q, authenticationService) {
            var svc = {
                save: function(item) {
                    var deferred = $q.defer();
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                    $http.post('/api/Item', item)
                        .success(function() {
                                deferred.resolve();
                            }
                            )
                        .error(deferred.reject);
                    return deferred.promise;
                },
                getAll: function() {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                    var deferred = $q.defer();
                    $http.get('/api/Item')
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                } ,
                getById: function(id) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                    var deferred = $q.defer();
                    $http.get('/api/Item/' + id)
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                } ,
                'delete': function (id) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authenticationService.GetCredentials();
                    var deferred = $q.defer();
                    $http.delete('/api/Item/' + id)
                        .success(deferred.resolve)
                        .error(deferred.reject);
                    return deferred.promise;
                }
            };
            return svc;
        }
    ]);

    app.factory('localPersistenceStrategy',
    [
        '$q', 'localDBService', 'nullItem', 'dbModel', 'dbUserModel',
        function ($q, localDBService, nullItem, dbModel, dbUserModel) {
            var svc = {
                dbModel: dbModel,
                dbUserModel : dbUserModel,
                localDBService: localDBService,
                clearAll: function() {
                    var deferred = $q.defer();
                    localDBService.open(dbModel).then(function () {
                        localDBService.clear(dbModel.objectStoreName).then(function (res) {
                            if (res) {
                                deferred.resolve(true);
                            } else {
                                deferred.reject("Unable to clear object store");
                            }
                        }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                save: function (item) {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbModel).then(function(e) {
                        var id = item.ItemId;
                        if (id === null || id === undefined) {
                            localDBService.insert(svc.dbModel.objectStoreName, item, 'ItemId')
                                .then(deferred.resolve, deferred.reject);
                        } else {
                            svc.exists(id).then(function(doesExist) {
                                if (doesExist) {
                                    localDBService.update(svc.dbModel.objectStoreName, item, id)
                                        .then(deferred.resolve, deferred.reject);
                                } else {
                                    localDBService.insert(svc.dbModel.objectStoreName, item, 'id')
                                        .then(deferred.resolve, deferred.reject);
                                }
                            }, deferred.reject);
                        }
                    }, deferred.reject);
                    return deferred.promise;
                },
                getAll: function () {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbModel).then(function () {
                        localDBService.getAll(svc.dbModel.objectStoreName)
                            .then(deferred.resolve, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                getById: function (id) {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbModel).then(function() {
                        localDBService.getById(svc.dbModel.objectStoreName, id)
                            .then(function (res) {
                                if (res) {
                                    deferred.resolve(res);
                                }
                                    
                                }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                getUser: function (userName) {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbUserModel).then(function () {
                        localDBService.getUser(svc.dbUserModel.objectStoreName, userName)
                            .then(function (res) {
                                if (res) {
                                    deferred.resolve(res);
                                }
                                    
                            }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                setUser: function (user) {
                    var deferred = $q.defer();
                    localDBService.open(svc.dbUserModel).then(function(e) {
                        var id = user.username;

                        svc.userexists(id).then(function (doesExist) {
                            if (doesExist) {
                                localDBService.update(svc.dbUserModel.objectStoreName, user, id)
                                    .then(deferred.resolve, deferred.reject);
                            } else {
                                localDBService.insert(svc.dbModel.objectStoreName, user, 'username')
                                    .then(deferred.resolve, deferred.reject);
                            }
                        }, deferred.reject);
                    }, deferred.reject);
                    return deferred.promise;
                },
                userexists: function(username) {
                    var deferred = $q.defer();
                    svc.getUser(username).then(function (_Event) {
                        var item = _Event;
                        if (item != undefined && item !== true) {
                            deferred.resolve(item.username === username);
                        } else {
                            deferred.resolve(false);
                        }
                    },deferred.reject);
                    return deferred.promise;
                },
                exists: function(id) {
                    var deferred = $q.defer();
                    svc.getById(id).then(function (_Event) {
                        var item = _Event;
                        if (item != undefined && item !== true) {
                            deferred.resolve(item.ItemId === id);
                        } else {
                            deferred.resolve(false);
                        }
                    },deferred.reject);
                    return deferred.promise;
                },
                'delete': function (id) {
                    var deferred = $q.defer();
                    localDBService.delete(svc.dbModel.objectStoreName, id)
                            .then(deferred.resolve, deferred.reject);
                    return deferred.promise;
                }
            };
            return svc;
        }
    ]);


}());