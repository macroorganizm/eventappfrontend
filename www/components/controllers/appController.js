application.controller('AppCtrl', function($scope, $http, $state) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.logout = function() {
    execGetRequest($http, $state, 'logout', '', function(data) {
        if (data.status == 'ok') {
          localStorage.removeItem('userId');
          userData = {};
          $state.go('app.signin');
        }
      });
  }
  
  // Form data for the login modal
 
});