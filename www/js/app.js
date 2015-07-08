// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.signin', {
    url: "/signin",
    views: {
      'menuContent': {
        templateUrl: 'templates/signin.html',
        controller: 'SignInCtrl'
      }
    }
  })
  .state('app.regform', {  
    url: '/signin/regform',
    views: {
      'menuContent': {
        templateUrl: 'templates/regform.html',
        controller: 'RegCtrl'
      }
    }
  })
  .state('app.events', {
    url: '/events',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'EventsCtrl'
      }
    },
	params : {archived : false}
  })
 /* .state('app.mainpage', {
    url: '/mainpage',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/mainpage.html',
        controller: 'MainPageCtrl'
      }
    }
  })*/
  .state('app.feed', {
    url: '/feed',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/feed.html',
        controller: 'FeedCtrl'
      }
    }
  })
  .state('app.addevent', {
    url: '/addevent',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addevent.html',
        controller: 'EventsCtrl'
      }
    }
  })
  .state('app.editevent', {
    url: '/editevent',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/editevent.html',
        controller: 'EventEditCtrl'
      }
    },
	params : {eventId : null}
  })
  .state('app.expenses', {
    url: '/expenses',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/expenses.html',
        controller: 'ExpensesCtrl'
      }
    },
	params : {eventId : null}
  })
  .state('app.eventbalance', {
    url: '/eventbalance',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/eventbalance.html',
        controller: 'EventBalanceCtrl'
      }
    },
	params : {eventId : null}
  })
  .state('app.showexpense', {
    url: '/expenses',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/showexpense.html',
        controller: 'ExpensesCtrl'
      }
    },
	params : {expenseId : null}
  })
  .state('app.addexpense', {
    url: '/addexpense/:eventId',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addexpense.html',
        controller: 'AddExpenseCtrl'
      }
    },
	params : {eventId : null, expenseId : null}
  })
  .state('app.editexpense', {
    url: '/addexpense',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addexpense.html',
        controller: 'AddExpenseCtrl'
      }
    },
	params : {eventId : null, expenseId : null}
  })
  .state('app.addcomment', {
    url: '/addcomment/:expenseId',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/addcomment.html',
        controller: 'AddCommentCtrl'
      }
    },
	params : {expenseId : null}
  })
  .state('app.friends', {
    url: '/friends',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/friends.html',
        controller: 'FriendsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/signin');
});
