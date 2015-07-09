application.controller('AddExpenseCtrl', function($scope, $state, $http, $stateParams, $ionicPopup) {
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
});