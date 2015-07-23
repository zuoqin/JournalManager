(function() {
    'use strict';
    var app = angular.module('app');
    app.controller('itemsController',
    [
        '$scope','$sce', '_', 'persistenceService', 'Offline','authenticationService',
    function($scope, $sce, _, persistenceService, Offline, authenticationService) {
            $scope.showList = false;
            $scope.items = [];
            var getData = function() {
                if( authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
                    persistenceService.action.getAll().then(
                        function (items) {


                            items.forEach(function (item) {
                                $scope.items.push({
                                    ItemId: item.ItemId,
                                    Title: $sce.trustAsHtml(item.Title),
                                    Introduction: $sce.trustAsHtml(item.Introduction),
                                    modifiedDate: item.modifiedDate,
                                    TopicId: item.TopicId,
                                    UserId: item.UserId,
                                    Contents: $sce.trustAsHtml(item.Contents)
                                });
                            });


                            //$scope.items = items;
                            $scope.showList = true;
                            $scope.showEmptyListMessage = (items.length === 0);
                        },
                        function (error) {
                            $scope.error = error;
                        });
                };

            };
            var lazyGetData = _.debounce(getData, 5000);
            //Offline.on('confirmed-down', lazyGetData);
            //Offline.on('confirmed-up', lazyGetData);
            lazyGetData();

            $scope.delete = function(index) {
                var id = $scope.items[index].ItemId;
                persistenceService.action.delete(id).then(
                    function(result) {
                        $scope.items.splice(index, 1);
                    },
                    function(error) {
                        $scope.error = error;
                    });
            };
        }]);
}());