(function() {
    'use strict';
    var app = angular.module('app');
    app.controller('topicsController',
    [
        '$scope','$sce', '_', 'topicsService',
        function($scope, $sce, _, topicsService) {
            $scope.showList = false;
            $scope.topics = [];
            var getData = function () {
                topicsService.getAll().then(
                    function (topics) {


                        topics.forEach(function (topic) {
                            $scope.topics.push({
                                TopicId: topic.TopicId,
                                Description: $sce.trustAsHtml(topic.Description)
                            });
                        });


                        //$scope.items = items;
                        $scope.showList = true;
                        $scope.showEmptyListMessage = (topics.length === 0);
                    },
                    function (error) {
                        $scope.error = error;
                    });
            };
            var lazyGetData = _.debounce(getData, 1000);
            //Offline.on('confirmed-down', lazyGetData);
            //Offline.on('confirmed-up', lazyGetData);
            lazyGetData();

            $scope.delete = function (index) {
                var id = $scope.topics[index].TopicId;
                topicsService.delete(id).then(
                    function (result) {
                        $scope.topics.splice(index, 1);
                    },
                    function (error) {
                        $scope.error = error;
                    });
            };
        }]);
}());