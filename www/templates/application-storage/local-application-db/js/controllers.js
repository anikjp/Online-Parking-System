// Controller of Notes List Page.
// It will call NoteDB Services to present data to html view.
appControllers.controller('noteListCtrl', function ($scope,$ionicModal,$mdToast,ionicDatePicker,oauth1Client,$rootScope,$mdBottomSheet,$stateParams, $timeout, NoteDB, $state,$mdDialog) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
 
    $scope.initialForm = function () {

       //var authorizationProcess = oauth1Client.authorize();
        //window.localStorage['didTutorial'] = "false";

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

 $ionicModal.fromTemplateUrl('filter-panel.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
        $scope.filter_model = modal;
        });

  $ionicModal.fromTemplateUrl('vehicle-type.html', {
        scope: $scope,
        animation: 'slide-in-up'
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

// Controller of Note Setting Page.
appControllers.controller('noteSettingCtrl', function ($scope, NoteDB,$state, $ionicViewSwitcher,$stateParams, $ionicHistory, $mdBottomSheet, $mdDialog, $mdToast) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.noteLenght is is the variable for get note count.
        $scope.noteLenght = NoteDB.count();
    };// End initialForm.

    // clearAllData is for remove all notes data.
    // Parameter :
    // $event(object) = position of control that user tap.
    $scope.clearAllData = function ($event) {

        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        //mdDialog.show use for show alert box for Confirm to remove all data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove all data?",
                    content: "All data will remove from local storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove all data.
            try {
                //To remove all notes data by calling NoteDB.clear() service.
                NoteDB.clear();
                $scope.initialForm();

                // Showing toast for remove data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "All data removed !"
                        }
                    }
                });
            }
            catch (e) {
                //Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });
            }
        }, function () {
            // For cancel button to remove all data.
        });
    }// End clearAllData.

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
        if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });

            //Next view animate will display in back direction
            $ionicViewSwitcher.nextDirection('back');

            $state.go(stateName, {
                isAnimated: objectData,
            });
        }
    }; // End of navigateTo.

    $scope.initialForm();
});// End of Notes Setting Page  Controller.

// Controller of Note Detail Page.
appControllers.controller('noteDetailCtrl', function ($scope, NoteDB,ionicDatePicker, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.actionDelete = $stateParams.actionDelete;

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
    };// End initialForm.

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            title: '',
            detail: '',
            createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.


    // validateRequiredField is for validate the required field.
    // Parameter :
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.

    // saveNote is for save note.
    // Parameter :
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data will save to Local Storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling  NoteDB.update($scope.note) service.
                if ($scope.actionDelete) {

                    if ($scope.note.id == null) {
                        $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
                    }
                    NoteDB.update($scope.note);
                } // End update data.

                // To add new data by calling NoteDB.insert(note) service.
                else {
                    NoteDB.insert(note);
                    $scope.noteList = NoteDB.selectAll();
                    $scope.actionDelete = true;
                }// End  add new  data.

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
            }
            catch (e) {
                // Showing toast for unable to save data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });// End showing toast.
            }

        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove from Local Storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                if ($scope.note.id == null) {
                    $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
                }
                NoteDB.delete(note);
                $ionicHistory.goBack();
            }// End remove note.
            catch (e) {
                // Showing toast for unable to remove data.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: window.globalVariable.message.errorMessage
                        }
                    }
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

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

    var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];
    var monthList = ["January", "February", "March", "April", "Мay", "June", "July", "Аugust", "Septembar", "Octobar", "November", "December"];

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
      header: 'Please select Your date',
      headerClass: 'dark-bg light',

      btnsIsNative: true,

      btnOk: 'OK',
      btnOkClass: 'button-clear cal-btn-ok',

      btnTodayShow: true,
      btnToday: 'Today',
      btnTodayClass: 'button-clear button-dark cal-btn-today',

      btnCancel: 'Close',
      btnCancelClass: 'button-clear button-dark cal-btn-close',

      btnClearShow: true,
      btnClear: 'Clear',
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
        //console.log($scope.selectedDates);
      }
    };




    $scope.initialForm();
});// End of Notes Detail Page  Controller.
