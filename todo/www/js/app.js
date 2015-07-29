// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic', 'ngCordova'])
var db = null;



ionicApp.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	
	// Below replaced with home.controller on 23 July 2015
	/*
	window.plugins.sqlDB.copy("db.sqlite", function() {
		db = $cordovaSQLite.openDB("db.sqlite");
	}, function(error) {
		console.error("There was an error copying the database: " + error);
		db = $cordovaSQLite.openDB("db.sqlite");
	});
	*/
	
  });
})


ionicApp.config(function($stateProvider, $urlRouterProvider) {
	// Ionic uses Angular UI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each states's controller can be found in controllers.js
	
	// Each separate page of the app will have a .state reference here.
	$stateProvider
	
	.state('home', {  //the name of the state
		url: '/home', // the url within the app used in the ui-sref call. Does not have to be the same as the name of the state but should be as good practice
		templateUrl: 'templates/home.html', //this is the location of the .html file within the templates folder that the js should redirect to
		controller: 'homeController'
	})
	.state('about', {
		url: '/about',
		templateUrl: 'templates/about.html',
		controller: 'aboutController'
	})
	.state('timeline', {
		url: '/timeline',
		templateUrl: 'templates/timeline.html'
	})
	.state('productlist', {
		url: '/productlist',
		templateUrl: 'templates/productlist.html',
		controller: 'productlistController'
	})	
	.state('products', {
		url: '/products/:prodID',
		templateUrl: 'templates/products.html',
		controller: 'productsController'
	})
	.state('platforms', {
		url: '/platforms',
		templateUrl: 'templates/platforms.html'
	})
	.state('customers', {
		url: '/customers',
		templateUrl: 'templates/customers.html'
	})
	.state('strategy', {
		url: '/strategy',
		templateUrl: 'templates/strategy/strategy.html'
	});
	
	// if none of the above states are mateched, use this as the 
	// fallback (this effectively makes whatever is stored in 
	// here the first page that is seen when the app starts)
	$urlRouterProvider.otherwise('/home');
	
});


ionicApp.controller("homeController", function($scope, $ionicPlatform, $ionicLoading, $location, $ionicHistory, $cordovaSQLite) {
	$ionicHistory.nextViewOptions({
		disableAnimate: true,
		disableBack: true
	});
	$ionicPlatform.ready(function() {
		$ionicLoading.show({ template: 'Loading... ' });
			window.plugins.sqlDB.copy("db.sqlite", 0, function() {  //0 is necessary but I have no idea why
				db = $cordovaSQLite.openDB("db.sqlite");
				$location.path("/RecordedEvents");
				$ionicLoading.hide();
		}, function(error) {
			console.error("There was an error copying the database: " + error);
			db = $cordovaSQLite.openDB("db.sqlite");
			$location.path("/RecordedEvents");
			$ionicLoading.hide();
		});
	});
});




ionicApp.controller("aboutController", function($scope, $ionicPlatform, $cordovaSQLite) {
	$scope.recordedevents = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT EvntID, EvntDscpt FROM RecordedEvents";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.recordedevents.push({EvntID: res.rows.item(i).EvntID, EvntDscpt: res.rows.item(i).EvntDscpt});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
	
});

ionicApp.controller("productlistController", function($scope, $ionicPlatform, $cordovaSQLite) {
	$scope.productlist = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT ProductID, ProductName FROM Products";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.productlist.push({ProductID: res.rows.item(i).ProductID, ProductName: res.rows.item(i).ProductName});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});

ionicApp.controller("productsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.products = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT ProductID, ProductName FROM Products where ProductID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.prodID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.products.push({ProductID: res.rows.item(i).ProductID, ProductName: res.rows.item(i).ProductName});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});


/* made obsoltete 23 July 2015

ionicApp.controller("ExController", function($scope, $cordovaSQLite) {
	
	$scope.selectAll = function() {
		var query = "SELECT EvntID, EvntDscpt FROM RecordedEvents";
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					console.log("SELECTED -> " + res.rows.item(i).EvntID + " " + res.rows.item(i).EvntDscpt);
				}
			} else {
				console.log("No results found");
			}
		}, function(err) {
			console.error(err);
		});
	}
});
*/
