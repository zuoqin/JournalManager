(function() {
    'use strict';
    var app = angular.module('app');
    app.controller('itemsController',
    [
        '$scope','$sce', '_', 'persistenceService', 'Offline','authenticationService',
    function($scope, $sce, _, persistenceService, Offline, authenticationService) {
        $scope.showList = false;
        if (authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
            $scope.isLoggedIn = true;
        } else {
            $scope.isLoggedIn = false;
        }
            var getData = function () {
                $scope.items = [];
                //if (persistenceService.getAction() === 0) {
                //    persistenceService.ClearLocalDB().then(
                //        persistenceService.setAction(1));
                //};
                if( authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
                    persistenceService.action.getAll().then(
                        function (items) {
                            if (persistenceService.getAction() === 0) {
                                persistenceService.ClearLocalDB().then(
                                    function() {
                                        persistenceService.setAction(1);
                                        items.forEach(function (item) {
                                            //if (persistenceService.getAction() === 0) {
                                            persistenceService.action.save(item).then(
                                                function() {
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
                                            //}
                                        });
                                    }
                                    );
                                
                            } else {
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
                                    //if (persistenceService.getAction() === 0) {
                                    persistenceService.action.save(item);
                                    //}
                                });

                            }





                            //$scope.items = items;
                            $scope.showList = true;
                            $scope.showEmptyListMessage = (items.length === 0);
                        },
                        function (error) {
                            $scope.error = error;
                        });
                };

            };
            var lazyGetData = _.debounce(getData, 1000);
            //Offline.on('confirmed-down', lazyGetData);
            //Offline.on('confirmed-up', lazyGetData);
            lazyGetData();
            $scope.download = function () {
                persistenceService.setAction(0);
                lazyGetData();
            };

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