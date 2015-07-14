(function() {
    'use strict';
    var app = angular.module('app');
    app.controller('itemsController',
    [
        '$scope', '_', 'persistenceService', 'Offline',
        function($scope, _, persistenceService, Offline) {
            $scope.showList = false;
            var getData = function() {
                persistenceService.action.getAll().then(
                    function(items) {
                        $scope.items = items;
                        $scope.showList = true;
                        $scope.showEmptyListMessage = (items.length === 0);
                    },
                    function(error) {
                        $scope.error = error;
                    });
            };
            var lazyGetData = _.debounce(getData, 50);
            Offline.on('confirmed-down', lazyGetData);
            Offline.on('confirmed-up', lazyGetData);
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