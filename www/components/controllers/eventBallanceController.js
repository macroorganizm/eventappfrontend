application.controller('EventBalanceCtrl', function($scope, $http, $state, $stateParams, $ionicPopup, expensesService) {

  if (userData == null || isUndef(userData.id)) {
    //$location.path("/tab/signin");
    $state.go('app.signin');
    return;
  }
  var params = '&eventId=' + $stateParams.eventId;

  expensesService.getExpensesList($stateParams.eventId, 'getexpensesforbalanse', function(err, res) {
    if (err) {
      showAlert('error', err, $ionicPopup);
      return;
    }
    console.log('newBall');
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
      res.expenses.forEach(function(expense) {
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
    
  
  });

  
});
