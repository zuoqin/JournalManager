(function() {
    'use strict';
    var app = angular.module('app');
    app.controller('itemsController',
    [
        '$scope','$sce', '_', 'persistenceService', 'Offline','authenticationService','$q','$rootScope',
    function ($scope, $sce, _, persistenceService, Offline, authenticationService, $q,$rootScope) {
        $rootScope.showList = false;
        $rootScope.showItems = true;
        if (authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
            $rootScope.isLoggedIn = true;
        } else {
            $rootScope.isLoggedIn = false;
            $rootScope.showList = true;
            $rootScope.showItems = false;
        }
            var getData = function () {
                $rootScope.items = [];
                $rootScope.showList = false;
                $scope.thisList = false;
                var deferred = $q.defer();
                if( authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
                    persistenceService.action.getAll().then(
                        function (items) {
                            if (persistenceService.getAction() === 0) {
                                persistenceService.ClearLocalDB().then(
                                    function() {
                                        persistenceService.setAction(1);
                                        items.sort(function(a, b) {
                                            return new Date(b.modifiedDate) - new Date(a.modifiedDate);
                                        });
                                        items.forEach(function (item) {
                                            //if (persistenceService.getAction() === 0) {
                                            persistenceService.action.save(item).then(
                                                function() {
                                                    $rootScope.items.push({
                                                        ItemId: item.ItemId,
                                                        Title: $sce.trustAsHtml(item.Title),
                                                        Introduction: $sce.trustAsHtml(item.Introduction),
                                                        modifiedDate: new Date(item.modifiedDate),
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
                                items.sort(function (a, b) {
                                    return new Date(b.modifiedDate) - new Date(a.modifiedDate);
                                });
                                items.forEach(function (item) {
                                    $rootScope.items.push({
                                        ItemId: item.ItemId,
                                        Title: $sce.trustAsHtml(item.Title),
                                        Introduction: $sce.trustAsHtml(item.Introduction),
                                        modifiedDate: new Date(item.modifiedDate),
                                        TopicId: item.TopicId,
                                        UserId: item.UserId,
                                        Contents: $sce.trustAsHtml(item.Contents)
                                    });
                                    //if (persistenceService.getAction() === 0) {
                                    //persistenceService.action.save(item);

                                    //}
                                });
                                
                                
                            }

                            deferred.resolve(true);
                            $rootScope.showList = true;
                            
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
            if ($rootScope.showItems === true) {
                lazyGetData();
            }
            
            var waitTimeout = function() {
                var deferred = $q.defer();
                setTimeout(function () {

                    deferred.resolve(true);
                }, 1000);
                return deferred.promise;
            }
            $scope.download = function () {
                $rootScope.showList = false;
                persistenceService.setAction(0);
                lazyGetData();
            };

            $scope.search = function () {
                var items = [];
                $rootScope.showList = false;
                getData().then(function () {
                    var srch = $scope.filtertext;
                    if ($rootScope.items !== undefined) {
                        for (var i = 0 ; i < $rootScope.items.length ; i++) {
                            if ($rootScope.items[i].Title.toString().toLowerCase().indexOf(srch.toLowerCase()) > -1 ||
                                $rootScope.items[i].Introduction.toString().toLowerCase().indexOf(srch.toLowerCase()) > -1 ||
                                $rootScope.items[i].Contents.toString().toLowerCase().indexOf(srch.toLowerCase()) > -1) {
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