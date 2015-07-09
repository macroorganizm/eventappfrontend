applicationServices.factory('feedsService', function($http, $state, $q) {
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
});