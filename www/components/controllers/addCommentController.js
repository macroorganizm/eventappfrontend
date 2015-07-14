application.controller('AddCommentCtrl', function($scope, $state, commentsService, $stateParams, $ionicPopup) {
  $scope.currentExpenseId = $stateParams.expenseId;

  $scope.addComment = function(comment, expenseId) {

    if (isUndef(comment) || isUndef(comment.text)) {
      showAlert('error', 'You want to send a nothing? Realy?', $ionicPopup);
      return;
    }

    commentsService.addComment(comment, expenseId, function(err, res) {
      if (err) {
        showAlert('error', err, $ionicPopup);        
      } else {
        $state.go('app.showexpense', {
          expenseId: expenseId
        });
      }
    })
  };
});