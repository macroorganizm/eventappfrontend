applicationServices.factory('expensesService', function($http, $state, $q) {
  return {
    getExpensesList: function(eventId) {
      var expensesList = [];
      var deferred = $q.defer();

      var params = '&eventId=' + eventId;
      execGetRequest($http, $state, 'getexpenses', params, function(data) {
        if (data.status == 'ok') {
          for (expense in data.expenses) {
            var currentExpense = data.expenses[expense];
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


            expensesList.push({
              id: currentExpense._id,
              isOwner: isExpenseOwner,
              name: currentExpense.name,
              details: details,
              comments: currentExpense.comments.length
            });
          }

        }
        //console.log(data);
        deferred.resolve(expensesList);
      });
      
      return deferred.promise;
    },
    getExpense: function(expenseId, callback) {
      var expense = {};
      var members = {};
      var params = '&expenseId=' + expenseId;

      execGetRequest($http, $state, 'getexpense', params, function(data) {
        //console.log(data);
        if (data.status == 'ok') {
          callback(null, data);
        } else {
          callback('Recieving Expense data error');
        }
      });

    },
    add: function(params, callback) {
      execPostRequest($http, $state, 'addexpense', params, function(data) {
        if (data.status == 'Expense create') {
          callback(null, data.newExpId);
        } else {
          callback('We got an error here, try later');
        }
      });

    },
    edit: function(params, callback) {
      execPostRequest($http, $state, 'editexpense', params, function(data) {
        console.log(data);
        if (data.status == 'saved') {
          callback();
        } else {
          callback('We got an error here, try later');
        }
      });

    },
    approve: function(detailId, expenseId, cb) {

      var postArray = {
        detailId: detailId, //id êîíêðåòíîãî ñóáúåêòà, ÊÒÎ äîëæåí äåíåã
        expenseId: expenseId
      };

      execPostRequest($http, $state, 'approve', postArray, function(data) {
        if (data.status == 'approved') {
          cb();
          return;
        } else {
          cb('We got an error here, try later');
        }
      });

    },
    getExpenseData: function(expenseId) {
      
      var deferred = $q.defer();
      var expense = {};
      var members = {};
      var params = '&expenseId=' + expenseId;

      execGetRequest($http, $state, 'getexpense', params, function(data) {
        //console.log(data);
        if (data.status == 'ok') {
          var expenseData = data.expense;
          expense.expenseName = expenseData.name;
          expense.expenseOwner = (expenseData.ownerId._id == userData.id) ? 'You' : expenseData.ownerId.name;

          expense.details = [];
          var approvedAmount = 0; var unapprovedAmount = 0;
          expenseData.details.forEach(function(expenseSubject) {
            members[expenseSubject.memberId._id] = expenseSubject.memberId.name;
            if (expenseSubject.isApproved) {
              approvedAmount += parseFloat(expenseSubject.amount);
            } else {
              unapprovedAmount += parseFloat(expenseSubject.amount);
            }
            expense.details.push({
              detailId: expenseSubject._id, //id детали
              amount: expenseSubject.amount,
              subjectName: expenseSubject.memberId.name,
              ownSubject: (expenseSubject.memberId._id == userData.id), //если ЮЗЕР и есть
              //субъект, т.е. кто должен денег создателю експенса      
              isApproved: expenseSubject.isApproved
            });
          });
          expense.approvedAmount = approvedAmount;
          expense.unapprovedAmount = unapprovedAmount;

          var comments = [];
          if (expenseData.comments.length === 0) {
            expense.msg = 'No comments yet';
          } else {
            expenseData.comments.forEach(function(commentItem) {
              comments.push({
                commentator: members[commentItem.memberId],
                text: commentItem.text,
                isImportant: commentItem.isImportant,
                date: normalizeDate(commentItem.date)
              });
            });
            expense.comments = comments;
          }
        } else {
          console.log(data);
        }
        deferred.resolve(expense);
      });
      return deferred.promise;
    }
  };
});