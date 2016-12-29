// LocalStorage service have ability to store data by HTML5 localStorage feature.
// 
// The data will store in a json format.
// object schema of note data is: 
// [{
//     id: id of note,
//     title: title of note,
//     detail: note detail,
//     createDate: note created date
// }]
appServices.factory('localStorage', function($filter, $window) {
    return {
        // Get data from localStorage it will use data key for getting the data.
        // Parameter :  
        // key = reference of object in localStorage.
        get: function(key) {
            return JSON.parse($window.localStorage[key] || "null");
        },
        // Add data to localStorage it will use data key 
        // by input data key and value for setting data to localStorage.
        // Parameter :  
        // key = reference of object in localStorage.
        // value = data that will store in localStorage.
        set: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        //Remove all data from localStorage.
        removeAll: function() {
            $window.localStorage.clear();
        }
    };
}); //End LocalStorage service.
// NoteDB service will call localStorage Services to present notes data to controller.
appServices.factory('NoteDB', function(localStorage) {
    return {
        //  Get all data from localStorage.
        selectAll: function() {
            //noteData is the key of object that store in localStorage.
            return localStorage.get("noteData");
        },
        // Add new note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will store in localStorage.
        insert: function(note) {
            var notesList = localStorage.get("noteData");
            if (notesList == null) {
                // For first value of data.
                var newNoteData = [{
                    id: 1,
                    title: note.title,
                    detail: note.detail,
                    createDate: note.createDate
                }];
                localStorage.set("noteData", newNoteData);
            } else {
                // For up to second value of data.
                var newNoteData = {
                    id: (notesList.length + 1),
                    title: note.title,
                    detail: note.detail,
                    createDate: note.createDate
                };
                notesList.push(newNoteData);
                localStorage.set("noteData", notesList);
            }
        },
        // Update note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will update to localStorage.
        update: function(note) {
            var notesList = localStorage.get("noteData");
            for (var i = 0; i <= notesList.length; i++) {
                if (notesList[i].id == note.id) {
                    notesList[i] = note;
                    break;
                }
            }
            localStorage.set("noteData", notesList);
        },
        // Remove data from localStorage it will receive note data
        // from controller to remove data from localStorage.
        // Parameter :  
        // note = data that will delete from localStorage.
        delete: function(note) {
            var notesList = localStorage.get("noteData");
            for (var i = 0; i <= notesList.length; i++) {
                if (notesList[i].id == note.id) {
                    notesList.splice(i, 1);
                    break;
                }
            }
            localStorage.set("noteData", notesList);
        },
        // Remove All data from localStorage.
        clear: function() {
            localStorage.removeAll();
        },
        // Get number of notes.
        count: function() {
            var notesList = localStorage.get("noteData");
            return (notesList == null ? 0 : notesList.length);
        }
    };
}); //End NoteDB service.
// 
appServices.service('SerachService', function($rootScope, $http, $q, $filter, $cordovaGeolocation, tomeretaConfig) {
    //****************
    //Acquisition parking data from server
    //lat - latitude
    //lng - longitude
    //search - Serach Keyword
    //****************
    this.get_recent_parking_data = function(lat, lng, search) {
        range = search.range * 1000;
        var serachtext = "lat=" + lat + "&lng=" + lng + "&radius=" + range;
        if (search.keyword && search.keyword != "") {
            serachtext = serachtext + "&address=" + search.keyword;
        }
        if (search.searchdate) {
            var date = "";
            date = date + $filter('date')(search.searchdate, "yyyyMMdd");
            serachtext = serachtext + "&use=" + date;
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
        $http.get("https://tomereta.jp/appif/getdata?" + serachtext).success(function(data) {
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
        $http.get("https://tomereta.jp/getParkingDetail?parkingId=" + parking_id).success(function(data) {
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
            //console.log("Current position :",position);
            response["status"] = true;
            //response["latitude"] = 35.6585810;
            //response["longitude"] = 139.7454330;
             response["latitude"] = 35.6585810;
                response["longitude"] = 139.7454330;
            deferred.resolve(response);
        }, function error(err) {
            $http({
                method: "GET",
                url: "http://ip-api.com/json"
            }).then(function mySucces(response) {
                response["status"] = true;
                response["latitude"] = response.data.lat;
                response["longitude"] = response.data.lon;
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
        });
        return deferred.promise;
    };
}); //End NoteDB service.