﻿(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('editController',
    [
        '$scope', '$location', 'persistenceService', 'Offline',
        function ($scope, $location, persistenceService, Offline) {
            $scope.showSuccessMessage = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.home = {};

            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 2];
            var uuidLength = 36;
            if (id.length != uuidLength) {
                id = null;
            }
            if (id != null) {
                persistenceService.getById(id).then(
                    function(home) {
                        $scope.home = home;
                    },
                    function(error) {
                        $scope.error = error;
                    });
            }

            $scope.cancel = function() {
                window.location = '/';
            };

            var hasAHomeToSave = function() {
                var hasValue = function(value) {
                    if (typeof value === 'string') {
                        return value.length > 0;
                    }
                    return value > 0;
                };

                var returnValue =
                    hasValue($scope.home.streetAddress)
                        && hasValue($scope.home.city)
                        && hasValue($scope.home.price);
                return returnValue;
            };

            $scope.save = function() {
                var saveHome = hasAHomeToSave();
                $scope.showFillOutFormMessage = !saveHome;
                if (saveHome) {
                    var home = $scope.home;
                    home.id = id;
                    persistenceService.action.save(home).then(
                        function(result) {
                            $scope.showSuccessMessage = true;
                            $scope.showErrorMessage = false;
                        },
                        function(error) {
                            $scope.showSuccessMessage = false;
                            $scope.showErrorMessage = true;
                        });
                }

            }
            //$scope.cancel = 

            Offline.on('confirmed-down', function () {
                $scope.$apply(function () {
                    $scope.isOnline = false;
                });
            });
            Offline.on('confirmed-up', function () {
                $scope.$apply(function() {
                    $scope.isOnline = true;
                });
            });
        }]);
}());