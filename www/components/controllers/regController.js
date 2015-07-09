application.controller('RegCtrl', function($scope, $http, $ionicPopup) {
  var validLogin = false;
  $scope.checkLogin = function(userLogin) {
    if (isUndef(userLogin) || userLogin === '') {
      return;
    }
    $http.get('http://localhost:3000/?act=checkLogin&login=' + userLogin)
      .success(function(data, status, headers, config) {
        if (data.status == 'error') {
          showAlert('error', 'Current login is already busy', $ionicPopup);
          validLogin = false;
        } else {
          validLogin = true;
        }
      })
      .error(function(data, status, headers, config) {
        //$scope.showAlert(status, data);
        console.log(data);
      });

  };

  $scope.register = function(regData, form) {
    if (isUndef(regData) || isUndef(regData.login) || isUndef(regData.password) || isUndef(regData.verifypass) || regData.password === '' || regData.verifypass === '' || regData.login === '') {
      showAlert('error', 'All fields are required', $ionicPopup);
      return;
    }
    if (!(/^[a-zA-Z0-9!@#$%^&_]{8,}$/.test(regData.password))) {
      showAlert('error', 'Password should contain latin letters, numbers or !@#$%^&_ symbols and length more 8 symbols', $ionicPopup);
      return;
    }
    if (!(/^[a-zA-Z0-9]{5,}$/.test(regData.login))) {
      showAlert('error', 'Login should contain latin letters or numbers and length more 5 symbols', $ionicPopup);
      return;
    }
    if (regData.password != regData.verifypass) {
      showAlert('error', 'Passwords do not match', $ionicPopup);
      return;
    }
    if (!validLogin) {
      showAlert('error', 'Current login is already busy', $ionicPopup);
      return;
    }
    //$http.get('http://localhost:3000/?act=regme&login=@$$4@&password='+regData.password)
    $http.get('http://localhost:3000/?act=regme&login=' + regData.login + '&password=' + regData.password)
      .success(function(data, status, headers, config) {
        if (data.status == 'Registration complete') {
          showAlert('Confirm', 'Registration done!', $ionicPopup);
          return;
        } else {
          showAlert('error', 'We got an error here, try later', $ionicPopup);
          return;
        }
      })
      .error(function(data, status, headers, config) {
        //$scope.showAlert(status, data);
        console.log(data);
      });
    //console.log((/^[a-zA-Z0-9]+$/.test(regData.login)));
  };
});