applicationServices.factory('friendsService', function($http, $state, $q) {
  return {
    getMyFriends: function() {
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
  };
});