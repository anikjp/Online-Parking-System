//Directive numbersOnly :
//Use for change input to have ability accept only number.
//Example : <input ng-model="contract.age" numbers-only type="tel">
//
appControllers.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}); // End Directive numbersOnly.
//Directive numbersOnly :
//Use for change input to have ability accept only number.
//Example : <input ng-model="contract.age" numbers-only type="tel">
//
appControllers.directive("shortcutViewDirective", function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<ng-include src="getTemplateUrl()"/>',
        scope: {
            marker: '= data'
        },
        controller: function($scope, $state, $mdBottomSheet, tomeretaConfig, $cordovaNetwork) {
            //function used on the ng-include to resolve the template
            console.log($scope.marker);
            $scope.getTemplateUrl = function() {
                //basic handling
                if ($scope.marker.parking_type == tomeretaConfig.parking_types.monthly) {
                    return 'templates/common/shortcut_parking_space_monthly_view.html';
                } else if ($scope.marker.parking_type == tomeretaConfig.parking_types.daily_monthly) {
                    if ($scope.marker.parking_slot == tomeretaConfig.parking_slot.full) {
                        return 'templates/common/shortcut_parking_space_normal_full_view.html';
                    } else {
                        return 'templates/common/shortcut_parking_space_normal_empty_view.html';
                    }
                } else if ($scope.marker.parking_type == tomeretaConfig.parking_types.daily) {
                    if ($scope.marker.parking_slot == tomeretaConfig.parking_slot.full) {
                        return 'templates/common/shortcut_parking_space_normal_full_view.html';
                    } else {
                        return 'templates/common/shortcut_parking_space_normal_empty_view.html';
                    }
                } else if ($scope.marker.parking_type == tomeretaConfig.parking_types.time_rental) {
                    if ($scope.marker.parking_slot == tomeretaConfig.parking_slot.full) {
                        return 'templates/common/shortcut_parking_space_normal_full_view.html';
                    } else {
                        return 'templates/common/shortcut_parking_space_normal_empty_view.html';
                    }
                } else if ($scope.marker.parking_type == tomeretaConfig.parking_types.airport) {
                    if ($scope.marker.parking_slot == tomeretaConfig.parking_slot.full) {
                        return 'templates/common/shortcut_parking_space_normal_full_view.html';
                    } else {
                        return 'templates/common/shortcut_parking_space_normal_empty_view.html';
                    }
                } else if ($scope.marker.coinparking) {
                    return 'templates/common/shortcut_coinpark_view.html';
                }
            };
            // navigateTo is for navigate to other page
            $scope.navigateTo = function(targetPage, parking) {
                //if (!$cordovaNetwork.isOffline()) {
                if (true) {
                    $mdBottomSheet.hide();
                    $state.go(targetPage, {
                        parking_space_id: parking.parking_space.parking_space_id,
                        parking_type: parking.parking_type,
                        parking_slot: parking.parking_slot
                    });
                } else {
                    $scope.networkStatus();
                }
            }; // End navigateTo.
            $scope.navigateTocoinpark = function(targetPage, targetdata) {
                if (!$cordovaNetwork.isOffline()) {
                    console.log(targetdata);
                    $mdBottomSheet.hide();
                    $state.go(targetPage, {
                        targetdata: targetdata
                    });
                } else {
                    $scope.networkStatus();
                }
            }; // End navigateTo.
            $scope.networkStatus = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'ネットワークエラー',
                    template: 'インターネット接続がオフラインになっているようです。',
                    buttons: [{
                        text: 'Settings'
                    }, {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            return true;
                        }
                    }]
                });
                confirmPopup.then(function(res) {
                    $scope.searchpanel = false;
                    if (res) {
                        $scope.networkStatus();
                    } else {
                        console.log('You are not sure');
                    }
                });
            };
        }
    };
});