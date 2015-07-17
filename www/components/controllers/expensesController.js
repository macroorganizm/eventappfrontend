application.controller('ExpensesCtrl', function($scope, $state, $stateParams, $ionicPopup, expensesService, feedsService, $ionicHistory) {
  //$ionicHistory.clearHistory();
  $scope.currentEventId = $stateParams.eventId;
  $scope.expensesList = [];
  

  if ($state.is('app.expenses')) {
    console.log('exp new');
    //var expensesPromiseObj = expensesService.getExpensesList($stateParams.eventId);
   // expensesPromiseObj.then(function(expensesList){

      //$scope.expensesList = expensesList;`
     expensesService.getExpensesList($stateParams.eventId, null, function(err, res){
      if (err) {
        showAlert('error', err, $ionicPopup);
        return;
      }
      for (expense in res.expenses) {
        var currentExpense = res.expenses[expense];
        var details = '';
        var isExpenseOwner = (currentExpense.ownerId == userData.id);
        if (isExpenseOwner) {
          details += 'Вам должны : ';
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
          details += 'Вы должны : ';
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
     }); 
  } else if ($state.is('app.showexpense')) {
    /* var eventId = $stateParams.eventId;*/
    var expenseId = $stateParams.expenseId;
    
    $scope.expenseId = expenseId;

    $scope.feedInfo = false;

    $scope.toggleFeedInfo = function() {
      $scope.feedInfo = !$scope.feedInfo;
    }


    // TODO : new interface in Service. Migrate
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
      feedsService.clearBy(type, id);
    }
  }
  $scope.toggleApprove = function(detailId, expenseId) {

    expensesService.approve(detailId, expenseId, function(err, res) {
      if (err) {
        showAlert('error', 'We got an error here, try later', $ionicPopup);
      } else {
        $state.go($state.current, {}, {
          reload: true
        });
      }
    });
    /*
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
    });*/
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
});