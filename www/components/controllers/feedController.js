application.controller('FeedCtrl', function($scope, $http, $state, feedsService) {
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
    }
  };
});