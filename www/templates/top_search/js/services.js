appServices.service('SerachService', function($rootScope, $http, $q, $filter, $cordovaGeolocation, tomeretaConfig, $base64) {
    //****************
    //Acquisition parking data from server
    //lat - latitude
    //lng - longitude
    //search - Serach Keyword
    //****************
    this.get_recent_parking_data = function(lat, lng, search) {
        range = search.range * 1000;
        var searchtext = "lat=" + lat + "&lng=" + lng + "&radius=" + range;
        if (search.keyword && search.keyword != "") {
            searchtext = searchtext + "&address=" + search.keyword;
        }
        if (search.searchdate) {
            var date = "";
            date = date + $filter('date')(search.searchdate, "yyyyMMdd");
            searchtext = searchtext + "&use=" + date;
        }
        var results = {
            coinparks: [],
            monthly: [],
            daily_full: [],
            daily_empty: [],
            daily_monthly_full: [],
            daily_monthly_empty: [],
            airport_full: [],
            airport_empty: [],
            time_rental_full: [],
            time_rental_empty: []
        };
        var deferred = $q.defer();
        $http.get("http://www.onixoni.com/test.php?type=1&" + searchtext).success(function(data) {
            console.log(data);
            var track = 0;
            var sp_flag = 0;
            if ('coinparks' in data.result) {
                results.coinparks = data.result.coinparks;
            }
            if ('parking_spaces' in data.result) {
                for (var index = 0; index < data.result.parking_spaces.length; index++) {
                    if (sp_flag == 0) {
                        if (!data.result.parking_spaces[index].vehicles_type.length) {
                            data.result.parking_spaces[index].vehicles_possible_type = "";
                        } else {
                            data.result.parking_spaces[index].vehicles_possible_type = data.result.parking_spaces[index].vehicles_type[0]['possible_type'];
                        }
                        if (data.result.parking_spaces[index].parking_space.monthly == true && data.result.parking_spaces[index].parking_space.tomereta == false) {
                            //Monthly parking
                            data.result.parking_spaces[index].parking_type = tomeretaConfig.parking_types.monthly;
                            data.result.parking_spaces[index].img = "img/icons/monthly.png";
                            results.monthly.push(data.result.parking_spaces[index]);
                        } else if (data.result.parking_spaces[index].parking_space.monthly == false && data.result.parking_spaces[index].parking_space.tomereta == true) {
                            //Daily parking
                            data.result.parking_spaces[index].parking_type = tomeretaConfig.parking_types.daily;
                            if (data.result.parking_spaces[index].parking_space.remaining == 0) {
                                //Full Parking
                                data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.full;
                                data.result.parking_spaces[index].img = "img/icons/normal_gray.png";
                                results.daily_full.push(data.result.parking_spaces[index]);
                            } else {
                                //Empty Parking
                                data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.empty;
                                data.result.parking_spaces[index].img = "img/icons/normal_blue.png";
                                results.daily_empty.push(data.result.parking_spaces[index]);
                            }
                        } else if (data.result.parking_spaces[index].parking_space.monthly == true && data.result.parking_spaces[index].parking_space.tomereta == true) {
                            //Daily Monthly parking
                            data.result.parking_spaces[index].parking_type = tomeretaConfig.parking_types.daily_monthly;
                            if (data.result.parking_spaces[index].parking_space.remaining == 0) {
                                //Full Parking
                                data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.full;
                                data.result.parking_spaces[index].img = "img/icons/normal_gray.png";
                                results.daily_monthly_full.push(data.result.parking_spaces[index]);
                            } else {
                                //Empty Parking
                                data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.empty;
                                data.result.parking_spaces[index].img = "img/icons/normal_blue.png";
                                results.daily_monthly_empty.push(data.result.parking_spaces[index]);
                            }
                        }
                    } else if (sp_flag == 1) {
                        //airport parking
                        data.result.parking_spaces[index].parking_type = tomeretaConfig.parking_types.airport;
                        if (data.result.parking_spaces[index].parking_space.remaining == 0) {
                            //Full Parking
                            data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.full;
                            data.result.parking_spaces[index].img = "img/icons/normal_gray.png";
                            results.airport_full.push(data.result.parking_spaces[index]);
                        } else {
                            //Empty Parking
                            data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.empty;
                            data.result.parking_spaces[index].img = "img/icons/normal_blue.png";
                            results.airport_empty.push(data.result.parking_spaces[index]);
                        }
                    } else if (sp_flag == 2) {
                        //Time rental parking
                        data.result.parking_spaces[index].parking_type = tomeretaConfig.parking_types.time_rental;
                        if (data.result.parking_spaces[index].parking_space.remaining == 0) {
                            //Full Parking
                            data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.full;
                            data.result.parking_spaces[index].img = "img/icons/dsp_red.png";
                            results.time_rental_full.push(data.result.parking_spaces[index]);
                        } else {
                            //Empty Parking
                            data.result.parking_spaces[index].parking_slot = tomeretaConfig.parking_slot.empty;
                            data.result.parking_spaces[index].img = "img/icons/dsp_gray.png";
                            results.time_rental_empty.push(data.result.parking_spaces[index]);
                        }
                    }
                    track++;
                }
            }
            if ('parking_spaces' in data.result) {
                if (track == data.result.parking_spaces.length) {
                    deferred.resolve(results);
                }
            } else {
                deferred.resolve(results);
            }
        }).error(function(data, status, headers, config) {
            console.log(headers, config);
            deferred.reject(data);
        });
        return deferred.promise;
    };
    //****************
    //Acquisition parking data from server
    //lat - latitude
    //lng - longitude
    //search - Serach Keyword
    //****************
    this.distance_calculation = function($lat1, $lon1, $lat2, $lon2) {
            var deferred = $q.defer();
            $R = 6371; // km
            $dLat = this.toRad($lat2 - $lat1);
            $dLon = this.toRad($lon2 - $lon1);
            $lat1 = this.toRad($lat1);
            $lat2 = this.toRad($lat2);
            $a = Math.sin($dLat / 2) * Math.sin($dLat / 2) + Math.sin($dLon / 2) * Math.sin($dLon / 2) * Math.cos($lat1) * Math.cos($lat2);
            $c = 2 * Math.atan2(Math.sqrt($a), Math.sqrt(1 - $a));
            $d = $R * $c;
            if ($d) deferred.resolve($d);
            else deferred.reject($d);
            return deferred.promise;
        }
        // Converts numeric degrees to radians
    this.toRad = function($Value) {
            return $Value * Math.PI / 180;
        }
        //****************
        //Acquisition parking data from server
        //lat - latitude
        //lng - longitude
        //search - Serach Keyword
        //****************
    this.get_parking_details = function(parking_id) {
        var deferred = $q.defer();
        $http.get("http://www.onixoni.com/test.php?type=2&parkingId=" + parking_id).success(function(data) {
            deferred.resolve(data);
        }).error(function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    //****************
    //Acquisition parking data from server
    //lat - latitude
    //lng - longitude
    //search - Serach Keyword
    //****************
    this.get_recent_geoPosition = function() {
        var deferred = $q.defer();
        var geoSettings = {
            frequency: 30000,
            timeout: 1000,
            enableHighAccuracy: false
        };
        var response = [];
        var geo = $cordovaGeolocation.getCurrentPosition(geoSettings);
        geo.then(function(position) {
            console.log("Current position :", position);
            response["status"] = true;
            response["latitude"] = position.coords.latitude;
            response["longitude"] = position.coords.longitude
            deferred.resolve(response);
        }, function error(err) {
            response["status"] = false;
            response["error"] = err;
            //tokyo tower
            response["latitude"] = 35.6585810;
            response["longitude"] = 139.7454330;
            deferred.resolve(response);
            /*
            $http({
                method: "GET",
                url: "http://ipinfo.io/"
            }).then(function mySucces(response) {
                console.log("response position :", response.data.loc);
                var loc = response.data.loc;
                loc = loc.split(",");
                response["status"] = true;
                response["latitude"] = loc[0];
                response["longitude"] = loc[1];
                deferred.resolve(response);
            }, function myError(response) {
                response["status"] = false;
                response["error"] = err;
                //tokyo tower
                response["latitude"] = 35.6585810;
                response["longitude"] = 139.7454330;
                deferred.resolve(response);
            });
            //console.log("Current position failed:",err);
            */
        });
        return deferred.promise;
    };
    //****************
    //Acquisition parking data from server
    //lat - latitude
    //lng - longitude
    //search - Serach Keyword
    //****************
    this.get_addtoGEO = function(address) {
        var deferred = $q.defer();
        var response = [];
        $http({
            method: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + ",JP&sensor=false&key=AIzaSyA4m14npzfDvUgs0T7gisRvyFR3GsLyd_c"
        }).then(function mySucces(response) {
            console.log(response);
            response["status"] = true;
            deferred.resolve(response.data);
        }, function myError(response) {
            console.log(response);
            response["status"] = false;
            deferred.resolve(response);
        });
        return deferred.promise;
    };
}); //End NoteDB service.