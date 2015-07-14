application.controller('ManageExpenseController', function($scope, $state, $http, $stateParams, $ionicPopup, eventService, expensesService) {
  var currentEventId = $stateParams.eventId;
  //console.log($stateParams);
  $scope.eventMembers = [];
  $scope.expense = {
    action: 'create'
  };
  //console.log("Manage");

  eventService.getEventMembers(currentEventId, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      //console.log('WE GOT ALL');
      $scope.eventMembers = res;
    }
    
  });

  

  if (!$stateParams.expenseId) {
    //adding

  } else {
    /*var params = '&expenseId=' + $stateParams.expenseId + '&eventId=' + currentEventId;

    execGetRequest($http, $state, 'getexpense', params, function(data) {
      //console.log('native getting');
      //console.log(data);


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
        //console.log(subjects);
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
*/

/**
* receiving data of one expense for filing editing form
*
* @param : <ObjectID>expenseId, <Function> callback
* 
*/
    expensesService.getExpense($stateParams.expenseId, function (err, res) {
      //console.log('WE IN METHOD');
      if (err) {
        return console.log(err);
      }
      $scope.expense.name = res.expense.name;
      $scope.expense.id = res.expense._id;
      var subjects = {};
      res.expense.details.forEach(function(subject) {

        //формируется массив уже имеющихся субъектов, для дальнейшей проверки среди
        //всех потенциальных субъектов долга
        subjects[subject.memberId._id] = {
          amount: subject.amount,
          isApproved: subject.isApproved
        };
      });
      $scope.eventMembers.forEach(function(potentialMember) {
        if (isUndef(subjects[potentialMember.id])) {

        } else {
          potentialMember.amount = subjects[potentialMember.id].amount;
          potentialMember.isApproved = subjects[potentialMember.id].isApproved;
        }
      });
    });

  }

  /**
  * Adding new expense
  *
  * @param {object} expenseData
  * @param {string} expenseData.name
  * @param {array} expenseMembers {amount : float, id : ObjectID, name : string}
  */

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
          ///

          expensesService.add(
            {
              expenseData: expenseData,
              eventId: currentEventId,
              checkedMembers: checkedMembers
            }, 
            function (err, res) {
              if (err) {
                showAlert('error', err, $ionicPopup);
              } else {
                //console.log('in new method');
                $state.go('app.showexpense', {
                  eventId: currentEventId,

                  //res - id of new Expense, was returned from server
                  expenseId: res
                });
              }
            }
          );
          /*
          execPostRequest($http, $state, 'addexpense', postArray, function(data) {
            if (data.status == 'Expense create') {

              $state.go('app.showexpense', {
                eventId: currentEventId,
                expenseId: data.newExpId
              });
            } else {
              showAlert('error', 'We got an error here, try later', $ionicPopup);
            }
          });*/
          ///
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
         /*var postArray = {
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
          });*/

          expensesService.edit(
            {
              expenseData: expenseData,
              eventId: currentEventId,
              checkedMembers: checkedMembers
            }, 
            function (err, res) {
              if (err) {
                showAlert('error', err, $ionicPopup);
              } else {
               // console.log('in new method EDIRTND');
                $state.go('app.showexpense', {
                  eventId: currentEventId,
                  expenseId: expenseData.id
                });
              }
            }
          );


        }
      }]
    });


  };
});