(function() {
    'use strict';
    var app = angular.module('app');
    app.controller('itemsController',
    [
        '$scope','$sce', '_', 'persistenceService', 'Offline','authenticationService','$q','$rootScope',
    function ($scope, $sce, _, persistenceService, Offline, authenticationService, $q,$rootScope) {
        $scope.showList = false;
        if (authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
            $scope.isLoggedIn = true;
        } else {
            $scope.isLoggedIn = false;
        }
            var getData = function () {
                $rootScope.items = [];
                $scope.showList = false;
                $scope.thisList = false;
                var deferred = $q.defer();
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
                                                    $rootScope.items.push({
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
                                    $rootScope.items.push({
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

                            deferred.resolve(true);
                            $scope.showList = true;
                            $scope.showEmptyListMessage = (items.length === 0);


                        },
                        function (error) {
                            $scope.error = error;
                        });
                };
                return deferred.promise;
            };
            var lazyGetData = _.debounce(getData, 1000);
            //Offline.on('confirmed-down', lazyGetData);
            //Offline.on('confirmed-up', lazyGetData);
            lazyGetData();
            var waitTimeout = function() {
                var deferred = $q.defer();
                setTimeout(function () {

                    deferred.resolve(true);
                }, 1000);
                return deferred.promise;
            }
            $scope.download = function () {
                $scope.showList = false;
                persistenceService.setAction(0);
                lazyGetData();
            };

            $scope.search = function () {
                var items = [];
                getData().then(function () {
                    var srch = $scope.filtertext;
                    if ($rootScope.items !== undefined) {
                        for (var i = 0 ; i < $rootScope.items.length ; i++) {
                            if ($rootScope.items[i].Title.toString().indexOf(srch) > -1) {
                                items.push($rootScope.items[i]);
                            };
                        };
                        $rootScope.items = items;
                    }


                    }
                    );
            };
            $scope.syncronize = function () {
                
            }
            $scope.delete = function(index) {
                var id = $rootScope.items[index].ItemId;
                persistenceService.action.delete(id).then(
                    function(result) {
                        $rootScope.items.splice(index, 1);
                    },
                    function(error) {
                        $scope.error = error;
                    });
            };
        }]);
}());