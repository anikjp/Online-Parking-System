//This is Controller for Dialog box.
appControllers.controller('FavariteListController', function($scope, FavlistDBServices, $ionicHistory, $state, $timeout) {
    var count = FavlistDBServices.count();
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.favarite_list = [];
    if (count > 0) {
        $scope.favarite_list = FavlistDBServices.selectAll();
    }
    $scope.navigateTo2 = function(objectData) {
        event.preventDefault();
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: false
        });
        var url = "";
        if (objectData.parking_custom_type == 1) {
            url = "app.parking_details_monthly";
        } else {
            url = "app.parking_details";
        }
        $state.go(url, {
            parking_space_id: objectData.parking_space_id,
            parking_type: objectData.parking_custom_type,
            parking_slot: null
        });
    }; // End navigateTo.
    $scope.remove = function(data) {
       $scope.favarite_list= FavlistDBServices.delete(data);
        console.log("aaaa", $scope.favarite_list);

    }; // End navigateTo.
}); // End Controller for Dialog box.