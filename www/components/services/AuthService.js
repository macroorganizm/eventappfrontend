applicationServices.factory('AuthService', function($http, $state, $q) {

  var factory = {
    checkLogin : checkLogin,
    register : register,
    signIn : signIn 
  };

  return factory;

  function checkLogin(login, cb) {
    
    var params = '&login=' + login;

    execUnAuthRequest($http, $state, 'checkLogin', params, function(data) {
      if (data.status == 'error') {
      	cb('Current login is already busy');
        
        //$scope.friends = data.friendsList;
      } else {
      	cb(null, data);
      }
      
    });
    
    
  }

  function register(login, pass, cb) {
  	var params = '&login=' + login + '&password=' + pass;

    execUnAuthRequest($http, $state, 'regme', params, function(data) {
      if (data.status == 'error') {
      	cb('We got an error here, try later');
        
        //$scope.friends = data.friendsList;
      } else {
      	cb(null, 'Registration done!');
      }
      
    });
  }

  function signIn(login, pass, cb) {
  	var params = '&login=' + login + '&password=' + pass;

    execUnAuthRequest($http, $state, 'signin', params, function(data) {
      if (data.status == 'error') {
      	cb(data.msg);
        
        //$scope.friends = data.friendsList;
      } else {
      	cb(null, data);
      }
      
    });
  }

 });