// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
  $rootScope.usuName = "";
  $rootScope.usuEmail = "";
  $rootScope.usuImg = "";
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(typeof analytics !== "undefined") {
      analytics.startTrackerWithId("UA-37830346-10");
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menu'
  })

  .state('app.login', {
    url: '/login',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'login'
      }
    }
  })
  .state('app.stepone', {
      url: '/stepone',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/stepone.html',
          controller: 'createSuggerence'
        }
      }
    })
  .state('app.steptwo', {
      url: '/steptwo',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/steptwo.html',
          controller: 'createSuggerence'
        }
      }
    })
  .state('app.stepthree', {
      url: '/stepthree',
      views: {
        'menuContent': {
          templateUrl: 'templates/stepthree.html',
          controller: 'createSuggerence'
        }
      }
    })
  .state('app.register', {
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'register'
        }
      }
    })

    .state('app.companies', {
      url: '/companies',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/companies.html',
          controller: 'createSuggerence'
        }
      }
    })

    .state('app.suggestions-row', {
      url: '/suggestions',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/suggestions-row.html',
          controller: 'suggestions'
        }
      }
    })

    .state('app.suggestions-square', {
      url: '/suggestions',
      views: {
        'menuContent': {
          templateUrl: 'templates/suggestions-square.html',
          controller: 'suggestions'
        }
      }
    })

  .state('app.suggestions', {
    url: '/suggestions/:suggestionid',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'suggestionDetail'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
