//This is Controller for Dialog box.
appControllers.controller('HistoryListController', function($scope, $state, $ionicHistory, $timeout, HistoryDBServices) {
    var count = HistoryDBServices.count();
    $scope.isIOS = ionic.Platform.isIOS();
    $scope.history_list = [];
    if (count > 0) {
        $scope.history_list = HistoryDBServices.selectAll();
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

       $scope.history_list= HistoryDBServices.delete(data);
        console.log("aaaa", $scope.history_list);

    }; // End navigateTo.
}); // End Controller for Dialog box.