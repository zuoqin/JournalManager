(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('loginController',
    [
        '$scope', '$rootScope', '$location', 'authenticationService',
        function ($scope, $rootScope, $location, authenticationService) {
        //authenticationService.ClearCredentials();
            $rootScope.showList = false;
        if( authenticationService.GetCredentials() != null && authenticationService.GetCredentials().length > 0) {
            $rootScope.isLoggedIn = true;
        } else {
            $rootScope.isLoggedIn = false;
            $rootScope.showList = true;
        }
        $rootScope.showEmptyListMessage = false;


        $scope.login = function () {
            $rootScope.dataLoading = true;
            $rootScope.isLoggedIn = false;
            $rootScope.showList = true;
            authenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    authenticationService.SetCredentials($scope.username, $scope.password);
                    $rootScope.dataLoading = false;
                    $rootScope.isLoggedIn = true;
                    //$rootScope.$apply(function () {

                        //$location.path('/Items');
                        //$location.reload();
                        //console.log($location.path());
                        window.location.href = "/Items";
                    //});
                    //$location.path("/");
                } else {
                    $rootScope.error = response.message;
                    $rootScope.dataLoading = false;
                }
                
            });
        };

        $scope.tologin = function () {
            $rootScope.dataLoading = true;
            $rootScope.isLoggedIn = false;
            $rootScope.showList = true;
            window.location.href = "/Account/Login";
        };

        $scope.logout = function () {
            $rootScope.dataLoading = false;
            $rootScope.isLoggedIn = false;
            
            $rootScope.items = [];
            $rootScope.topics = [];
            authenticationService.logout();
            window.location.href = "/";
        };
        }]);
}());