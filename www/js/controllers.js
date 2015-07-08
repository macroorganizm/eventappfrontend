var isNowLoaded = true;
setTimeout("isNowLoaded = false", 1000);
var isFeedObseverStarted = false;

angular.module('starter.controllers', [])
.controller('SignInCtrl', function($scope, $http, $ionicPopup, $state, $interval, $ionicHistory) {
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
      //$scope.logined = true;
      userData = {
        id: userId
      };
      console.log('feed one Time without login');
      getFeed($http, $state);

      //$ionicTabsDelegate.$getByHandle('myTabs')._instances[0].tabs[0].title = 'Settings';
      //$ionicTabsDelegate._instances[0].tabs[0].title = 'Settings';
      //$ionicTabsDelegate.$getByHandle('signin')._instances[0].remove()
      //$state.go('app.mainpage');
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
              username: login
            };

            localStorage.setItem("userId", data.uId);
            console.log('feed one Time on login');
            getFeed($http, $state);
            
            $state.go('app.events');
            //$location.path("/tab/trips");
          }

        })
        .error(function(data, status, headers, config) {
          //$scope.showAlert(status, data);
          console.log(data);
        });
    };

  })
 /* .controller('MainPageCtrl', function($scope, $http, $state, $ionicHistory) {
    //$ionicHistory.clearHistory();
    if (isNowLoaded) {
      $state.go('app.events');
      return;
    }

    $scope.logout = function() {
      execGetRequest($http, $state, 'logout', '', function(data) {
        if (data.status == 'ok') {
          localStorage.removeItem('userId');
          userData = {};
          $state.go('app.signin');
        }
      });

    };
  })*/
  .controller('FeedCtrl', function($scope, $http, $state, feedsService) {
    //$ionicHistory.clearHistory();
    $scope.msg = '';
    $scope.feedsList = [];

    
    $scope.listCanSwipe = true; //else swipe_to_delete button breaks

    var feedsList = [];

    var promiseObj = feedsService.all();
    promiseObj.then(function(value) {
      if (value.length === 0) {
        $scope.msg = 'Feed list is empty';
      } else {
        console.log(value);
        $scope.feedsList = value;
      }

    });

    $scope.clearFeedBy = function(type, id) {
      //console.log($scope.feedsList);
      delete($scope.feedsList[type + '_' + id]);
      //console.log($scope.feedsList);
      feedsService.clearBy(type, id);
    }
    //$scope.feedsList = feeds.all();
    /*
    execGetRequest($http, $state, 'getfeed', '', function (data) {
      if(data.status == 'ok') {
        data.feed.forEach(function (feedItem) {
        var date = new Date(feedItem.date);
        var dateString = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
        dateString += ' at ' + date.getHours() + ':' + date.getMinutes();
        var link = {entity : feedItem.entity, entityId : feedItem.entityId};
        feedsList.push({date : dateString, text : feedItem.text, link : link, isLinked : feedItem.isLinked});
        //console.log(feedItem);
      });
      if (data.feed.length == 0) {
        $scope.msg = 'Feed list is empty';
      } 
      //console.log(feedsList);
      $scope.feedsList = feedsList;
      }
    });*/

    $scope.linkTo = function(entity, entityId) {
      //console.log(entity);
      //console.log(entityId);
      switch (entity) {
        case 'event':
          $state.go('app.editevent', {
            eventId: entityId
          });
          break;
        case 'expense':
          $state.go('app.showexpense', {
            expenseId: entityId
          });
          break;
          /*case 2 :
          $state.go('app.expenses', {eventId : eventId});
          break;*/
      }
    };


  })
  .controller('RegCtrl', function($scope, $http, $ionicPopup) {
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
  })
  .controller('EventBalanceCtrl', function($scope, $http, $state, $stateParams, $ionicPopup) {

    if (userData == null || isUndef(userData.id)) {
      //$location.path("/tab/signin");
      $state.go('app.signin');
      return;
    }
    var params = '&eventId=' + $stateParams.eventId;

    execGetRequest($http, $state, 'getexpensesforbalanse', params, function(data) {
      if (data.status == 'ok') {
        var expensesOwner = []; //Ìàññèâ ãäå äîëæíû ÞÇÅÐÓ
        var totalOwn = {
          expenseName: 'Total',
          expenseOwner: 0,
          approved: 0,
          unapproved: 0
        };
        var totalPaid = {
          expenseName: 'Total',
          expenseOwner: 0,
          approved: 0,
          unapproved: 0
        };
        var expensesSubject = []; //Ìàññèâ, ãäå þçåð ÿâëÿåòñÿ äîëæíèêîì
        data.expenses.forEach(function(expense) {
          var expenseString = ''
          if (expense.ownerId._id != userData.id) {
            // you owe
            var approved = unapproved = 0;

            expense.details.forEach(function(subject) {
              if (subject.memberId._id == userData.id) {
                if (subject.isApproved) {
                  approved += subject.amount;
                } else {
                  unapproved += subject.amount;
                }
              }
            });
            expensesSubject.push({
              expenseName: expense.name,
              expenseOwner: expense.ownerId.name,
              approved: approved,
              unapproved: unapproved
            });
            totalOwn.expenseOwner += approved + unapproved,
              totalOwn.approved += approved,
              totalOwn.unapproved += unapproved
          } else {
            // 'You paid';
            var approved = unapproved = 0;

            expense.details.forEach(function(subject) {

              if (subject.isApproved) {
                approved += subject.amount;
              } else {
                unapproved += subject.amount;
              }

            });
            expensesOwner.push({
              expenseName: expense.name,
              expenseOwner: 'YOU',
              approved: approved,
              unapproved: unapproved
            });
            totalPaid.expenseOwner += approved + unapproved,
              totalPaid.approved += approved,
              totalPaid.unapproved += unapproved

          }

        });
        expensesSubject.push(totalOwn);
        $scope.expensesSubject = expensesSubject;
        expensesOwner.push(totalPaid);
        $scope.expensesOwner = expensesOwner;
      }
      console.log(data);
    });
  })
  .controller('EventsCtrl', function($scope, $http, $state, $stateParams, $ionicPopup, $ionicActionSheet, eventService, friendsService) {
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
      /*
      var params = '&active=true';
      if ($stateParams && $stateParams.archived) {
        params = '&active=false';
      $scope.msg = 'Archived Events';
      }
      execGetRequest($http, $state, 'getevents', params, function (data) {
          if(data.status == 'ok') {
          for(item in data.events) {
          var cEvent = (data.events[item]);
          var isOwner = (cEvent.ownerId == userData.id) ? 1 : 0;
          $scope.eventsList[cEvent._id] = {id : cEvent._id, name : cEvent.name,
              desc : cEvent.description, friendsCount : cEvent.friendsIds.length, isOwner : isOwner};
        }
        }
        console.log($scope.eventsList);
      });*/
    } else {
      var promiseObj = friendsService.getMyFriends();
      promiseObj.then(function(value) {

        //console.log(value);

        $scope.msg = value.msg;

        $scope.friends = value.friends;


      });
      /*execGetRequest($http, $state, 'getmyfriends', '', function(data) {
        //console.log(data);
        if (isEmpty(data.friendsList)) {
          console.log('friends list empty');
          $scope.msg = ' Contact list is empty';
        } else {
          for (friend in data.friendsList) {
            var currentFriend = data.friendsList[friend];
            $scope.friends.push({
              id: currentFriend.id,
              name: currentFriend.name,
              checked: false
            });
          }
          //$scope.friends = data.friendsList;
        }
      });*/
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
      console.log(eventData);
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
        });
    }
  })
  .controller('EventEditCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, eventService, friendsService, $ionicHistory) {
    //$ionicHistory.clearHistory();
    var eventId = $stateParams.eventId;
   // var eventMembers = [];
  //  var myFriends = [];
    

    if (userData == null || isUndef(userData.id)) {
      //$location.path("/tab/signin");
      $state.go('app.signin');
      return;
    }

/*
    execGetRequest($http, $state, 'getevent', '&eventId=' + eventId, function(data) {
      if (data.status == 'ok') {
        $scope.event = data.event.event;
        $scope.eventData = data.event.event;
        var isEventOwner = (data.event.event.ownerId == userData.id);
        $scope.isEventOwner = isEventOwner;
        if (!isEventOwner) {
          $scope.eventMembers = data.event.friends;
          return;
        }
        //$scope.eventMembers = data.event.friends;
        eventMembers = data.event.friends;
        //console.log(data.event.friends);
        showFriendsList();
      }
      //console.log(data);
    });*/
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
/*
    execGetRequest($http, $state, 'getmyfriends', '', function(data) {
      //console.log(data);
      if (isEmpty(data.friendsList)) {
        console.log('friends list empty');
        $scope.msg = ' Contact list is empty';
      } else {
        for (friend in data.friendsList) {
          var currentFriend = data.friendsList[friend];
          myFriends.push({
            id: currentFriend.id,
            name: currentFriend.name
          });

        }
        console.log(myFriends);
        //showFriendsList();
        //$scope.friends = data.friendsList;
      }
    });*/
/*
*eventMembers - óæå èìåþùèåñÿ ó÷àñòíèêà åâåíòà
 myFriends - þçåðû, âõîäÿùèå â ìîé êîíòàêò-ëèñò, êîòîðûõ ìîæíî äîáàâèòü â åâåíò
*/
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
  })
  .controller('ExpensesCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, expensesService, feedsService, $ionicHistory) {
    //$ionicHistory.clearHistory();
    $scope.currentEventId = $stateParams.eventId;
    $scope.expensesList = [];
    

    if ($state.is('app.expenses')) {
      var expensesPromiseObj = expensesService.getExpensesList($stateParams.eventId);
      expensesPromiseObj.then(function(expensesList){

        $scope.expensesList = expensesList;
      });
      /*execGetRequest($http, $state, 'getexpenses', params, function(data) {
        if (data.status == 'ok') {
          for (expense in data.expenses) {
            var currentExpense = data.expenses[expense];
            var details = '';
            var isExpenseOwner = (currentExpense.ownerId == userData.id);
            if (isExpenseOwner) {
              details += 'Âàì äîëæíû : ';
              var approved = 0;
              unaproved = 0;
              currentExpense.details.forEach(function(item) {
                //console.log(item.amount, item.isApproved);
                if (item.isApproved) {
                  approved += parseFloat(item.amount);
                } else {
                  unaproved += parseFloat(item.amount);
                }
              });
              details += 'approved : ' + approved + ', unapproved : ' + unaproved;
            } else {
              details += 'Âû äîëæíû : ';
              currentExpense.details.forEach(function(item) {
                if (item.memberId == userData.id) {
                  details += parseFloat(item.amount);
                  details += (item.isApproved) ? ' (approved)' : ' (unapproved)'
                }
              });
            }


            $scope.expensesList.push({
              id: currentExpense._id,
              isOwner: isExpenseOwner,
              name: currentExpense.name,
              details: details,
              comments: currentExpense.comments.length
            });
          }

        }
        //console.log(data);

      });*/
    } else if ($state.is('app.showexpense')) {
      /* var eventId = $stateParams.eventId;*/
      var expenseId = $stateParams.expenseId;
      
      $scope.expenseId = expenseId;

      $scope.feedInfo = false;

      $scope.toggleFeedInfo = function() {
        $scope.feedInfo = !$scope.feedInfo;
      }

      var expensePromiseObj = expensesService.getExpenseData(expenseId);
      expensePromiseObj.then(function(expense){
      //  console.log(expense);
        $scope.expenseName = expense.expenseName;
        $scope.expenseOwner = expense.expenseOwner;

        $scope.details = expense.details;
        $scope.approvedAmount = expense.approvedAmount;
        $scope.unapprovedAmount = expense.unapprovedAmount;
        if (expense.msg) {
          $scope.mas = expense.msg;
        }
        $scope.comments = expense.comments;
      });

      var feedPromiseObj = feedsService.getFeedBy('expense', expenseId);
      feedPromiseObj.then(function(feed){
        $scope.feed = feed;
        
      });

      $scope.clearFeedBy = function(type, id) {
      //console.log($scope.feedsList);
        $scope.feed = {
          adding : [],
          editing : [],
          approving : [],
          commenting : [],
          all : []
        };
        //console.log(arguments);
        //delete($scope.feedsList[type + '_' + id]);
        //console.log($scope.feedsList);
        feedsService.clearBy(type, id);
      }
/*
      
      getExpenseData(expenseId, $http, $state, function(data) {
        var members = {};
        var expenseData = data.expense;
        $scope.expenseName = expenseData.name;
        $scope.expenseOwner = (expenseData.ownerId._id == userData.id) ? 'You' : expenseData.ownerId.name;

        $scope.details = [];
        var approvedAmount = 0; var unapprovedAmount = 0;
        expenseData.details.forEach(function(expenseSubject) {
          members[expenseSubject.memberId._id] = expenseSubject.memberId.name;
          if (expenseSubject.isApproved) {
            approvedAmount += parseFloat(expenseSubject.amount);
          } else {
            unapprovedAmount += parseFloat(expenseSubject.amount);
          }
          $scope.details.push({
            detailId: expenseSubject._id, //id äåòàëè
            amount: expenseSubject.amount,
            subjectName: expenseSubject.memberId.name,
            ownSubject: (expenseSubject.memberId._id == userData.id), //åñëè ÞÇÅÐ è åñòü
            //ñóáúåêò, ò.å. êòî äîëæåí äåíåã ñîçäàòåëþ åêñïåíñà      
            isApproved: expenseSubject.isApproved
          });
        });
        $scope.approvedAmount = approvedAmount;
        $scope.unapprovedAmount = unapprovedAmount;

        var comments = [];
        if (expenseData.comments.length === 0) {
          $scope.msg = 'No comments yet';
         // console.log(members);
        } else {
          expenseData.comments.forEach(function(commentItem) {

           
            comments.push({
              commentator: members[commentItem.memberId],
              text: commentItem.text,
              isImportant: commentItem.isImportant,
              date: normalizeDate(commentItem.date)
            });
          });
          $scope.comments = comments;
        }
      });*/
    }
/*
    function getExpenseData(expenseId, http, state, callbackFunction) {

      var params = '&expenseId=' + expenseId;

      execGetRequest(http, state, 'getexpense', params, function(data) {
        //console.log(data);
        if (data.status == 'ok') {
          callbackFunction(data);
        } else {
          console.log(data);
        }
        //console.log(data);

      });
    }*/

    $scope.toggleApprove = function(detailId, expenseId) {
      var postArray = {
        detailId: detailId, //id êîíêðåòíîãî ñóáúåêòà, ÊÒÎ äîëæåí äåíåã
        expenseId: expenseId
      };

      execPostRequest($http, $state, 'approve', postArray, function(data) {
        if (data.status == 'approved') {
          $state.go($state.current, {}, {
            reload: true
          });
          return;
        } else {
          showAlert('error', 'We got an error here, try later', $ionicPopup);
          return;
        }
      });
    }

    $scope.showExpense = function(expenseId, eventId) {
      $state.go('app.showexpense', { /*eventId : eventId,*/
        expenseId: expenseId
      });
    }


    $scope.editExpense = function(expenseId, eventId) {
      $state.go('app.addexpense', {
        eventId: eventId,
        expenseId: expenseId
      });

    }
  })
  .controller('AddExpenseCtrl', function($scope, $state, $http, $stateParams, $ionicPopup) {
    var currentEventId = $stateParams.eventId;
    //console.log($stateParams);
    $scope.eventMembers = [];
    $scope.expense = {
      action: 'create'
    };
    execGetRequest($http, $state, 'geteventmembers', '&eventId=' + currentEventId, function(data) {
      if (data.status == 'ok') {

        for (friend in data.eventMembers) {
          var currentMember = data.eventMembers[friend];
          $scope.eventMembers.push({
            id: currentMember.id,
            name: currentMember.name
          });
        }

        //$scope.eventMembers = data.eventMembers;
      }
      //console.log($scope.eventMembers);
    });

    if (!$stateParams.expenseId) {
      //adding

    } else {
      var params = '&expenseId=' + $stateParams.expenseId + '&eventId=' + currentEventId;

      execGetRequest($http, $state, 'getexpense', params, function(data) {
        //console.log(userData.id);
        if (data.status == 'ok') {
          $scope.expense.name = data.expense.name;
          $scope.expense.id = data.expense._id;
          var subjects = {};
          data.expense.details.forEach(function(subject) {
            //ôîðìèðóåòñÿ ìàññèâ óæå èìåþùèõñÿ ñóáúåêòîâ, äëÿ äàëüíåéøåé ïðîâåðêè ñðåäè
            //âñåõ ïîòåíöèàëüíûõ ñóáúåêòîâ äîëãà 
            subjects[subject.memberId._id] = {
              amount: subject.amount,
              isApproved: subject.isApproved
            };
          });
          console.log(subjects);
          $scope.eventMembers.forEach(function(potentialMember) {
            if (isUndef(subjects[potentialMember.id])) {

            } else {
              potentialMember.amount = subjects[potentialMember.id].amount;
              potentialMember.isApproved = subjects[potentialMember.id].isApproved;
            }
          });

        } else {
          console.log(data);
        }
      });

    }

    $scope.addExpense = function(expenseData, expenseMembers) {
      if (isUndef(expenseData) || isUndef(expenseData.name)) {
        showAlert('error', 'All fields are required', $ionicPopup);
        return;
      }

      if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(expenseData.name))) {
        showAlert('error', 'Event name should contain latin characters, letters, numbers? space or !?., symbols and length more 8 symbols', $ionicPopup);
        return;
      }

      var checkedMembers = [];

      for (member in expenseMembers) {
        var currentMember = expenseMembers[member];

        if (isUndef(currentMember.amount) || currentMember.amount <= 0) {
          continue;
        }
        if (isNaN(currentMember.amount)) {
          showAlert('error', 'Amount field should be a numeric', $ionicPopup);
          return;
        }
        checkedMembers.push({
          memberId: currentMember.id,
          amount: currentMember.amount
        });
      }
      var totalAmount = checkedMembers.reduce(function(sum, current) {
        return sum + parseFloat(current.amount);
      }, 0);

      $ionicPopup.show({
        template: 'Create new expense for ' + checkedMembers.length + ' members, total amount : ' + totalAmount + '?',
        title: 'Confirm',
        scope: $scope,
        buttons: [{
          text: 'No'
        }, {
          text: '<b>Yes</b>',
          type: 'button-positive',
          onTap: function() {
            var postArray = {
              expenseData: expenseData,
              eventId: currentEventId,
              checkedMembers: checkedMembers
            };
            execPostRequest($http, $state, 'addexpense', postArray, function(data) {
              if (data.status == 'Expense create') {

                $state.go('app.showexpense', {
                  eventId: currentEventId,
                  expenseId: data.newExpId
                });
              } else {
                showAlert('error', 'We got an error here, try later', $ionicPopup);
              }
            });
          }
        }]
      });


    };

    $scope.editExpense = function(expenseData, expenseMembers) {
      if (isUndef(expenseData) || isUndef(expenseData.name) || isUndef(expenseData.id)) {
        showAlert('error', 'All fields are required', $ionicPopup);
        return;
      }

      if (!(/^[a-zA-Z0-9 ,.!?]{8,}$/.test(expenseData.name))) {
        showAlert('error', 'Event name should contain latin characters, letters, numbers? space or !?., symbols and length more 8 symbols', $ionicPopup);
        return;
      }

      var checkedMembers = [];

      for (member in expenseMembers) {
        var currentMember = expenseMembers[member];

        if (isUndef(currentMember.amount) || currentMember.amount <= 0) {
          continue;
        }
        if (isNaN(currentMember.amount)) {
          showAlert('error', 'Amount field should be a numeric', $ionicPopup);
          return;
        }
        checkedMembers.push({
          memberId: currentMember.id,
          amount: currentMember.amount
        });
      }
      var totalAmount = checkedMembers.reduce(function(sum, current) {
        return sum + parseFloat(current.amount);
      }, 0);

      $ionicPopup.show({
        template: 'Update new expense for ' + checkedMembers.length + ' members, total amount : ' + totalAmount + '? All approved subjects will be reseted.',
        title: 'Confirm',
        scope: $scope,
        buttons: [{
          text: 'No'
        }, {
          text: '<b>Yes</b>',
          type: 'button-positive',
          onTap: function() {
            var postArray = {
              expenseData: expenseData,
              eventId: currentEventId,
              checkedMembers: checkedMembers
            };
            //console.log(postArray);

            execPostRequest($http, $state, 'editexpense', postArray, function(data) {
              if (data.status == 'saved') {
                $state.go('app.showexpense', {
                  eventId: currentEventId,
                  expenseId: expenseData.id
                });
              } else {
                showAlert('error', 'We got an error here, try later', $ionicPopup);
              }
            });
          }
        }]
      });


    };
  })

.controller('AddCommentCtrl', function($scope, $state, $http, $stateParams, $ionicPopup) {
    $scope.currentExpenseId = $stateParams.expenseId;
    //console.log(currentExpenseId);

    $scope.addComment = function(comment, expenseId) {
      //console.log(comment);
      //console.log(expenseId);
      if (isUndef(comment) || isUndef(comment.text)) {
        showAlert('error', 'You want to send a nothing? Realy?', $ionicPopup);
        return;
      }
      var isImportant = (isUndef(comment.isImportant)) ? false : comment.isImportant;
      //console.log(comment.text, isImportant);
      var postArray = {
        commentText: comment.text,
        expenseId: expenseId,
        isImportant: isImportant
      };

      execPostRequest($http, $state, 'addexpensecomment', postArray, function(data) {
        if (data.status == 'saved') {
          $state.go('app.showexpense', {
            expenseId: expenseId
          });
        } else {
          showAlert('error', 'We got an error here, try later', $ionicPopup);
        }
      });
    };
  })
  .controller('FriendsCtrl', function($scope, $http, $ionicPopup, $state, $ionicActionSheet) {
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
                //console.log(selectedFriendId);
                $http.get('http://localhost:3000/?act=delfriend&userId=' + userData.id + '&friendId=' + selectedFriendId)
                  .success(function(data, status, headers, config) {
                    //console.log(data);
                    getFriendsList();
                  })
                  .error(function(data, status, headers, config) {
                    console.log(data);
                  });
              }
            }]
          });
          return true;
        }
      });
    };


    $scope.addFriend = function(friendLogin) {

      $http.get('http://localhost:3000/?act=addfriend&userId=' + userData.id + '&friendlogin=' + friendLogin)
        .success(function(data, status, headers, config) {
          for (friend in contactList) {
            if (contactList[friend].id == data.friendId) {
              showAlert('Bad Idea', contactList[friend].name + ' is already in friend list!', $ionicPopup);
              return;
            }
          }
          if (data.status == 'error') {
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
                  $http.get('http://localhost:3000/?act=addfriend&userId=' + userData.id + '&friendId=' + data.friendId)
                    .success(function(data, status, headers, config) {
                      console.log(data);
                      getFriendsList();
                    })
                    .error(function(data, status, headers, config) {
                      console.log(data);
                    });
                }
              }]
            });
          }

        })
        .error(function(data, status, headers, config) {

          // console.log(data);
        });
    };

    function getFriendsList() {
      $http.get('http://localhost:3000/?act=getmyfriends&userId=' + userData.id)
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
        });
    }

    getFriendsList();


  })
.controller('AppCtrl', function($scope, $http, $state) {
  
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

var userData = {};

// App init
angular.element(document).ready(function() {
  //console.log(document);
  //document.getElementById("feed-element").innerHTML = 0;
});

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

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
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

function execGetRequest(http, state, action, params, successCallback) {
  if (userData == null || isUndef(userData.id)) {
    state.go('app.signin');
    return;
  }



  http.get('http://localhost:3000/?act=' + action + params + '&userId=' + userData.id)
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

  http.post('http://localhost:3000/?act=' + action, postArray, {
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
