(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('loginController',
    [
        '$scope', '$rootScope', '$location', 'authenticationService',
        function ($scope, $rootScope, $location, authenticationService) {
        authenticationService.ClearCredentials();
        $scope.showList = true;
        $scope.showEmptyListMessage = false;
        $scope.login = function () {
            $scope.dataLoading = true;
            authenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    authenticationService.SetCredentials($scope.username, $scope.password);
                    $scope.dataLoading = false;
                    $rootScope.$apply(function () {

                        //$location.path('/Items');
                        //$location.reload();
                        //console.log($location.path());
                        window.location.href = "/Items";
                    });
                    //$location.path("/");
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
                
            });
        };
        }]);
}());