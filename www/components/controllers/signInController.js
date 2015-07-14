application.controller('SignInCtrl', function($scope, $http, $ionicPopup, $state, $interval, $ionicHistory) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  if (lsSupports()) {
    userId = localStorage.getItem("userId");
  } else {
    throw new Error("Local storage is not supported");
  }
  
  if (!isFeedObseverStarted) {
    $interval(function() {
      console.log('feed Started');
      getFeed($http, $state);
    }, 30000);


    isFeedObseverStarted = true;
  }

  if (userId != null) {
    userData = {
      id: userId
    };
    console.log('feed one Time without login');
    getFeed($http, $state);
    $state.go('app.events');
    return;
  }
  console.log('In SignIn Controller');
  $scope.login = 'qwert';
  $scope.pass = '11111111';
  $scope.signIn = function(login, pass) {
    $http.get('http://localhost:3000/?act=signin&login=' + login + '&password=' + pass)
      .success(function(data, status, headers, config) {
        if (data.status === 'error') {
          $ionicPopup.alert({
            title: 'error',
            template: data.msg
          });
        } else {
          userData = {
            id: data.uId,
            token: data.token
          };

          localStorage.setItem("userId", data.uId);
          console.log('feed one Time on login');
          getFeed($http, $state);
          
          $state.go('app.events');
          //$location.path("/tab/trips");
        }

      })
      .error(function(data, status, headers, config) {
        console.log(data);
      });
  };

});