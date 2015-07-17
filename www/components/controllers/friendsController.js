application.controller('FriendsCtrl', function($scope, friendsService, $ionicPopup, $state, $ionicActionSheet) {
  var contactList = {};
  if (userData == null || isUndef(userData.id)) {
    //$location.path("/tab/signin");
    $state.go('app.signin');
    return;
  }

  $scope.show = function(friendId) {
    var selectedFriendId = friendId;
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      /* buttons: [
        { text: '<b>Share</b> This' },
        { text: 'Move' }
       ],*/
      destructiveText: 'Delete from friends list ',
      titleText: '',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //console.log(arguments);
        return true;
      },
      destructiveButtonClicked: function() {
        console.log(selectedFriendId);
        $ionicPopup.show({
          template: 'Remove from friends list?',
          title: 'Confirm',
          scope: $scope,
          buttons: [{
            text: 'No'
          }, {
            text: '<b>Yes</b>',
            type: 'button-positive',
            onTap: function() {
              friendsService.remove(friendId, function(err, res) {
                if (err) {
                  showAlert('error', err, $ionicPopup);
                } else {
                  getFriendsList();
                }
              });
              //console.log(selectedFriendId);
              
            }
          }]
        });
        return true;
      }
    });
  };


  $scope.addFriend = function(friendLogin) {
    friendsService.add({name : friendLogin}, function(err, res) {
      if (err) {
        showAlert('error', err, $ionicPopup);
      } else {
        for (friend in contactList) {
          if (contactList[friend].id == res.friendId) {
            showAlert('Bad Idea', contactList[friend].name + ' is already in friend list!', $ionicPopup);
            return;
          }
        }
        if (res.status == 'error') {
          showAlert('error', data.msg, $ionicPopup);
        } else {
          $ionicPopup.show({
            template: 'Add to friends list?',
            title: 'User found',
            scope: $scope,
            buttons: [{
              text: 'No'
            }, {
              text: '<b>Yes</b>',
              type: 'button-positive',
              onTap: function() {

                friendsService.add({id : res.friendId}, function(err, res) {
                  if (err) {
                    showAlert('error', err, $ionicPopup);
                  } else {
                    console.log('added');
                    getFriendsList();
                  }
                });
              }
            }]
          });
        }
      }
    });
/*
    $http.get('http://localhost:3000/?act=addfriend&userId=' + userData.id + '&friendlogin=' + friendLogin+'&token=' + userData.token)
      .success(function(data, status, headers, config) {
        

      })
      .error(function(data, status, headers, config) {

        // console.log(data);
      });*/
  };

  function getFriendsList() {
    /*
    $http.get('http://localhost:3000/?act=getmyfriends&userId=' + userData.id+'&token=' + userData.token)
      .success(function(data, status, headers, config) {
        console.log(data.friendsList);
        if (isEmpty(data.friendsList)) {
          console.log('friends list empty');
          $scope.msg = 'Contact list is empty';
        } else {
          contactList = data.friendsList;
          $scope.friends = data.friendsList;
        }

      })
      .error(function(data, status, headers, config) {
        console.log(data);
      });*/
    var friendsPromiseObj = friendsService.getMyFriends();
    friendsPromiseObj.then(function(friends){

      console.log('newfriends');
      $scope.friends = friends.friends;
    });
  }

  getFriendsList();


});