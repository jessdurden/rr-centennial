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
		templateUrl: 'templates/timeline.html',
		controller: 'timelineController'
	})
	.state('events', {
		url: '/events/:eventID',
		templateUrl: 'templates/events.html',
		controller: 'eventsController'
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
	.state('platformlist', {
		url: '/platformlist',
		templateUrl: 'templates/platformlist.html',
		controller: 'platformlistController'
	})	
	.state('platforms', {
		url: '/platforms/:platID',
		templateUrl: 'templates/platforms.html',
		controller: 'platformController'
	})
	.state('customerlist', {
		url: '/customerlist',
		templateUrl: 'templates/customerlist.html',
		controller: 'customerlistController'
	})
	.state('customers', {
		url: '/customers/:custID',
		templateUrl: 'templates/customers.html',
		controller: 'customerController'
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
		var query = "SELECT EventID, EvntDsptn FROM RecordedEvents";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.recordedevents.push({EvntID: res.rows.item(i).EvntID, EvntDsptn: res.rows.item(i).EvntDsptn});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
	
});

ionicApp.controller("timelineController", function($scope, $ionicPlatform, $cordovaSQLite) {
	$scope.recordedeventstl = [];
	
	$ionicPlatform.ready(function() {
		
		var timebox = document.getElementById("timelinebox");
		/*document.getElementById("testnum").innerHTML = timebox.clientHeight;*/
		var c=document.getElementById("timeline");
		var BaseHeight = timebox.clientHeight;
		var BaseWidth = timebox.clientWidth;
		/*var datebox=document.getElementById("DateBox");
		var dateWidth = datebox.clientWidth;*/
		var sizeAdjust = 10;
		var BaseLength = BaseHeight*sizeAdjust+(BaseHeight/sizeAdjust);
		c.height = BaseHeight;
		c.width = BaseLength;
		var ctx=c.getContext("2d");
		ctx.beginPath(); /* draws main timeline */
		ctx.moveTo(0,BaseHeight/2);
		ctx.lineTo(BaseLength,BaseHeight/2);
		ctx.stroke();
		for(i = 0; i <= (BaseLength-(BaseHeight/sizeAdjust)); i += (BaseHeight/sizeAdjust)){  /* draws individual ticks for years */
 			ctx.beginPath();
 			ctx.moveTo((BaseHeight/2/sizeAdjust)+i,(BaseHeight/2)+(BaseHeight/10/sizeAdjust));
 			ctx.lineTo((BaseHeight/2/sizeAdjust)+i,(BaseHeight/2)-(BaseHeight/10/sizeAdjust));
 			ctx.stroke();
 			}
 		var offsetDate = (BaseHeight/2/sizeAdjust);
 		var slopeDate = (BaseHeight/sizeAdjust);
 			$scope.dates = [];
 			var datesArray = [];
 			for (ia = 0; ia <= 100; ia++) {
 				var backendDate =1915 + ia;
 				var UpVal = slopeDate*ia + offsetDate;
 				var UpString = UpVal.toString();
 				UpString = UpString+'px';
 				var backendString = backendDate.toString();
				var UpValY = (BaseHeight/2)+2*(BaseHeight/10/sizeAdjust);
				var UpStringY = UpValY.toString();
				UpStringY = UpStringY+'px';
    				datesArray[ia] = {
      					text: backendString,
      					xloc: UpString,
      					yloc: UpStringY,
      					position: 'absolute'
    					};
    		}
		    $scope.dates=datesArray;
		/*var query = "SELECT EvntID, EvntDsptn, StampedYear FROM RecordedEvents";*/
		var query = "SELECT * FROM RecordedEvents,TimeStamps WHERE RecordedEvents.TimeStampID = TimeStamps.TimeStampID";
		
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {					
				var FilledDate = Array(2);                            /*Filled Date */
				FilledDate[0] = Array(100);							/*Filled Date */
				FilledDate[1] = Array(100);									/*Filled Date */
				for(var id = 0; id <= 99; id++) {
					FilledDate[0][id] = 0;									/*Filled Date */
					FilledDate[1][id] = 0;									/*Filled Date */
				}				
				var blockVal = Math.ceil(BaseWidth*0.9/slopeDate);
				blockVal = blockVal.toString();
				var topOrBottom = 0;
				var count = 0;
				
				var yearSort = [];
				var yearIndex = [];
				
				for(var ib = 0; ib < res.rows.length; ib++) {
					yearSort[ib] = res.rows.item(ib).StampedYear;
				}	
				yearSort = yearSort.sort();		
				
				for(var ic = 0; ic < res.rows.length; ic++) {
				
					var newi = 0;
					for(var j = 0; j < res.rows.length; j++) {
						var yearCheck = res.rows.item(j).StampedYear;
						var sortCheck = yearSort[ic];
						if(sortCheck == yearCheck){
							newi = j;
						}	
					}
				
    				var year = res.rows.item(newi).StampedYear;
    				var title = res.rows.item(newi).EvntTitle;
    				var EventID = res.rows.item(newi).EventID;

					var Locator = year - 1915;
					var needCheck = blockVal*2;
					
					for(var k = 0; k <= needCheck; k++) {
						var checkVal = k + Locator - blockVal;
						if(checkVal >= 0){
							FilledDate[topOrBottom][checkVal] = FilledDate[topOrBottom][checkVal] + 1;						/*Filled Date */
						}
					}
					var endOffSet = -50;
					
					if(Locator <= 2){
						endOffSet = (Locator/2)*(-45) - 5;
 					} else if(Locator >= 97){
 						endOffSet = ((Locator - 97)/2)*(-50) - 50;
 					}
					
 					endOffSet = endOffSet.toString();
 					endOffSet = endOffSet + '%';
					var LocatorVal = slopeDate*Locator + offsetDate;
					var LocatorString = LocatorVal.toString();
					LocatorString = LocatorString + 'px';
					
					/* alternates top or bottom for timeline  */
					if(topOrBottom == 0){
    					var boxValY = (BaseHeight/2)-2*slopeDate*FilledDate[topOrBottom][Locator];													/*Filled Date */
    					ctx.beginPath();
						ctx.moveTo(LocatorVal,(BaseHeight/2)-(BaseHeight/10/sizeAdjust));
						ctx.lineTo(LocatorVal,boxValY+5);
						ctx.stroke();
    					topOrBottom = 1;
    					
    				} else{
    					var boxValY = (BaseHeight/2)+2*slopeDate*FilledDate[topOrBottom][Locator];						/*Filled Date */
    					ctx.beginPath();
						ctx.moveTo(LocatorVal,(BaseHeight/2)+(BaseHeight/10/sizeAdjust));
						ctx.lineTo(LocatorVal,boxValY+5);
						ctx.stroke();
    					topOrBottom = 0;
					}
									
					var boxStringY = boxValY.toString();
					boxStringY = boxStringY+'px';
					var widthVal = BaseWidth*0.9;
					var widthString = widthVal.toString();
					widthString = widthString+'px';
					var heightVal = BaseWidth*0.45;
					var heightString = heightVal.toString();
					heightString = heightString+'px';
				
					var printcount = ic.toString();
				
    				$scope.recordedeventstl.push({
      					text: title,
      					xloc: LocatorString,
      					yloc: boxStringY,
      					boxWidth: widthString,
      					position: 'absolute',
      					EvntID: EventID,
      					endOffset: endOffSet
    				});

				}
			}
		}, function(err) {
			console.error(err);
		});		
	});	
});

ionicApp.controller("eventsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.events = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT * FROM RecordedEvents where EventID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.eventID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.events.push({EvntID: res.rows.item(i).EvntID, EvntTitle: res.rows.item(i).EvntTitle, EvntImgLnk: res.rows.item(i).EvntImgLnk, EvntDsptn: res.rows.item(i).EvntDsptn });
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
		var query = "SELECT ProductID, ProductName, ProductDsptn, ProductImgLnk, ProductQckFct, ProductSpecs FROM Products where ProductID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.prodID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.products.push({ProductID: res.rows.item(i).ProductID, ProductName: res.rows.item(i).ProductName, ProductDsptn: res.rows.item(i).ProductDsptn, ProductImgLnk: res.rows.item(i).ProductImgLnk, ProductQckFct: res.rows.item(i).ProductQckFct, ProductSpecs: res.rows.item(i).ProductSpecs});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});

ionicApp.controller("platformlistController", function($scope, $ionicPlatform, $cordovaSQLite) {
	$scope.platformlist = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT PlatformID, PlatformName FROM Platforms";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.platformlist.push({PlatformID: res.rows.item(i).PlatformID, PlatformName: res.rows.item(i).PlatformName});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});

ionicApp.controller("platformController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.platforms = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT PlatformID, PlatformName, PlatformDsptn, PlatformImgLnk FROM Platforms where PlatformID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.platID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.platforms.push({PlatformID: res.rows.item(i).PlatformID, PlatformName: res.rows.item(i).PlatformName, PlatformDsptn: res.rows.item(i).PlatformDsptn, PlatformImgLnk: res.rows.item(i).PlatformImgLnk});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});

ionicApp.controller("customerlistController", function($scope, $ionicPlatform, $cordovaSQLite) {
	$scope.customerlist = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT CustomerID, CustomerName FROM Customers";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.customerlist.push({CustomerID: res.rows.item(i).CustomerID, CustomerName: res.rows.item(i).CustomerName});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});

ionicApp.controller("customerController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.customers = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT CustomerID, CustomerName, CustomerDsptn, CustomerImgLnk FROM Customers where CustomerID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.custID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.customers.push({CustomerID: res.rows.item(i).CustomerID, CustomerName: res.rows.item(i).CustomerName, CustomerDsptn: res.rows.item(i).CustomerDsptn, CustomerImgLnk: res.rows.item(i).CustomerImgLnk});
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
		var query = "SELECT EvntID, EvntDsptn FROM RecordedEvents";
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					console.log("SELECTED -> " + res.rows.item(i).EvntID + " " + res.rows.item(i).EvntDsptn);
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
