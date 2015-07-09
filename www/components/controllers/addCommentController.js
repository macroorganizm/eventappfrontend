application.controller('AddCommentCtrl', function($scope, $state, $http, $stateParams, $ionicPopup) {
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
});