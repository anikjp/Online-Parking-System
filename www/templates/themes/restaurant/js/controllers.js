// Controller of Notes List Page.
// It will call NoteDB Services to present data to html view.
appControllers.controller('restaurantCtrl', function ($scope,$ionicModal,$mdToast,ionicDatePicker,oauth1Client,$rootScope,$mdBottomSheet,$stateParams, $timeout, NoteDB, $state,$mdDialog) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

       //var authorizationProcess = oauth1Client.authorize();


        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];

        // $scope.filterText is the variable that use for searching.
        $scope.filterText = "";

        // The function for loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#note-list-loading-progress').show();
            }
            else {
                jQuery('#note-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all notes from NoteDB service.
            $scope.noteList = NoteDB.selectAll();

            jQuery('#note-list-loading-progress').hide();
            jQuery('#note-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

       

    };//End initialForm.

  $ionicModal.fromTemplateUrl('vehicle-type.html', {
        scope: $scope,
        animation: 'slide-in-right'
        }).then(function(modal) {
        $scope.vehicle_type_model = modal;
        });       
    // navigateTo is for navigate to other page
    // by using targetPage to be the destination page
    // and sending objectData to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        console.log(targetPage);
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true)
        });
    };// End navigateTo.


// navigateTo is for navigate to other page
    // by using targetPage to be the destination page
    // and sending objectData to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.filter = function () {
         $scope.filter_model.show();
    };// End navigateTo.

 $scope.closeModal = function() {
    $scope.filter_model.hide();
  };

    $scope.show_vehicle_type_model = function () {
         $scope.vehicle_type_model.show();
    };// End navigateTo.

 $scope.close_vehicle_type_model = function() {
    $scope.vehicle_type_model.hide();
  };



    $scope.godetails = function (event) {
      console.log(event);
  console.log("clicked");
  $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
          displayOption: {
              title: "Hello!!!!!!!!!!!!!",
              content: "This is confirm dialog content.",
              ok: "Confirm",
              cancel: "Close"
          }
      }
  }).then(function () {
      $scope.dialogResult = "You choose Confirm!"
  }, function () {
      $scope.dialogResult = "You choose Close !!"
  });
    };// End getUserProfile.
    $scope.dragEnd = function (event) {

  console.log("Get new position ",this.getCenter().lat(),this.getCenter().lng());
  }



  $rootScope.mouseover = function() {
            this.style.backgroundColor = 'grey';
          };

          $rootScope.mouseout = function() {
            this.style.backgroundColor = 'white';
          };

          $rootScope.click = function($event,cm) {
              console.log($event);
            $scope.data=cm;
            // For show show List Bottom Sheet.
                $mdBottomSheet.show({
                    templateUrl: 'item-short-details',
                    targetEvent: $event,
                    locals: {
                    theScope: $scope
                  },
                    scope: $scope.$new(),
                });
          };

          $rootScope.customMarkers = [
            {position: "35.6685, 139.7117", "class": "my1","price": "1000","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6575, 139.756817",  "class": "my2","price": "2500","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6655, 139.7363",  "class": "my1","price": "1800","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6575, 139.769635712760623",  "class": "my2","price": "2000","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6655, 139.7635712760623",  "class": "my1","price": "1500","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6675, 139.76927",  "class": "my2","price": "100","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6675, 139.7669635712760623",  "class": "my1","price": "100","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6655, 139.767533",  "class": "my1","price": "5000","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6445, 139.746927",  "class": "my2","price": "1111","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6655, 139.70827",  "class": "my1","price": "4444","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6655, 139.74635712760623",  "class": "my2","price": "666","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
            {position: "35.6655, 139.736827",  "class": "my2","price": "888","name":"麻布中央マンション駐車場01","address":"東京都港区麻布台1-4-7 麻布中央マンション"},
          ];



          $scope.GoBack = function ($event, noteForm) {
        $ionicHistory.goBack();
    };// End showing the bottom sheet.



    var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'modal'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

    var weekDaysList = ["日", "月", "火", "水", "木", "金", "土"];
    var monthList = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

    var h0 = new Date(2015, 11, 11)
      , h1 = new Date(2015, 11, 9)
      , h2 = new Date(2015, 11, 3)
      , h3 = new Date(2015, 11, 10)
      , h4 = new Date(2015, 10, 30)
      , h5 = new Date(2015, 11, 16)
      , h6 = new Date(2015, 11, 6)
      , calendar0 = [h0, h1, h2, h3, h4, h5, h6];

    var c0 = new Date(2015, 11, 11)
      , c1 = new Date(2015, 11, 9)
      , c2 = new Date(2015, 12, 3)
      , c3 = new Date(2015, 11, 10)
      , c4 = new Date(2015, 11, 12)
      , c5 = new Date(2015, 11, 16)
      , c6 = new Date(2015, 11, 18)
      , c7 = new Date(2015, 11, 19)
      , c8 = new Date(2015, 11, 22)
      , c9 = new Date(2015, 11, 27)
      , c10 = new Date(2015, 11, 25)
      , c11 = new Date(2015, 11, 6)
      , calendar1 = [c0, c1]
      , calendar2 = [c2, c3]
      , calendar3 = [c4]
      , calendar4 = [c2, c5, c11]
      , calendar5 = [c4, c10]
      , calendar6 = [c6, c7, c8, c9]
      , calendar7 = [c5, c6, c11];

    var d0 = new Date(2015, 11, 16)
      , d1 = new Date(2015, 11, 17)
      , d2 = new Date(2015, 11, 17)
      , d3 = new Date(2015, 10, 30)
      , d4 = new Date(2015, 12, 1)
      , disabledDates = [d0, d1, d2, d3, d4];

    var s0 = new Date(2015, 10, 31)  // preview month
      , s1 = new Date(2015, 11, 10) // holiday
      , s2 = new Date(2015, 11, 11) // holiday
      , s7 = new Date(2015, 11, 6) //
      , s3 = new Date(2015, 11, 12) //
      , s4 = new Date(2015, 11, 12) // clone
      , s5 = new Date(2015, 11, 17) // conflict with disabled
      , s6 = new Date(2015, 12, 1); // conflict with disabled, next month
    $scope.selectedDates = [s1, s2, s3, s4, s0, s5, s6, s7];

    $scope.datepickerObject = {
      templateType: 'MODAL', // POPUP | MODAL
      modalFooterClass: 'bar-light',
      header: '利用日を選択してください',
      headerClass: 'dark-bg light',

      btnsIsNative: true,

      btnOk: 'OK',
      btnOkClass: 'button-clear cal-btn-ok',

      btnTodayShow: true,
      btnToday: '今日',
      btnTodayClass: 'button-clear button-dark cal-btn-today',

      btnCancel: '閉じる',
      btnCancelClass: 'button-clear button-dark cal-btn-close',

      btnClearShow: true,
      btnClear: 'クリア',
      btnClearClass: 'button-clear button-dark cal-btn-clr',

      selectType: 'MULTI', // SINGLE | PERIOD | MULTI

      tglSelectByWeekShow: true, // true | false (default)
      tglSelectByWeek: 'By week',
      isSelectByWeek: false, // true (default) | false
      selectByWeekMode: 'NORMAL', // INVERSION (default), NORMAL
      tglSelectByWeekClass: 'toggle-positive',
      titleSelectByWeekClass: 'positive positive-border',

      accessType: 'WRITE', // READ | WRITE
      //showErrors: true, // true (default), false
      //errorLanguage: 'RU', // EN | RU

      fromDate: new Date(2015, 9),
      toDate: new Date(2016, 1),

      selectedDates: $scope.selectedDates,
      viewMonth: $scope.selectedDates, //
      disabledDates: disabledDates,

      calendar0: calendar0,
      calendar0Class: '',
      calendar0Name: 'holidays',

      calendar1: calendar1,
      //calendar1Class: '',
      calendar1Name: 'same days',

      calendar2: calendar2,
      calendar2Class: '',
      //calendar2Name: 'calendar 2',

      calendar3: calendar3,
      calendar3Class: '',
      calendar3Name: 'birthdays',

      calendar4: calendar4,
      calendar4Class: 'cal-color-black',
      calendar4Name: 'date-picker',

      calendar5: calendar5,
      calendar5Class: '',
      calendar5Name: 'vacation',

      calendar6: calendar6,
      calendar6Class: '',
      calendar6Name: 'red days',

      calendar7: calendar7,
      calendar7Class: '',
      calendar7Name: 'same dates',

      conflictSelectedDisabled: 'SELECTED', // SELECTED | DISABLED

      closeOnSelect: false,

      mondayFirst: true,
      weekDaysList: weekDaysList,
      monthList: monthList,

      callback: function (dates) {  //Mandatory
        retSelectedDates(dates);
      }
    };

    var retSelectedDates = function (dates) {
      $scope.selectedDates.length = 0;
      for (var i = 0; i < dates.length; i++) {
        $scope.selectedDates.push(angular.copy(dates[i]));
        console.log($scope.selectedDates);
      }
    };

    
    $scope.initialForm();
});// End of Notes List Page  Controller.