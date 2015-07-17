applicationServices.factory('friendsService', function($http, $state, $q) {

  var factory = {
    getMyFriends : getMyFriends,
    add : add,
    remove : remove 
  };

  return factory;

  function getMyFriends() {
      //console.log(1122);
    var friendsList = [];
    var deferred = $q.defer();
    var msg = '';
    execGetRequest($http, $state, 'getmyfriends', '', function(data) {
      if (isEmpty(data.friendsList)) {
        //console.log('friends list empty');
        msg = ' Contact list is empty';
      } else {
        for (friend in data.friendsList) {
          var currentFriend = data.friendsList[friend];
          friendsList.push({
            id: currentFriend.id,
            name: currentFriend.name,
            checked: false
          });
        }
        
        //$scope.friends = data.friendsList;
      }
      deferred.resolve({
        msg: msg,
        friends: friendsList
      });
    });
    
    return deferred.promise;
  }

  function add(cotnact, cb) {
    if (isUndef(cotnact.id)) {
      var params = '&friendlogin=' + cotnact.name;
    } else {
      var params = '&friendId=' + cotnact.id;
    }
    
               
      execGetRequest($http, $state, 'addfriend', params, function(data) {
        //console.log(data);
        if (data.status == 'ok') {
          cb(null, data);
        } else {
          cb('Recieving Expense data error');
        }
      });
  

  }

  function remove(contactName, cb) {
    var params = '&friendId=' + contactName;
                
                  //console.log(data);
                  //getFriendsList();
               
      execGetRequest($http, $state, 'delfriend', params, function(data) {
        //console.log(data);
        if (data.status == 'ok') {
          cb(null, data);
        } else {
          cb('Recieving Expense data error');
        }
      });
  }
});