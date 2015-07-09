application.controller('EventEditCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, eventService, friendsService, $ionicHistory) {
  //$ionicHistory.clearHistory();
  var eventId = $stateParams.eventId;


  if (userData == null || isUndef(userData.id)) {
    //$location.path("/tab/signin");
    $state.go('app.signin');
    return;
  }
  var promiseObj = eventService.get(eventId);
    promiseObj.then(function(value) {

      $scope.event = value.event;
      $scope.eventData = value.eventData;
      $scope.isEventOwner = value.isEventOwner;
      if (value.isEventOwner) {
        //åñëè þçåð - âëàäåëåö ýâåíòà, òî òàê æå íàäîâûâåñòè âåñü åãî êîíòàêò ëèñò
        //äëÿ âîçìîæíîñòè äîáàâëåíèÿ íîâûõ ó÷àñòíèêîâ
        var friendsPromiseObj = friendsService.getMyFriends();
        friendsPromiseObj.then(function(friends){

          //console.log(friends);
          showFriendsList(value.eventMembers, friends.friends)
        });
      } else {
        $scope.eventMembers = value.eventMembers;
      }

      /*$scope.msg = value.msg;

      $scope.friends = value.friends;*/


    });
  function showFriendsList(eventMembers, myFriends) {
    var potentialMembers = []; //Ìàññèâ â êîòîðâûé âõîäÿò âñå âîçìîæíûå ó÷àñòíèêè, 100% èç êîíòàêò ëèñòà +
        //þçåðû, êîòîðûõ òàì íåò - âíåñåííûå êàê-òî èíà÷å èëè óäàëåííûå èç êîíòàêòîâ ïîñëå ñîçäàíèÿ åâåíòà
    if (eventMembers.length < 1 || myFriends.length < 1) {
      return;
    } else {
      //console.log(eventMembers);
      //console.log(myFriends);
      for (myFriend in myFriends) {
        var cMyFriend = myFriends[myFriend];
        var friendChecked = true;
        //èäåì ïî ìàññèâó êîíòàêòîâ
        //åñëè òåêóùèé êîíòàêò îòñóòñòâóåò â ñïèñêå ó÷àñòíèêîâ åâåíòà - ïîìå÷àåì ýòî
        if (isUndef(eventMembers[cMyFriend.id])) {
          friendChecked = false;
        } else {
          //åñëè ïðèñóòñòâóåò - ïîìå÷àåì êàê ÷åêåä è óáèðàåì èç ìàññèâà ó÷àñòíèêîâ
          delete(eventMembers[cMyFriend.id]);
        }
        potentialMembers.push({
          id: cMyFriend.id,
          name: cMyFriend.name,
          checked: friendChecked,
          notFriend: false
        });
      }
      //Íà äàííîì ýòàïå â ìàññèâå ó÷àñòíèêîâ îñòàëèñü òîëüêî òå, êòî ïî êàêîé-òî ïðè÷èíå
      //îòñóòñòâóåò â êîíòàêò ëèñòå, äîáàâëÿåì èõ â èñõîäÿùèé ìàññèâ(êàê ÷åêåä)
      for (anotherFriend in eventMembers) {
        var cAnotherFriend = eventMembers[anotherFriend];
        potentialMembers.push({
          id: cAnotherFriend.id,
          name: cAnotherFriend.name,
          checked: true,
          notFriend: true
        });

      }
      $scope.eventMembers = potentialMembers;
    }
  }

  $scope.editEvent = function(event, members) {

    //console.log(event);
    //console.log(members);


    if (isUndef(event) || isUndef(event.name) || isUndef(event.description)) {
      showAlert('error', 'All fields are required', $ionicPopup);
      return;
    }

    if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(event.name))) {
      showAlert('error', 'Event name should contain latin characters, letters, numbers? space or !?., symbols and length more 8 symbols', $ionicPopup);
      return;
    }

    if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(event.description))) {
      showAlert('error', 'Event description should contain latin characters, letters, numbers? space or !?., symbols and length more 8 symbols', $ionicPopup);
      return;
    }

    var selectedFriends = [];

    for (friend in members) {
      if (members[friend].checked) {
        selectedFriends.push(members[friend].id);
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
            updateEvent(event, selectedFriends);
          }
        }]
      });
    } else {
      updateEvent(event, selectedFriends);
    }
  }

  function updateEvent(event, selectedFriends) {

    var postArray = {
      eventData: event,
      ownerId: userData.id,
      friendsInEvent: selectedFriends
    };
    /*
    console.log(postArray);
    return;*/

    $http.post('http://localhost:3000/?act=editevent', postArray, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .success(function(data) {
        //$http.post('http://localhost:3000/?act=addevent&userId='+userData.id)

        if (data.status == 'Event update') {
          //showAlert('Confirm', 'Event create', $ionicPopup);
          $state.go('app.events');
          return;
        } else {
          showAlert('error', 'We got an error here, try later', $ionicPopup);
          return;
        }
      });

  }
});