(function() {
        'use strict';
        var app = angular.module('app');
        app.service('authenticationService',
        [
            'Base64', '$http', '$cookies', '$rootScope', '$timeout', '$window',
            function (Base64, $http, $cookies, $rootScope, $timeout, $window) {
                var service = {};

                service.Login = function (username, password, callback) {

                    /* Dummy authentication for testing, uses $timeout to simulate api call
                     ----------------------------------------------*/
                    //$timeout(function () {
                    //    var response = { success: username === 'test' && password === 'test' };
                    //    if (!response.success) {
                    //        response.message = 'Username or password is incorrect';
                    //    }
                    //    callback(response);
                    //}, 1000);
                    var response = { success: true };
                    callback(response);
                    /* Use this for real authentication
                     ----------------------------------------------*/
                    //$http.post('/api/authenticate', { username: username, password: password })
                    //    .success(function (response) {
                    //        callback(response);
                    //    });

                };

                service.SetCredentials = function (username, password) {
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
                };

                service.ClearCredentials = function () {
                    $rootScope.globals = {};
                    $cookies.remove('globals');
                    $http.defaults.headers.common.Authorization = 'Basic ';
                    $window.sessionStorage.removeItem('user');
                };
                service.GetCredentials = function () {
                    if ($window.sessionStorage.getItem('user') != null) {
                        return $window.sessionStorage.getItem('user');
                    }
                    return "";
                };
                return service;

            }
        ]);
    }()
);
