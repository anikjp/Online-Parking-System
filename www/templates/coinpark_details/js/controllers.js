// Controller of Notes List Page.
// It will call NoteDB Services to present data to html view.
appControllers.controller('Coinpark_detailsCtrl', function (
  $scope,
  $state,
  $stateParams
  ) {

    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

       //var authorizationProcess = oauth1Client.authorize();

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;
        $scope.targetdata =  $stateParams.targetdata.coinparking;
        $scope.targetdata.map_image_url="http://maps.googleapis.com/maps/api/staticmap?center="+$scope.targetdata.latitude+","+$scope.targetdata.longitude+"&zoom=15&size=600x250&language=ja&markers=icon:https://OnlineParkingSystem.jp/icon/coinpark_icon.png%7C"+$scope.targetdata.latitude+","+$scope.targetdata.longitude+"&format=png&visual_refresh=true"
        if(ionic.Platform.isIOS()){
        $scope.targetdata.map_url='maps://?q=' + $scope.targetdata.latitude+","+$scope.targetdata.longitude;
        $scope.targetdata.map_url_target="_system";
        }
        else if(ionic.Platform.isAndroid()){
        $scope.targetdata.map_url='geo:' + $scope.targetdata.latitude+","+$scope.targetdata.longitude+"?q="+$scope.targetdata.latitude+","+$scope.targetdata.longitude;
        $scope.targetdata.map_url_target="_system";
        }
        console.log($scope.targetdata);
    };//End initialForm.
    
     // openGoogleMap is for open Google Map application.
    // Parameter :  
    // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openGoogleMap = function () {
         var targetDestinationLocation = $scope.targetdata.latitude+","+$scope.targetdata.longitude;
       if(ionic.Platform.isIOS()){
         window.open('http://maps.apple.com/maps?saddr=Current%20Location&daddr=' + targetDestinationLocation, '_system');
        }
        if(ionic.Platform.isAndroid()){
            window.open('geo:' + targetDestinationLocation, '_system','location=yes');
        }
    };// End openGoogleMap

    $scope.initialForm();
    
});// End of Notes List Page  Controller.