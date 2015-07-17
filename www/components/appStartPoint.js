var isNowLoaded = true;
setTimeout("isNowLoaded = false", 1000);
var isFeedObseverStarted = false;

var application = angular.module('starter.controllers', []);
var applicationServices = angular.module('starter.services', []);


var userData = {};

/*
angular.element(document).ready(function() {
  //console.log(document);
  //document.getElementById("feed-element").innerHTML = 0;
});
*/

function lsSupports() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function isUndef(variable) {
  return typeof(variable) == "undefined";
}

var showAlert = function(title, text, $ionicPopup) {
  $ionicPopup.alert({
    title: title,
    template: text
  });
};

function isEmpty(obj) {
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}



function getFeed(http, state) {
  if (userData == null || isUndef(userData.id)) {
    return;
  }
  console.log('feed');
  execGetRequest(http, state, 'getfeedlength', '', function(data) {
    if (data.status == 'ok' && data.feedlength > 0) {
      document.getElementById("feed-element").innerHTML = data.feedlength;
    } else {
      document.getElementById("feed-element").innerHTML = 0;
    }
  });
}

function execUnAuthRequest(http, state, action, params, successCallback) {
/*  if (userData == null || isUndef(userData.id)) {
    state.go('app.signin');
    return;
  }*/
  http.get('http://localhost:3000/?act=' + action + params)
    .success(function(data) {
      successCallback(data);
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });
}

function execGetRequest(http, state, action, params, successCallback) {
  if (userData == null || isUndef(userData.id)) {
    state.go('app.signin');
    return;
  }
  http.get('http://localhost:3000/?act=' + action + params + '&userId=' + userData.id + '&token=' + userData.token)
    .success(function(data) {
      successCallback(data);
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });
}



function execPostRequest(http, state, action, postData, successCallback) {
  if (userData == null || isUndef(userData.id)) {
    state.go('app.signin');
    return;
  }

  var postArray = postData;
  postArray.ownerId = userData.id;

  http.post('http://localhost:3000/?act=' + action + '&token=' + userData.token, postArray, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .success(function(data) {
      successCallback(data);
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });
}



function normalizeDate(date) {
  var date = new Date(date);
  
  var day = addNull(date.getDate());
  var month = addNull(date.getMonth() + 1);
  var year = date.getFullYear();
  var hours = addNull(date.getHours());
  var minutes = addNull(date.getMinutes());

  function addNull(number) {
    var str = (number < 10) ? '0' + number : '' + number;
    return str;
  }          
  var dateString = day + '.' + month + '.' + year + ' at ' + hours + ':' + minutes;
  return dateString;
}