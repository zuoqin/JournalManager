﻿(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('editController',
    [
        '$scope', '$rootScope', '$location', 'persistenceService', 'Offline',
        function ($scope, $rootScope, $location, persistenceService, Offline) {
            $scope.showSuccessMessage = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.item = {};
            $rootScope.showList = false;
            $rootScope.showItems = false;

            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 1];
            var uuidLength = 36;
            if (id.length != uuidLength) {
                id = null;
            }
            if (id != null) {
                persistenceService.getById(id).then(
                    function(item) {
                        $scope.item = item;
                    },
                    function(error) {
                        $scope.error = error;
                    });
            }

            $scope.cancel = function() {
                window.location = '/items';
            };

            var hasAnItemToSave = function() {
                var hasValue = function(value) {
                    if (typeof value === 'string') {
                        return value.length > 0;
                    }
                    return value > 0;
                };

                var returnValue =
                    hasValue($scope.item.Introduction)
                        && hasValue($scope.item.Contents);
                return returnValue;
            };

            $scope.save = function() {
                var saveItem = hasAnItemToSave();
                $scope.showFillOutFormMessage = !saveItem;
                if (saveItem) {
                    var item = $scope.item;
                    if (id === null || id === undefined ) {
                        id = Math.uuid();
                    }
                    item.ItemId = id;


                    //Temp code
                    if (item.UserId == 0 || item.UserId === undefined) {
                        item.UserId = 1;
                    }
                    if (item.TopicId == 0 || item.TopicId === undefined) {
                        item.TopicId = 1;
                    }
                    persistenceService.action.save(item).then(
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