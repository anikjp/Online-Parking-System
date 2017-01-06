// Controller of Notes List Page.
// It will call NoteDB Services to present data to html view.
appControllers.controller('Top_searchCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $timeout, $state, $mdDialog, $ionicModal, $mdToast, ionicDatePicker, $ionicHistory, $mdBottomSheet, NoteDB, SerachService, $cordovaGeolocation, NgMap, tomeretaConfig, $cordovaNetwork, ConnectivityMonitor) {
            // initialForm is the first activity in the controller.
            // It will initial all variable data and let the function works when page load.
            $scope.initialForm = function() {
                $scope.isLoading = true;
                $scope.isAnimated = $stateParams.isAnimated;
                // $scope.filterText is the variable that use for searching.
                $scope.filterText = "";
                //serach object
                $scope.search = {
                    range: 10,
                    vacancy_invisible: false,
                    time_rental_invisible: false,
                    monthly_invisible: true,
                    coinpark_invisible: true,
                    vehicle_item: [{
                        text: "バイク",
                        value: "1",
                        active: "activated"
                    }, {
                        text: "車",
                        value: "2",
                        active: ""
                    }],
                    keyword: "",
                    searchdate: new Date()
                };
                $scope.parking_spaces = [];
                $scope.recentmap = {
                    lat: "",
                    lng: ""
                };
                $scope.previouspos = {
                    lat: "",
                    lng: ""
                }
                $scope.currentgeo = null;
                $scope.coinparks = [];
                $scope.airport_empty = [];
                $scope.airport_full = [];
                $scope.daily_full = [];
                $scope.daily_empty = [];
                $scope.monthly = [];
                $scope.daily_monthly_full = [];
                $scope.daily_monthly_empty = [];
                $scope.time_rental_full = [];
                $scope.time_rental_empty = [];
                $scope.searchpanel = false;
                $scope.searchdate = new Date();
                $scope.vehicle_types = [];
                $scope.selected = [2, 3, 4, 5, 6, 7];
                $scope.data = {};
                $scope.data.cb1 = true;
                $scope.data.cb2 = true;
                $scope.data.cb3 = true;
                $scope.data.cb4 = true;
                $scope.data.cb5 = true;
                $scope.data.cb6 = true;
                //$scope.isOffline = $cordovaNetwork.isOffline();
                $scope.isOffline = false;
                if ($scope.isOffline) $scope.networkStatus();
            }; //End initialForm.
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
            $scope.toggle = function(item) {
                var idx = $scope.selected.indexOf(item);
                if (idx > -1) {
                    $scope.selected.splice(idx, 1);
                } else {
                    $scope.selected.push(item);
                }
            };
            $scope.exists = function(item) {
                return $scope.selected.indexOf(item) > -1;
            };
            $scope.check = function(item) {
                console.log("----", item);
                array3 = []
                angular.forEach(item, function(value, index) {
                    angular.forEach($scope.selected, function(object, index1) {
                        console.log("item", value, object);
                        if (value == object) {
                            array3.push(object)
                            console.log("matched", value);
                        } else {
                            console.log("not matched ", item);
                        }
                    })
                })
                console.log("array3", array3);
            };
            $scope.btnactivated = function(btn) {
                if (btn.value == "1") {
                    $scope.search.vehicle_item = [{
                        text: "バイク",
                        value: "1",
                        active: "activated"
                    }, {
                        text: "車",
                        value: "2",
                        active: ""
                    }];
                } else {
                    $scope.search.vehicle_item = [{
                        text: "バイク",
                        value: "1",
                        active: ""
                    }, {
                        text: "車",
                        value: "2",
                        active: "activated"
                    }];
                }
            }
            $scope.clear = function() {
                    $scope.search = {
                        range: 10,
                        vacancy_invisible: false,
                        time_rental_invisible: false,
                        monthly_invisible: true,
                        coinpark_invisible: true,
                        vehicle_item: [{
                            text: "バイク",
                            value: "1",
                            active: "activated"
                        }, {
                            text: "車",
                            value: "2",
                            active: ""
                        }],
                        keyword: "",
                        searchdate: new Date()
                    };
                }
                //Filter model
            $ionicModal.fromTemplateUrl('templates/common/filter-panel.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.filter_model = modal;
            });
            //open Filter model
            $scope.filter = function() {
                $scope.filter_model.show();
            }; // End Filter model
            //close Filter model
            $scope.closeModal = function() {
                $scope.filter_model.hide();
            };
            //vehicle model
            $ionicModal.fromTemplateUrl('templates/common/vehicle-type.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function(modal) {
                $scope.vehicle_type_model = modal;
            });
            //open Filter model      
            $scope.show_vehicle_type_model = function() {
                $scope.vehicle_type_model.show();
            }; // End navigateTo.
            //close Filter model
            $scope.close_vehicle_type_model = function() {
                $scope.vehicle_type_model.hide();
            };
            //changing range value 
            $scope.changeRange = function(rangeValue) {
                    console.log('range value has changed to :' + rangeValue);
                    $scope.search.range = rangeValue;
                }
                // after dragEnd method is called from map
            $scope.dragEnd = function(event) {
                    //if (!$cordovaNetwork.isOffline()) {
                    if (true) {
                        $scope.recentmap.lat = this.getCenter().lat();
                        $scope.recentmap.lng = this.getCenter().lng();
                        console.log("new position ", this.getCenter().lat(), this.getCenter().lng(), "Previous position ", $scope.previouspos.lat, $scope.previouspos.lng);
                        SerachService.distance_calculation(this.getCenter().lat(), this.getCenter().lng(), $scope.previouspos.lat, $scope.previouspos.lng).then(function(data) {
                            console.log(data, $scope.search.range);
                            if (data > ($scope.search.range - 1)) {
                                //if (true) {
                                $scope.getparkingdata($scope.recentmap.lat, $scope.recentmap.lng);
                                $scope.previouspos.lat = $scope.recentmap.lat;
                                $scope.previouspos.lng = $scope.recentmap.lng;
                            }
                        });
                    } else {
                        $scope.networkStatus();
                    }
                }
                // after dragEnd method is called from map
            $scope.refreshcenter = function(event) {
                    //if (!$cordovaNetwork.isOffline()) {
                    if (true) {
                        NgMap.getMap().then(function(map) {
                            map.setCenter({
                                lat: $scope.currentgeo.latitude,
                                lng: $scope.currentgeo.longitude
                            });
                        });
                        $scope.previouspos.lat = $scope.currentgeo.latitude;
                        $scope.previouspos.lng = $scope.currentgeo.longitude;
                        $scope.getparkingdata($scope.currentgeo.latitude, $scope.currentgeo.longitude);
                    } else {
                        $scope.networkStatus();
                    }
                }
                // quickview model from selected marker from map
            $scope.quickview = function($event, cm) {
                $scope.seleted_position = cm;
                // For show show List Bottom Sheet.
                $mdBottomSheet.show({
                    templateUrl: 'item-short-details',
                    //controller: 'Parking_detailsCtrl',
                    targetEvent: $event,
                    scope: $scope.$new(false),
                });
            };
            $scope.showCondition = function(item) {
                console.log(item);
                return true;
            }; // End showing the bottom sheet.
            // recent_geoPosition
            SerachService.get_recent_geoPosition().then(function(data) {
                $scope.currentgeo = data;
                $scope.currentgeo.latitude = data["latitude"];
                $scope.currentgeo.longitude = data["longitude"];
                $scope.recentmap.lat = data["latitude"];
                $scope.recentmap.lng = data["longitude"];
                $scope.previouspos.lat = $scope.recentmap.lat;
                $scope.previouspos.lng = $scope.recentmap.lng;
                if (data["status"] != false) {
                    $scope.getparkingdata(data["latitude"], data["longitude"]);
                } else {
                    $ionicPopup.alert({
                        title: '注意',
                        template: '現在位置を見つけることができませんでした。<br/>現在位置は東京タワーに設定を行います。'
                    });
                    $scope.getparkingdata(data["latitude"], data["longitude"]);
                }
            });
            // Call to server for filtered data search
            $scope.getparkingdata = function(lat, lon) {
                //if (!$cordovaNetwork.isOffline()) {
                if (true) {
                    $scope.isLoading = true;
                    SerachService.get_recent_parking_data(lat, lon, $scope.search).then(function(data) {
                        if (data.length == 0) {
                            $scope.paging.shouldLoadData = true;
                        } else {
                            $scope.coinparks = data.coinparks;
                            $scope.airport_empty = data.airport_empty;
                            $scope.airport_full = data.airport_full;
                            $scope.daily_full = data.daily_full;
                            $scope.daily_empty = data.daily_empty;
                            $scope.monthly = data.monthly;
                            $scope.daily_monthly_full = data.daily_monthly_full;
                            $scope.daily_monthly_empty = data.daily_monthly_empty;
                            $scope.time_rental_full = data.time_rental_full;
                            $scope.time_rental_empty = data.time_rental_empty;
                            $scope.isLoading = false;
                        }
                    });
                } else {
                    $scope.networkStatus();
                }
            };
            // Call to server for filtered data search
            $scope.goSerach = function(search) {
                //if (!$cordovaNetwork.isOffline()) {
                if (true) {
                    $scope.isLoading = true;
                    console.log(search);
                    var reg = "/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/";
                    if (search.keyword != "" && (!reg.match(search.keyword))) {
                            SerachService.get_addtoGEO(search.keyword).then(function(result) {
                                if (result.status == "OK") {
                                    if (!result.results) {
                                        $ionicPopup.alert({
                                            title: '注意',
                                            template: '該当なる住所が見つかりませんでした。'
                                        });
                                    } else if (result.results[0].partial_match) {
                                        $ionicPopup.alert({
                                            title: '注意',
                                            template: '正しい住所を書いてください。'
                                        });
                                    } else {
                                        SerachService.get_recent_parking_data(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng, $scope.search).then(function(data) {
                                          　console.log(data);  
                                            if (data.length == 0) {
                                                $scope.paging.shouldLoadData = true;
                                            } else {
                                                $scope.recentmap.lat = result.results[0].geometry.location.lat;
                                                $scope.recentmap.lng = result.results[0].geometry.location.lng;
                                                $scope.previouspos.lat = $scope.recentmap.lat;
                                                $scope.previouspos.lng = $scope.recentmap.lng;
                                                $scope.coinparks = data.coinparks;
                                                $scope.airport_empty = data.airport_empty;
                                                $scope.airport_full = data.airport_full;
                                                $scope.daily_full = data.daily_full;
                                                $scope.daily_empty = data.daily_empty;
                                                $scope.monthly = data.monthly;
                                                $scope.daily_monthly_full = data.daily_monthly_full;
                                                $scope.daily_monthly_empty = data.daily_monthly_empty;
                                                $scope.time_rental_full = data.time_rental_full;
                                                $scope.time_rental_empty = data.time_rental_empty;
                                                $scope.isLoading = false;
                                            }
                                        });
                                    }
                                } else {
                                    $ionicPopup.alert({
                                        title: '注意',
                                        template: '該当なる住所が見つかりませんでした。'
                                    });
                                }
                            });
                        } else {
                            SerachService.get_recent_parking_data($scope.recentmap.lat, $scope.recentmap.lng, $scope.search).then(function(data) {
                                if (data.length == 0) {
                                    $scope.paging.shouldLoadData = true;
                                } else {
                                    $scope.coinparks = data.coinparks;
                                    $scope.airport_empty = data.airport_empty;
                                    $scope.airport_full = data.airport_full;
                                    $scope.daily_full = data.daily_full;
                                    $scope.daily_empty = data.daily_empty;
                                    $scope.monthly = data.monthly;
                                    $scope.daily_monthly_full = data.daily_monthly_full;
                                    $scope.daily_monthly_empty = data.daily_monthly_empty;
                                    $scope.time_rental_full = data.time_rental_full;
                                    $scope.time_rental_empty = data.time_rental_empty;
                                    $scope.isLoading = false;
                                }
                            });
                        }
                        $scope.searchpanel = true; $scope.filter_model.hide();
                    }
                    else {
                        $scope.networkStatus();
                    }
                };
                $scope.initialForm();
            }); // End of Notes List Page  Controller.