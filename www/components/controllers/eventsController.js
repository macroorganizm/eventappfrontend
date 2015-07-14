application.controller('EventsCtrl', function($scope, $http, $state, $stateParams, $ionicPopup, $ionicActionSheet, eventService, friendsService) {
  $scope.eventsList = {};
  $scope.friends = [];
  if (userData == null || isUndef(userData.id)) {
    $state.go('app.signin');
    return;
  }

  $scope.showArchivedEvents = function() {
    $state.go('app.events', {
      archived: true
    });
  }

  $scope.showOptionsList = function(eventId, isEventOwner) {

    var detailsCaption = (isEventOwner == 1) ? 'Edit event' : 'Show details';

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: '<b>' + detailsCaption + '</b>'
      }, {
        text: '<b>Show balance</b>'
      }, {
        text: '<b>Show expenses</b>'
      }],
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        switch (index) {
          case 0:
            $state.go('app.editevent', {
              eventId: eventId
            });
            break;
          case 1:
            $state.go('app.eventbalance', {
              eventId: eventId
            });
            break;
          case 2:
            $state.go('app.expenses', {
              eventId: eventId
            });
            break;
        }
        return true;
      }
    });
  }

  if ($state.is('app.events')) {
    var isArchived = ($stateParams && $stateParams.archived) ? true : false;

    var promiseObj = eventService.all(isArchived);
    promiseObj.then(function(value) {

      //console.log(value);

      $scope.msg = value.msg;

      $scope.eventsList = value.events;


    });
  } else {
    var promiseObj = friendsService.getMyFriends();
    promiseObj.then(function(value) {

      //console.log(value);

      $scope.msg = value.msg;

      $scope.friends = value.friends;


    });
  }

  $scope.addEvent = function(eventData, friendsInEvent) {
    //console.log(eventData);
    //console.log(friendsInEvent.length);
    if (isUndef(eventData) || isUndef(eventData.name) || isUndef(eventData.description)) {
      showAlert('error', 'All fields are required', $ionicPopup);
      return;
    }

    if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(eventData.name))) {
      showAlert('error', 'Event name should contain latin characters, letters, numbers? space or !?., symbols and length more 8 symbols', $ionicPopup);
      return;
    }

    if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(eventData.description))) {
      showAlert('error', 'Event description should contain latin characters, letters, numbers? space or !?., symbols and length more 8 symbols', $ionicPopup);
      return;
    }

    var selectedFriends = [];

    for (friend in friendsInEvent) {
      if (friendsInEvent[friend].checked) {
        selectedFriends.push(friendsInEvent[friend].id);
      }
    }

    if (selectedFriends.length == 0) {
      $ionicPopup.show({
        template: 'Really create event from yourself?',
        title: 'Confirm',
        scope: $scope,
        buttons: [{
          text: 'No'
        }, {
          text: '<b>Yes</b>',
          type: 'button-positive',
          onTap: function() {
            createEvent(eventData, selectedFriends);
          }
        }]
      });
    } else {
      createEvent(eventData, selectedFriends);
    }
  }

  $scope.editEvent = function(eventId) {
    //console.log(eventId);
    //console.log($scope.eventsList);
    $state.go('app.editevent', {
      eventId: eventId
    });
  }

  $scope.showEventExpences = function(eventId) {
      $state.go('app.expenses', {
        eventId: eventId
      });
    }
    /*
    http://localhost:8100/#/tab/signin

    */
  function createEvent(eventData, friendsInEvent) {
    
    eventService.add(eventData, friendsInEvent, function(err, res) {
      if (err) {
        showAlert('error', err, $ionicPopup);      
      } else {
        $state.go('app.events');
        return;
      }
    })
/*
    var postArray = {
      eventData: eventData,
      ownerId: userData.id,
      friendsInEvent: friendsInEvent
    };



    $http.post('http://localhost:3000/?act=addevent', postArray, {
        headers: {

          'Content-Type': 'application/json'
        }
      })
      .success(function(data) {
        //$http.post('http://localhost:3000/?act=addevent&userId='+userData.id)

        if (data.status == 'Event create') {
          //showAlert('Confirm', 'Event create', $ionicPopup);
          $state.go('app.events');
          return;
        } else {
          showAlert('error', 'We got an error here, try later', $ionicPopup);
          return;
        }
      });*/
  }
});