angular.module('starter.services', [])
  .factory('feedsService', function($http, $state, $q) {
    return {
      all: function() {
        var feedsList = {};
        var deferred = $q.defer();
        execGetRequest($http, $state, 'getfeeds', '', function(data) {
          if (data.status == 'ok') {
            data.feed.forEach(function(feedItem) {
              var feedKey = feedItem.entityType + '_' + feedItem.entityId;
              if (typeof(feedsList[feedKey]) === 'undefined') {
                feedsList[feedKey] = {
                  name : feedItem.entityName,
                  type : feedItem.entityType,
                  id : feedItem.entityId,
                  actions : {
                    adding : [],
                    editing : [],
                    approving : [],
                    commenting : []
                  }
                };
              }

              
              feedsList[feedKey].actions[feedItem.entityAction].push({
                date : normalizeDate(feedItem.date),
                text : feedItem.text
              });
            });

            deferred.resolve(feedsList);
          }
        });
        return deferred.promise;
      },
      getFeedBy: function(entityType, entityId) {
        var feed = {
          adding : [],
          editing : [],
          approving : [],
          commenting : [],
          all : []
        };
        var deferred = $q.defer();

        params = '&entityType=' + entityType + '&entityId=' + entityId;

        execGetRequest($http, $state, 'getfeeds', params, function(data) {
          if (data.status == 'ok') {
            data.feed.forEach(function(feedItem) {
              if (feedItem.entityType ===  entityType &&  feedItem.entityId === entityId) {
                //console.log(feedItem);
                var item = {
                  date : normalizeDate(feedItem.date),
                  text : feedItem.text
                }

                feed[feedItem.entityAction].push(item);
                feed.all.push(item);
              }

              
              

            });
            //console.log(feed);
            deferred.resolve(feed);
          }
        });
        return deferred.promise;
      },
      clearBy: function(entityType, entityId) {
        
        //console.log(arguments);
        var postArray = {
          entityType: entityType,
          entityId: entityId
        };

        execPostRequest($http, $state, 'clearfeedby', postArray, function(data) {
          if (data.status == 'done') {
            getFeed($http, $state);
          } else {
            //showAlert('error', 'We got an error here, try later', $ionicPopup);
          }
        });

        return null;
      }
    };
  })
  .factory('eventService', function($http, $state, $q) {
    return {
      all: function(isArchived) {
        var events = {};
        var msg = '';
        var deferred = $q.defer();
        var params = '&active=true';
        if (isArchived) {
          params = '&active=false';
          msg = 'Archived Events';
        }
        execGetRequest($http, $state, 'getevents', params, function(data) {
          if (data.status == 'ok') {
            for (item in data.events) {
              var cEvent = (data.events[item]);
              var isOwner = (cEvent.ownerId == userData.id) ? 1 : 0;
              events[cEvent._id] = {
                id: cEvent._id,
                name: cEvent.name,
                desc: cEvent.description,
                friendsCount: cEvent.friendsIds.length,
                isOwner: isOwner
              };
            }
          }
          deferred.resolve({
            msg: msg,
            events: events
          });
          // console.log(events);
        });
        return deferred.promise;
      },
      get: function(eventId) {
        var deferred = $q.defer();

        var event = {};
        execGetRequest($http, $state, 'getevent', '&eventId=' + eventId, function(data) {
          if (data.status == 'ok') {
            event.event = data.event.event;
            event.eventData = data.event.event;
            var isEventOwner = (data.event.event.ownerId == userData.id);
            event.isEventOwner = isEventOwner;
            event.eventMembers = data.event.friends;           
          }
          //console.log(data);
         deferred.resolve(event);
          // console.log(events);
        });
        return deferred.promise;
      }
    };
  })
  .factory('friendsService', function($http, $state, $q) {
    return {
      getMyFriends: function() {
        //console.log(1122);
        var friendsList = [];
        var deferred = $q.defer();
        var msg = '';
        execGetRequest($http, $state, 'getmyfriends', '', function(data) {
          if (isEmpty(data.friendsList)) {
            //console.log('friends list empty');
            msg = ' Contact list is empty';
          } else {
            for (friend in data.friendsList) {
              var currentFriend = data.friendsList[friend];
              friendsList.push({
                id: currentFriend.id,
                name: currentFriend.name,
                checked: false
              });
            }
            
            //$scope.friends = data.friendsList;
          }
          deferred.resolve({
            msg: msg,
            friends: friendsList
          });
        });
        
        return deferred.promise;
      },
      /*get: function(id) {
        for (var i = 0; i < cities.length; i++) {
          if (cities[i].id === parseInt(id)) {
            return cities[i];
          }
        }
        return null;
      }*/
    };
  })
  .factory('expensesService', function($http, $state, $q) {
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
  })
