// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic', 'ngCordova'])
	.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
});
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
		url: '/events/:eveID',
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
	.state('variants', {
		url: '/variants/:varID',
		templateUrl: 'templates/variants.html',
		controller: 'variantsController'
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
	.state('thanks', {
		url: '/thanks',
		templateUrl: 'templates/thanks.html'
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
		var query = "SELECT EvntID, EvntDsptn FROM RecordedEvents";
	
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
	//This whole function runs after the page loads for the first time. This allows me to pull the actual heights and widths of the event boxes. The code is messy and I had to redefine some stuff from below. Sorry
	$scope.position = function() {
		var timebox = document.getElementById("timelinebox");
		var BaseHeight = timebox.clientHeight;
		var BaseWidth = timebox.clientWidth;
		var sizeAdjust = 10;
		var BaseLength = BaseHeight*sizeAdjust+(BaseHeight/sizeAdjust);
		/*Basically what I have here is an array of the whole timeline. I have divided it up 
		into 100 by 6 for both the top and bottom. Code futher down looks at that array when placing a 
		box and checks the rows closest to the timeline first. If those slots are filled it moves up 
		and checks again. it does this till it finds a hole big enough for the event. If the title is 
		longer than 29 char it assumes it will be wrapping. (It's a poor assumption but I don't know of 
		a good way to find out the width of an event dynamically. You might have an idea if so let me 
		know.) If it thinks it will be wrapping it will asign filled space to two lines instead of the 
		typical one line. If you have any questions text or call.*/
				var FilledDate = Array(2);
				FilledDate[0] = Array(8);
				FilledDate[0][0] = Array(100);
				FilledDate[0][1] = Array(100);
				FilledDate[0][2] = Array(100);
				FilledDate[0][3] = Array(100);
				FilledDate[0][4] = Array(100);
				FilledDate[0][5] = Array(100);
				FilledDate[0][6] = Array(100);
				FilledDate[0][7] = Array(100);
				FilledDate[1] = Array(8);
				FilledDate[1][0] = Array(100);
				FilledDate[1][1] = Array(100);
				FilledDate[1][2] = Array(100);
				FilledDate[1][3] = Array(100);
				FilledDate[1][4] = Array(100);
				FilledDate[1][5] = Array(100);
				FilledDate[1][6] = Array(100);
				FilledDate[1][7] = Array(100);
				for(var i = 0; i < 100; i++) {
					FilledDate[0][0][i] = 0;
					FilledDate[0][1][i] = 0;
					FilledDate[0][2][i] = 0;
					FilledDate[0][3][i] = 0;
					FilledDate[0][4][i] = 0;
					FilledDate[0][5][i] = 0;
					FilledDate[0][6][i] = 0;
					FilledDate[0][7][i] = 0;
					FilledDate[1][0][i] = 0;
					FilledDate[1][1][i] = 0;
					FilledDate[1][2][i] = 0;
					FilledDate[1][3][i] = 0;
					FilledDate[1][4][i] = 0;
					FilledDate[1][5][i] = 0;
					FilledDate[1][6][i] = 0;
					FilledDate[1][7][i] = 0;
				}
				
				var topOrBottom = 0;
				var count = 0;
				
				$scope.recordedeventstl.forEach(function(obj) {
					var callID = obj.id;
					eventDoc = document.getElementById(callID);
					var eventHeight = eventDoc.clientHeight;
					var eventWidth = eventDoc.clientWidth;
					var offsetDate = (BaseHeight/2/sizeAdjust);
 					var slopeDate = (BaseHeight/sizeAdjust);
					var roundWidth = Math.ceil(eventWidth/slopeDate);
					var yearPos = obj.locator;
					var offsetDate = (BaseHeight/2/sizeAdjust);
 					var slopeDate = (BaseHeight/sizeAdjust);
					var LocatorVal = slopeDate*yearPos + offsetDate;	
					
					var offsetConst = 1;
					var foundHome = false;
					for(var m = 0; m <= 5; m++) {
						if(foundHome == false){
							var clearSpace = true;
							for(var k = 0; k <= roundWidth; k++) {
								var checkVal = k + yearPos - roundWidth;
								if(k >= 0){			
									if(FilledDate[topOrBottom][m][checkVal] != 0 ){
										clearSpace = false;
									}
								}
							}
							if (clearSpace){
								foundHome = true;
								offsetConst = offsetConst + m;
								for(var k = 0; k <= roundWidth; k++) {
									var checkVal = k + yearPos - roundWidth;	
									if(k >= 0){
										FilledDate[topOrBottom][m][checkVal] = 1;
										if(topOrBottom == 0){		
											if(eventHeight > 20){
												var secondm = m + 1;
												offsetConst = 1 + secondm;
												if(secondm < 6){
													FilledDate[topOrBottom][secondm][checkVal] = 1;
												}
											}
										} else {
											if(eventHeight > 20){
												var secondm = m + 1;
												if(secondm < 6){
													FilledDate[topOrBottom][secondm][checkVal] = 1;
												}
											}
										}	
									}
								}
							}
						}
					}

				if(topOrBottom == 0){
					//Adjust this value to add spacing (the value multiplied to offsetConst)
    					var boxValY = (BaseHeight/2)-offsetConst*30-5;
    					ctx.beginPath();
					ctx.moveTo(LocatorVal,(BaseHeight/2)-(BaseHeight/10/sizeAdjust));
					ctx.lineTo(LocatorVal,boxValY+5);
					ctx.stroke();
    					topOrBottom = 1;
    					
    				} else{
    					//Adjust this value to add spacing (the value multiplied to offsetConst)
    					var boxValY = (BaseHeight/2)+offsetConst*30+20;
    					ctx.beginPath();
					ctx.moveTo(LocatorVal,(BaseHeight/2)+(BaseHeight/10/sizeAdjust));
					ctx.lineTo(LocatorVal,boxValY+5);
					ctx.stroke();
    					topOrBottom = 0;
				}
				var boxStringY = boxValY.toString();
				boxStringY = boxStringY+'px';
				obj.yloc = boxStringY;
			});
   	}	
		var timebox = document.getElementById("timelinebox");
		/*document.getElementById("testnum").innerHTML = timebox.clientHeight;*/
		var c=document.getElementById("timeline");
		var BaseHeight = timebox.clientHeight;
		var BaseWidth = timebox.clientWidth;
		var scrollbox=document.getElementById("timelinewindow");
		/*var dateWidth = datebox.clientWidth;*/
		var sizeAdjust = 10;
		var BaseLength = BaseHeight*sizeAdjust+(BaseHeight/sizeAdjust);
		c.height = BaseHeight;
		c.width = BaseLength;
		var BaseHStr = BaseHeight.toString();
		var BaseLStr = BaseLength.toString();
		BaseHStr = BaseHStr+'px';
		BaseLStr = BaseLStr+'px';
		scrollbox.style.height=BaseHStr;
		scrollbox.style.width=BaseLStr;
		var ctx=c.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(0,BaseHeight/2);
		ctx.lineTo(BaseLength,BaseHeight/2);
		ctx.stroke();
		for(i = 0; i <= (BaseLength-(BaseHeight/sizeAdjust)); i += (BaseHeight/sizeAdjust)){
 			ctx.beginPath();
 			ctx.moveTo((BaseHeight/2/sizeAdjust)+i,(BaseHeight/2)+(BaseHeight/10/sizeAdjust));
 			ctx.lineTo((BaseHeight/2/sizeAdjust)+i,(BaseHeight/2)-(BaseHeight/10/sizeAdjust));
 			ctx.stroke();
 			}
 		var offsetDate = (BaseHeight/2/sizeAdjust);
 		var slopeDate = (BaseHeight/sizeAdjust);
 			$scope.dates = [];
 			var datesArray = [];
 			for (i = 0; i <= 100; i++) {
 				var backendDate =1915 + i;
 				var UpVal = slopeDate*i + offsetDate;
 				var UpString = UpVal.toString();
 				UpString = UpString+'px';
 				var backendString = backendDate.toString();
				var UpValY = (BaseHeight/2)+2*(BaseHeight/10/sizeAdjust);
				var UpStringY = UpValY.toString();
				UpStringY = UpStringY+'px';
    				datesArray[i] = {
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
				var eventsArray = [];		
				var upcount = 0;
			
				for(var i = 0; i < res.rows.length; i++) {

    				var year = res.rows.item(i).StampedYear;
    				var title = res.rows.item(i).EvntTitle;
    				var EventID = res.rows.item(i).EvntID;
    				
    				//Exceptions - If a title is too long shorten it here. (Full title is still displayed in event page)
    				if (title == "Allison GMA 3007 selected to power Cessna Citation X"){title = "AE3007 to power Citation X"};
    				if (title == "AE 3007 powered Embraer EMB-145 makes 1st flight"){title = "EMB-145 1st flight"};
    				if (title == "Allison GMA 3007 selected to power EMB-145"){title = "AE3007 to power EMB-145"};
    				if (title == "Allison GMA 2100 selected to power Saab 2000"){title = "AE2100 to power Saab 2000"};
    				if (title == "Allison GMA 2100 powers Saab 2000 1st flight"){title = "Saab 2000 1st flight"};
    				if (title == "CTS800-powered A129 attack helicopter makes first flight"){title = "A129 1st flight"};
    				if (title == "First flight of Allison AE 2100D3 engined C-130J"){title = "C-130J 1st flight"};
    				if (title == "Rolls-Royce/Lockheed Martin/ Pratt & Whitney wins contract for LiftFan - Wins Collier Trophy"){title = "Rolls-Royce wins contract for LiftFan - Wins Collier Trophy"};
				if (title == "Four Allison Propellant Tanks Used on Apollo 7"){title = "Apollo 7"};
				if (title == "Allison Celebrates 50th Anniversary"){title = "50th Anniversary"};
				if (title == "Allison Selected to Work On VTOL Aircraft Engine"){title = "VTOL Engine"};


					var Locator = year - 1915;					
					var endOffSet = -50;
					if(Locator <= 2){
						endOffSet = (Locator/2)*(-45) - 5;
					} else if(Locator >= 98){
						endOffSet = ((Locator - 98)/2)*(-50) - 45;
					}
 					endOffSet = endOffSet.toString();
 					endOffSet = endOffSet + '%';
					var LocatorVal = slopeDate*Locator + offsetDate;
					var LocatorString = LocatorVal.toString();
					LocatorString = LocatorString + 'px';
					
					var boxValY = (BaseHeight/2);
					var boxStringY = boxValY.toString();
					boxStringY = boxStringY+'px';
					var widthVal = BaseWidth*0.9;
					var widthString = widthVal.toString();
					widthString = widthString+'px';
					var heightVal = BaseWidth*0.45;
					var heightString = heightVal.toString();
					heightString = heightString+'px';
					
					var ID = i;
					var IDString = ID.toString();
					IDString = 'event_' + IDString;
				
					var printcount = i.toString();
				
					eventsArray[i] = {
						id: IDString,
						EvntID: EventID,
						text: title,
						xloc: LocatorString,
						yloc: boxStringY,
						boxWidth: widthString,
						position: 'absolute',   						
						endOffset: endOffSet,
						locator: Locator
					};							
				}
				$scope.recordedeventstl = eventsArray;
			}
		}, function(err) {
			console.error(err);
		});		

});

ionicApp.controller("eventsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.events = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT * FROM RecordedEvents,Timestamps where RecordedEvents.EvntID = Timestamps.TimestampID and RecordedEvents.EvntID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.eveID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
				
					var month = "month";
					if(res.rows.item(i).StampedMonth == 1) {
						month = "January"
					} else if(res.rows.item(i).StampedMonth == 2) {
						month = "February"
					} else if(res.rows.item(i).StampedMonth == 3) {
						month = "March"
					} else if(res.rows.item(i).StampedMonth == 4) {
						month = "April"
					} else if(res.rows.item(i).StampedMonth == 5) {
						month = "May"
					} else if(res.rows.item(i).StampedMonth == 6) {
						month = "June"
					} else if(res.rows.item(i).StampedMonth == 7) {
						month = "July"
					} else if(res.rows.item(i).StampedMonth == 8) {
						month = "August"
					} else if(res.rows.item(i).StampedMonth == 9) {
						month = "September"
					} else if(res.rows.item(i).StampedMonth == 10) {
						month = "October"
					} else if(res.rows.item(i).StampedMonth == 11) {
						month = "November"
					} else if(res.rows.item(i).StampedMonth == 12) {
						month = "December"
					}
					
					var day = "day";
					if(res.rows.item(i).StampedDay) {
						day = res.rows.item(i).StampedDay + ",";
					} else {
						day = "";
					}
					$scope.events.push({EvntID: res.rows.item(i).EvntID, EvntTitle: res.rows.item(i).EvntTitle, EvntImgLnk: res.rows.item(i).EvntImgLnk, EvntDsptn: res.rows.item(i).EvntDsptn, StampedYear: res.rows.item(i).StampedYear, StampedMonth: month, StampedDay: day});
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
		var query = "SELECT * FROM Products";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.productlist.push({ProductID: res.rows.item(i).ProductID, ProductName: res.rows.item(i).ProductName, ProductImgLnk: res.rows.item(i).ProductImgLnk});
				}
			}
		}, function(err) {
			console.error(err);
		});
	});
});

ionicApp.controller("productsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.products = [];
	$scope.productspeclist = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT * FROM Products where ProductID = ?";
	
		$cordovaSQLite.execute(db, query, [$stateParams.prodID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.products.push({ProductID: res.rows.item(i).ProductID, ProductName: res.rows.item(i).ProductName, ProductDsptn: res.rows.item(i).ProductDsptn, ProductImgLnk: res.rows.item(i).ProductImgLnk});
				
					var specarray = [res.rows.item(i).ProductSpec1, res.rows.item(i).ProductSpec2, res.rows.item(i).ProductSpec3, res.rows.item(i).ProductSpec4, res.rows.item(i).ProductSpec5, res.rows.item(i).ProductSpec6, res.rows.item(i).ProductSpec7, res.rows.item(i).ProductSpec8];

					var k = 0;
					while(specarray[k]) {
						$scope.productspeclist.push({ProductSpec: specarray[k]});
						k++;					
					}
				}
			}
		}, function(err) {
			console.error(err);
		});
	});

	$scope.variantlist = [];
	$scope.novariant = [];
	
	$ionicPlatform.ready(function() {
		var query2 = "Select ProdVarID, ProdVarName from Prod_Variants where ProductID = ?";
		
		$cordovaSQLite.execute(db, query2, [$stateParams.prodID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var j = 0; j < res.rows.length; j++) {
					$scope.variantlist.push({ProdVarID: res.rows.item(j).ProdVarID, ProdVarName: res.rows.item(j).ProdVarName});
				}
				$scope.novariant.push({NoVariants: ""});
			} else {
				$scope.novariant.push({NoVariants: ": None Listed"});
			}
		}, function(err) {
			console.eror(err);
		});
	});
});

ionicApp.controller("variantsController", function($scope, $ionicPlatform, $cordovaSQLite, $stateParams) {
	$scope.variants = [];
	$scope.prodvarspeclist = [];
	
	$ionicPlatform.ready(function() {
		var query = "SELECT * FROM Prod_Variants where ProdVarID = ?";
		
		$cordovaSQLite.execute(db, query, [$stateParams.varID]).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.variants.push({ProdVarID: res.rows.item(i).ProdVarID, ProdVarName: res.rows.item(i).ProdVarName, ProductID: res.rows.item(i).ProductID, ProdVarDsptn: res.rows.item(i).ProdVarDsptn, ProdVarImgLnk: res.rows.item(i).ProdVarImgLnk});
					
					var varspecarray = [res.rows.item(i).ProdVarSpec1, res.rows.item(i).ProdVarSpec2, res.rows.item(i).ProdVarSpec3, res.rows.item(i).ProdVarSpec4, res.rows.item(i).ProdVarSpec5, res.rows.item(i).ProdVarSpec6, res.rows.item(i).ProdVarSpec7, res.rows.item(i).ProdVarSpec8];

					var k = 0;
					while(varspecarray[k]) {
						$scope.prodvarspeclist.push({ProdVarSpec: varspecarray[k]});
						k++;					
					}				
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
		var query = "SELECT * FROM Platforms";
	
		$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.length > 0) {
				for(var i = 0; i < res.rows.length; i++) {
					$scope.platformlist.push({PlatformID: res.rows.item(i).PlatformID, PlatformName: res.rows.item(i).PlatformName, PlatformImgLnk: res.rows.item(i).PlatformImgLnk});
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
