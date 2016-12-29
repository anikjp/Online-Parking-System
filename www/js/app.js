window.globalVariable = {
    //custom color style variable
    startPage: {
        url: "/", //Url of start page.
        state: "intro" //State name of start page.
    },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    }
}; // End Global variable
var db = null; //Use for SQLite database.
var tomedb = null; //Use for SQLite database.
angular.module('starter', ['ionic', 'oauth1Client', 'ngMap', 'ionic-datepicker', 'ionic-multi-date-picker', 'ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'starter.constant', 'ngMaterial', 'ngMessages', 'ngCordova']).run(function($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet) {
    function initialSQLite() {
        db = window.cordova ? $cordovaSQLite.openDB("contract.db") : window.openDatabase("contract.db", "1.0", "IonicMaterialDesignDB", -1);
        //Create database table of contracts by using sqlite database.
        //Table schema :
        //Column       Type      Primary key
        //  id          Integer     Yes
        //  firstName   Text        No
        //  lastName    Text        No
        //  telephone   Text        No
        //  email       Text        No
        //  note        Text        No
        //  createDate  DateTime    No
        //  age         Integer     No
        //  isEnable    Boolean     No
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contracts " + "( id           integer primary key   , " + "  firstName    text                  , " + "  lastName     text                  , " + "  telephone    text                  , " + "  email        text                  , " + "  note         text                  , " + "  createDate   dateTime              , " + "  age          integer               , " + "  isEnable     Boolean)                ");
        tomedb = window.cordova ? $cordovaSQLite.openDB("tomereta.db") : window.openDatabase("tome.db", "1.0", "TomeretaDB", -1);
        //Favarite list--
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS favorites_list " + "( id                       integer primary key   , " + "  ParkingId                integer               , " + "  Name                     text                  , " + "  Address                  text                  , " + "  imgUrl                   text                  , " + "  utilization_start_time   text                  , " + "  utilization_end_time     text                  , " + "  price                    integer               , " + "  vehicles_type            text                  , " + "  createDate               dateTime               ) ");
        //Browsing history list--
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS history_list " + "( id                       integer primary key   , " + "  ParkingId                integer               , " + "  Name                     text                  , " + "  Address                  text                  , " + "  imgUrl                   text                  , " + "  utilization_start_time   text                  , " + "  utilization_end_time     text                  , " + "  price                    integer               , " + "  vehicles_type            text                  , " + "  createDate   dateTime                          ) ");
    };
    // End creating SQLite database table.
    // Create custom defaultStyle.
    function getDefaultStyle() {
        return "" + ".material-background-nav-bar { " + "   background-color        : " + appPrimaryColor + " !important; " + "   border-style            : none;" + "}" + ".md-primary-color {" + "   color                     : " + appPrimaryColor + " !important;" + "}";
    } // End create custom defaultStyle
    // Create custom style for product view.
    function getProductStyle() {
        return "" + ".material-background-nav-bar { " + "   background-color        : " + appPrimaryColor + " !important;" + "   border-style            : none;" + "   background-image        : url('img/background_cover_pixels.png') !important;" + "   background-size         : initial !important;" + "}" + ".md-primary-color {" + "   color                     : " + appPrimaryColor + " !important;" + "}";
    } // End create custom style for product view.
    function initialRootScope() {
        $rootScope.appPrimaryColor = appPrimaryColor; // Add value of appPrimaryColor to rootScope for use it to base color.
        $rootScope.isAndroid = ionic.Platform.isAndroid(); // Check platform of running device is android or not.
        $rootScope.isIOS = ionic.Platform.isIOS(); // Check platform of running device is ios or not.
    };

    function hideActionControl() {
        //For android if user tap hardware back button, Action and Dialog should be hide.
        $mdBottomSheet.cancel();
        $mdDialog.cancel();
    };
    // createCustomStyle will change a style of view while view changing.
    // Parameter :
    // stateName = name of state that going to change for add style of that page.
    function createCustomStyle(stateName) {
        var customStyle = ".material-background {" + "   background-color          : " + appPrimaryColor + " !important;" + "   border-style              : none;" + "}" + ".spinner-android {" + "   stroke                    : " + appPrimaryColor + " !important;" + "}";
        customStyle += getProductStyle();
        return customStyle;
    } // End createCustomStyle
    // Add custom style while initial application.
    $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);
    $ionicPlatform.ready(function() {
        ionic.Platform.isFullScreen = true;
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        initialSQLite();
        initialRootScope();
        //Checking if view is changing it will go to this function.
        $rootScope.$on('$ionicView.beforeEnter', function() {
            //hide Action Control for android back button.
            hideActionControl();
            // Add custom style ti view.
            $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
        });
    });
}).config(function($ionicConfigProvider, ionicDatePickerProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $mdColorPalette, oauth1ClientProvider) {
    var datePickerObj = {
        inputDate: new Date(),
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        mondayFirst: false,
        weeksList: ["S", "M", "T", "W", "T", "F", "S"],
        monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        templateType: 'popup',
        from: new Date(2012, 8, 1),
        to: new Date(2018, 8, 1),
        showTodayButton: true,
        dateFormat: 'dd MMMM yyyy',
        closeOnSelect: false,
        disableWeekdays: [6],
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
    // Use for change ionic spinner to android pattern.
    $ionicConfigProvider.spinner.icon("android");
    $ionicConfigProvider.views.swipeBackEnabled(false);
    var jsScrolling = (ionic.Platform.isAndroid()) ? false : true;
    $ionicConfigProvider.scrolling.jsScrolling(jsScrolling);
    // mdIconProvider is function of Angular Material.
    // It use for reference .SVG file and improve performance loading.
    $mdIconProvider.icon('facebook', 'img/icons/facebook.svg').icon('twitter', 'img/icons/twitter.svg').icon('mail', 'img/icons/mail.svg').icon('message', 'img/icons/message.svg').icon('share-arrow', 'img/icons/share-arrow.svg').icon('more', 'img/icons/more_vert.svg');
    //mdThemingProvider use for change theme color of Ionic Material Design Application.
    $mdThemingProvider.theme('default').primaryPalette('light-blue').accentPalette('red');
    //appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.
    appPrimaryColor = "#517FA4";
    //$stateProvider is using for add or edit HTML view to navigation bar.
    //
    //Schema :
    //state_name(String)      : Name of state to use in application.
    //page_name(String)       : Name of page to present at localhost url.
    //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
    //html_file_path(String)  : Path of html file.
    //controller_name(String) : Name of Controller.
    //
    $stateProvider.state('intro', {
        url: '/',
        templateUrl: 'templates/common/intro.html',
        controller: 'IntroCtrl'
    }).state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu/html/menu.html",
        controller: 'menuCtrl'
    }).state('app.top_search', {
        url: "/top_search",
        params: {
            isAnimated: false
        },
        views: {
            'menuContent': {
                templateUrl: "templates/top_search/html/top_search.html",
                controller: 'Top_searchCtrl'
            }
        }
    }).state('app.favourite_list', {
        url: "/favourite_list",
        cache: false,
        params: {
            isAnimated: false
        },
        views: {
            'menuContent': {
                templateUrl: "templates/favourite_list/html/favourite_list.html",
                controller: 'FavariteListController'
            }
        }
    }).state('app.history_list', {
        url: "/history_list",
        cache: false,
        params: {
            isAnimated: false
        },
        views: {
            'menuContent': {
                templateUrl: "templates/history_list/html/history_list.html",
                controller: 'HistoryListController'
            }
        }
    }).state('app.parking_details', {
        url: "/parking_details",
        params: {
            parking_space_id: null,
            parking_type: null,
            parking_slot: null,
            isAnimated: false
        },
        views: {
            'menuContent': {
                templateUrl: "templates/parking_details/html/parking_details.html",
                controller: "Parking_detailsCtrl"
            }
        }
    }).state('app.parking_details_monthly', {
        url: "/parking_details_monthly",
        params: {
            parking_space_id: null,
            parking_type: null,
            parking_slot: null,
            isAnimated: false
        },
        views: {
            'menuContent': {
                templateUrl: "templates/parking_details_monthly/html/parking_details_monthly.html",
                controller: "Parking_details_monthlyCtrl"
            }
        }
    }).state('app.coinpark_details', {
        url: "/coinpark_details",
        params: {
            targetdata: null,
            isAnimated: false
        },
        views: {
            'menuContent': {
                templateUrl: "templates/coinpark_details/html/coinpark_details.html",
                controller: "Coinpark_detailsCtrl"
            }
        }
    }).state('app.flashLight', {
        url: "/dropboxLogin",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/social-network-connect/dropbox/html/dropbox-feed.html",
                //controller: 'Userctrl'
            }
        }
    }).state('app.dropboxLogin', {
        url: "/dropboxLogin",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/social-network-connect/dropbox/html/dropbox-login.html",
                //controller: 'Userctrl'
            }
        }
    }).state('app.singlePushNotification', {
        url: "/singlePushNotification",
        views: {
            'menuContent': {
                templateUrl: "templates/push-notification/single-push-notification/html/single-push-notification.html",
                controller: "singlePushNotificationCtrl"
            }
        }
    }).state('app.contacts', {
        url: '/users/:id/details/{type}/{repeat:[0-9]+}?from&to',
        data: {
            customData1: 5,
            color: "blue"
        },
        views: {
            'menuContent': {
                template: '<p style="background-color: white;top: 44px;">contactId : {{contactId}} </p>',
                reloadOnSearch: true,
                controller: function($state, $scope, contactId) {
                    $scope.contactId = contactId;
                    $scope.black = $state.current.data.color;
                    console.log(contactId, $state.current.data);
                },
                resolve: {
                    contactId: ['$stateParams', function($stateParams) {
                        return $stateParams;
                    }]
                },
                onEnter: function(contactId) {
                    if (contactId) {
                        console.log(contactId, "in on enter");
                    }
                },
                onExit: function(contactId) {
                    if (contactId) {
                        console.log(contactId, "in on exit");
                    }
                }
            }
        }
    }); // End $stateProvider
    $urlRouterProvider.otherwise(function($injector, $location) {
        var state = $injector.get('$state');
        if (window.localStorage['didTutorial'] === "false") {
            state.go('app.top_search');
        } else state.go('intro');
        return $location.path();
    });
});