applicationServices.factory('eventService', function($http, $state, $q) {
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
    },
    getEventMembers: function(eventId, callback) {
      execGetRequest($http, $state, 'geteventmembers', '&eventId=' + eventId, function(data) {
        var eventMembers = [];
        if (data.status == 'ok') {

          for (friend in data.eventMembers) {
            var currentMember = data.eventMembers[friend];
            eventMembers.push({
              id: currentMember.id,
              name: currentMember.name
            });
          }
          callback(null, eventMembers);
          //$scope.eventMembers = data.eventMembers;
        } else {
          callback('getting members error');
        }
        //console.log($scope.eventMembers);
      });
    },
    add: function(eventData, friendsInEvent, callback) {
      var postArray = {
        eventData: eventData,
        ownerId: userData.id,
        friendsInEvent: friendsInEvent
      };

      execPostRequest($http, $state, 'addevent', postArray, function(data) {
        if (data.status == 'ok') {
          callback();
        } else {
          callback('We got an error here, try later');
        }
      }); 
    },
    edit: function(eventData, friendsInEvent, callback) {
      var postArray = {
        eventData: eventData,
        ownerId: userData.id,
        friendsInEvent: friendsInEvent
      };


      execPostRequest($http, $state, 'editevent', postArray, function(data) {
        if (data.status == 'ok') {
          callback();
        } else {
          callback('We got an error here, try later');
        }
      }); 
    }
  };
});