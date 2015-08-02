(function() {
        'use strict';
        var app = angular.module('app');
        app.service('authenticationService',
        [
            'Base64', '$http', '$q', '$cookies', '$rootScope', 'UsersLocalServerService', '$window',
            function (Base64, $http, $q, $cookies, $rootScope, UsersLocalServerService, $window) {
                var service = {
                    //dbUserModel: dbUserModel,
                    //localDBService: localDBService,
                    logout : function() {
                        this.ClearCredentials();
                    },
                    Login : function (username, password, callback) {
                    
                    /* Dummy authentication for testing, uses $timeout to simulate api call
                     ----------------------------------------------*/
                    //$timeout(function () {
                    //    var response = { success: username === 'test' && password === 'test' };
                    //    if (!response.success) {
                    //        response.message = 'Username or password is incorrect';
                    //    }
                    //    callback(response);
                    //}, 1000);
                        var response = { success: username === 'zuoqin' && password === 'Qwerty123' };
                        var deferred = $q.defer();
                        if (username === 'zuoqin') {
                            var user = UsersLocalServerService.getById(username);
                            if (user === undefined || user === null)
                                UsersLocalServerService.insert({ username: username, password: password });
                            callback(response);
                            //localDBService.open(service.dbUserModel).then(function () {
                            //    localDBService.getUser(service.dbUserModel, username).then(function(user) {
                            //        if (user === undefined) {
                            //            user = { username: username, password: password };
                            //            localDBService.setUser(service.dbUserModel, user);
                            //        };
                            //        callback(response);
                            //    }, deferred.reject);
                            //}, deferred.reject);
                        };
                        
                    /* Use this for real authentication
                     ----------------------------------------------*/
                    //$http.post('/api/authenticate', { username: username, password: password })
                    //    .success(function (response) {
                    //        callback(response);
                    //    });

                    },

                    SetCredentials : function (username, password) {
                    var authdata = Base64.encode(username + ':' + password);

                    $rootScope.globals = {
                        currentUser: {
                            username: username,
                            authdata: authdata
                        }
                    };

                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                    $cookies.put('globals', $rootScope.globals);
                    $window.sessionStorage.setItem('user', authdata);
                    },

                    ClearCredentials : function () {
                        $rootScope.globals = {};
                        $cookies.remove('globals');
                        $http.defaults.headers.common.Authorization = 'Basic ';
                        $window.sessionStorage.removeItem('user');
                        UsersLocalServerService.removeAll();
                    },
                    GetCredentials : function () {
                        if ($window.sessionStorage.getItem('user') != null) {
                            return $window.sessionStorage.getItem('user');
                        }
                        var user = UsersLocalServerService.getUser();
                        if (user !== undefined) {
                            var authdata = Base64.encode(user.username + ':' + user.password);
                            $window.sessionStorage.setItem('user', authdata);
                            return $window.sessionStorage.getItem('user');
                        }
                        return "";
                    }
                };
                return service;
            }
        ]);
    }()
);
