applicationServices.factory('commentsService', function($http, $state, $q) {
  var factory = {
    addComment : addComment
  };

  return factory;

  function addComment (comment, expenseId, callback) {
    //console.log('new comment commentsService');
    var isImportant = (isUndef(comment.isImportant)) ? false : comment.isImportant;
    var postArray = {
      commentText: comment.text,
      expenseId: expenseId,
      isImportant: isImportant
    };

    execPostRequest($http, $state, 'addexpensecomment', postArray, function(data) {
      if (data.status == 'saved') {
        callback();
      } else {
        callback('We got an error here, try later');
      }
    });     
  }
  

});