application.controller('ExpensesCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, expensesService, feedsService, $ionicHistory) {
  //$ionicHistory.clearHistory();
  $scope.currentEventId = $stateParams.eventId;
  $scope.expensesList = [];
  

  if ($state.is('app.expenses')) {
    var expensesPromiseObj = expensesService.getExpensesList($stateParams.eventId);
    expensesPromiseObj.then(function(expensesList){

      $scope.expensesList = expensesList;
    });
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
      feedsService.clearBy(type, id);
    }
  }
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
});