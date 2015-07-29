(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('syncController',
    [
        '$scope', '$timeout', 'syncService','authenticationService',
        function ($scope, $timeout, syncService, authenticationService) {
            if (authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
                $scope.isLoggedIn = true;
            } else {
                $scope.isLoggedIn = false;
            }
            syncService.monitorUp().then(
                function(result) {
                    $timeout(function() {
                        $scope.hasLocalDataToSync = result;
                    });
                },
                function(error) {
                    $scope.error = error;
                });
            syncService.monitorDown().then(
                function (result) {
                    $timeout(function () {
                        $scope.hasLocalDataToSync = false;//result;
                    });
                },
                function (error) {
                    $scope.error = error;
                });
            $scope.sync = function () {
                $scope.showList = false;
                syncService.sync().then(
                    function(result) {
                        $scope.hasLocalDataToSync = false;
                    },
                    function(error) {
                        $scope.error = error;
                    });
            }

            syncService.check().then(
                function(result) {
                    $timeout(function() {
                        $scope.hasLocalDataToSync = result;
                    });
                },
                function(error) {
                    $scope.error = error;
                });
        }]);
}());