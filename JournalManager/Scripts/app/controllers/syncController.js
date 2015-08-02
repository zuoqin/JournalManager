(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('syncController',
    [
        '$rootScope', '$scope', '$timeout', 'syncService','authenticationService',
        function ($rootScope, $scope, $timeout, syncService, authenticationService) {
            if (authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
                $rootScope.isLoggedIn = true;
            } else {
                $rootScope.isLoggedIn = false;
                $rootScope.showList = true;
            }
            syncService.monitorUp().then(
                function(result) {
                    $timeout(function() {
                        $rootScope.hasLocalDataToSync = result;
                    });
                },
                function(error) {
                    $scope.error = error;
                });
            syncService.monitorDown().then(
                function (result) {
                    $timeout(function () {
                        $rootScope.hasLocalDataToSync = false;//result;
                    });
                },
                function (error) {
                    $rootScope.error = error;
                });
            $scope.sync = function () {
                $rootScope.showList = false;
                syncService.sync().then(
                    function (result) {
                        $rootScope.showList = true;
                        $rootScope.hasLocalDataToSync = false;
                    },
                    function(error) {
                        $rootScope.error = error;
                    });
            }

            syncService.check().then(
                function(result) {
                    $timeout(function() {
                        $rootScope.hasLocalDataToSync = result;
                    });
                },
                function(error) {
                    $rootScope.error = error;
                });
        }]);
}());