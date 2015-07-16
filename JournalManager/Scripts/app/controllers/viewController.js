(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('viewController',
    [
        '$scope', '$sce', '$location', 'persistenceService', 'Offline',
        function ($scope, $sce, $location, persistenceService, Offline) {
            $scope.showSuccessMessage = false;
            $scope.showFillOutFormMessage = false;
            $scope.isOnline = true;
            $scope.item = {};

            var parts = $location.absUrl().split('/');
            var id = parts[parts.length - 1];
            var uuidLength = 36;
            if (id.length != uuidLength) {
                id = null;
            }
            if (id != null) {
                persistenceService.getById(id).then(
                    function (item) {
                        //$scope.item = item;

                        $scope.item.ItemId = item.ItemId;
                        $scope.item.Title = $sce.trustAsHtml(item.Title);
                        $scope.item.Introduction = $sce.trustAsHtml(item.Introduction);
                        $scope.item.modifiedDate = item.modifiedDate;
                        $scope.item.TopicId = item.TopicId;
                        $scope.item.UserId = item.UserI;
                        $scope.item.Contents = $sce.trustAsHtml(item.Contents);
                    },
                    function (error) {
                        $scope.error = error;
                    });
            }

            Offline.on('confirmed-down', function () {
                $scope.$apply(function () {
                    $scope.isOnline = false;
                });
            });
            Offline.on('confirmed-up', function () {
                $scope.$apply(function () {
                    $scope.isOnline = true;
                });
            });
        }]);
}());