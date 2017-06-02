// Controller of Notes List Page.
// It will call NoteDB Services to present data to html view.
appControllers.controller('Parking_detailsCtrl', function($scope, $ionicModal,$ionicPopup, $mdToast, ionicDatePicker, $rootScope, $mdBottomSheet, $stateParams, $timeout, NoteDB, $state, $mdDialog, SerachService, OnlineParkingSystemConfig, FavlistDBServices, HistoryDBServices) {
    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function() {
        //var authorizationProcess = oauth1Client.authorize();
        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;
        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated = $stateParams.isAnimated;
        $scope.parking_space_id = $stateParams.parking_space_id;
        $scope.parking_type = $stateParams.parking_type;
        $scope.parking_slot = $stateParams.parking_slot;
        //console.log($stateParams);
        $scope.parking_details($stateParams.parking_space_id);
        $scope.parking_data = [];
        $scope.imagelist = [];
        $scope.issave = FavlistDBServices.get($scope.parking_space_id);
        $scope.ishistory = false;
        $scope.calender = null;
        $scope.selected_date = [];
        $scope.today = new Date();
        $scope.selected = {
            type: null,
            date: null
        };
    }; //End initialForm.

    $scope.toggle = function(item, date) {
        var idx = $scope.selected_date.indexOf(date);
        if (idx > -1) {
            $scope.selected_date.splice(idx, 1);
        } else {
            $scope.selected_date.push(date);
        }
        return true;
    };
 /*
  $scope.exists = function (item, date) {
     console.log($scope.selected_date);
     console.log(($scope.selected_date.indexOf(date) > -1));
     console.log(item,$scope.selected_date.indexOf(date));
   // return $scope.selected_date.indexOf(item) > -1;
    return true;
  };

  /*
    $scope.toggle = function(item, date) {
        var idx = $scope.selected_date.indexOf(date);
        if (idx > -1) {
            $scope.selected_date.splice(idx, 1);
        } else {
            $scope.selected_date.push(date);
        }
        return true;
    };
    */
    $scope.parking_details = function(parking_space_id) {
        SerachService.get_parking_details(parking_space_id).then(function(data) {
            $scope.parking_data = data.results[0];
            $scope.parking_data.parking_custom_type = $scope.parking_type;
            $scope.ishistory = HistoryDBServices.get($scope.parking_data.parking_space_id);
            if (!$scope.ishistory) {
                $scope.insertHistoryList();
            }
            for (var i = 0; i < $scope.parking_data.parkingPicture.length; i++) {
                var data = {
                    url: $scope.parking_data.parkingPicture[i],
                    name: '駐車場及び周辺写真'
                }
                $scope.imagelist.push(data);
            }
            if ($scope.parking_data.parkinLayout) {
                $scope.imagelist.push({
                    url: $scope.parking_data.parkinLayout,
                    name: '車室図'
                });
            }
            var img = "https://OnlineParkingSystem.jp/icon/bluepin.png";
            $scope.parking_data.map_image_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + $scope.parking_data.lat + "," + $scope.parking_data.lng + "&zoom=15&size=600x250&language=ja&markers=icon:" + img + "%7C" + $scope.parking_data.lat + "," + $scope.parking_data.lng + "&format=png&visual_refresh=true"
            if (ionic.Platform.isIOS()) {
                $scope.parking_data.map_url = 'maps://?q=' + $scope.parking_data.lat + "," + $scope.parking_data.monthly_price.lng;
                $scope.parking_data.map_url_target = "_system";
            } else if (ionic.Platform.isAndroid()) {
                $scope.parking_data.map_url = 'geo:' + $scope.parking_data.lat + "," + $scope.parking_data.lng + "?q=" + $scope.parking_data.lat + "," + $scope.parking_data.lng;
                $scope.parking_data.map_url_target = "_system";
            }
            console.log($scope.parking_data);
        });
    };
    // By calling ContractDB.all() service.
    $scope.insertfavlist = function() {
        if (!$scope.issave) {
            FavlistDBServices.insert($scope.parking_data);
            $scope.fav = FavlistDBServices.selectAll();
            $scope.issave = true;
            console.log("Data is saved in favarite list", $scope.fav);
        }
    }; //End getContractList.
    // By calling ContractDB.all() service.
    $scope.insertHistoryList = function() {
            HistoryDBServices.insert($scope.parking_data);
            $scope.his = HistoryDBServices.selectAll();
            console.log("Data is saved in History list", $scope.his);
        }
        // openGoogleMap is for open Google Map application.
        // Parameter :  
        // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openGoogleMap = function() {
        var targetDestinationLocation = $scope.parking_data.lat + "," + $scope.parking_data.lng;
        if (ionic.Platform.isIOS()) {
            window.open('http://maps.apple.com/maps?saddr=Current%20Location&daddr=' + targetDestinationLocation, '_system');
        }
        if (ionic.Platform.isAndroid()) {
            window.open('geo:' + targetDestinationLocation, '_system', 'location=yes');
        }
    }; // End openGoogleMap
    // navigateTo is for navigate to other page
    // by using targetPage to be the destination page
    // and sending objectData to the destination page.
    // Parameter :
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function(targetPage, objectData) {
        console.log(targetPage);
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true)
        });
    }; // End navigateTo.
    //vehicle model
    $ionicModal.fromTemplateUrl('templates/common/select-vehicle-type.html', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.vehicle_type_model = modal;
    });
    $scope.show_vehicle_type_model = function() {
        $scope.vehicle_type_model.show();
    }; // End navigateTo.
    $scope.close_vehicle_type_model = function() {
        $scope.vehicle_type_model.hide();
    };
    $scope.change_vehicle_type_model = function(type) {
        if ($scope.selected.type != type) {
           // $scope.selected_date = [];
        }
        $scope.vehicle_type_model.hide();
    };
    //vehicle model
    $ionicModal.fromTemplateUrl('templates/common/calender-view.html', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.calender_view_model = modal;
    });
    $scope.show_calender_view_model = function() {
        $scope.calender = $scope.parking_data.vehicle_space_details[$scope.selected.type]['reserved'];
        $scope.calender_view_model.show();
    }; // End navigateTo.
    $scope.close_calender_view_model = function() {
        $scope.calender_view_model.hide();
    };
    $scope.getdate = function(count) {
        var todayDate = new Date();
        $scope.today = new Date().setDate(todayDate.getDate() + count);
    }; // End navigateTo.
    $scope.initialForm();

    // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '予約最終確認',
     template: '予約させてよろしいでしょうか?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };

}); // End of Notes List Page  Controller.