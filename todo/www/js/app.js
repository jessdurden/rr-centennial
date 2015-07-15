// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
	// Ionic uses Angular UI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each states's controller can be found in controllers.js
	
	// Each separate page of the app will have a .state reference here.
	$stateProvider
	
	.state('home', {  //the name of the state
		url: '/home', // the url within the app used in the ui-sref call. Does not have to be the same as the name of the state but should be as good practice
		templateUrl: 'templates/home.html' //this is the location of the .html file within the templates folder that the js should redirect to
	})
	.state('about', {
		url: '/about',
		templateUrl: 'templates/about.html'
	})
	.state('timeline', {
		url: '/timeline',
		templateUrl: 'templates/timeline.html'
	})
		.state('products', {
		url: '/products',
		templateUrl: 'templates/products.html'
	})
		.state('platforms', {
		url: '/platforms',
		templateUrl: 'templates/platforms.html'
	})
		.state('customers', {
		url: '/customers',
		templateUrl: 'templates/customers.html'
	});
	
	// if none of the above states are mateched, use this as the 
	// fallback (this effectively makes whatever is stored in 
	// here the first page that is seen when the app starts)
	$urlRouterProvider.otherwise('/home');
	
});
		