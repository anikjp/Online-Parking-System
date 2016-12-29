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
appServices.factory('DBServices', function(localStorage) {
    return {
        //  Get all data from localStorage.
        get: function(parking_id, type) {
            var targetitem = false;
            var notesList = localStorage.get("noteData");
            for (var i = 0; i < notesList.length; i++) {
                if (notesList[i].parking_id == parking_id && notesList[i].type == type) {
                    targetitem = true;
                    break;
                }
            }
            return targetitem;
        },
        //  Get all data from localStorage.
        selectAll: function(type) {
            var returnList = [];
            var notesList = localStorage.get("noteData");
            console.log(notesList);
            if (notesList) {
                for (var i = 0; i < notesList.length; i++) {
                    if (notesList[i].type == type) {
                        returnList.push(notesList[i]);
                        break;
                    }
                }
            }
            //noteData is the key of object that store in localStorage.
            return returnList;
        },
        // Add new note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will store in localStorage.
        insert: function(data, type) {
            var notesList = localStorage.get("noteData");
            if (notesList == null) {
                // For first value of data.
                var newNoteData = [{
                    id: 1,
                    type: type,
                    parking_id: data.parking_images.parking_space_id,
                    fulldata: data
                }];
                console.log(newNoteData);
                localStorage.set("noteData", newNoteData);
            } else {
                // For up to second value of data.
                var newNoteData = {
                    id: (notesList.length + 1),
                    type: type,
                    parking_id: data.parking_images.parking_space_id,
                    fulldata: data
                };
                notesList.push(newNoteData);
                console.log(newNoteData);
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
// NoteDB service will call localStorage Services to present notes data to controller.
appServices.factory('FavlistDBServices', function(localStorage) {
    return {
        //  Get all data from localStorage.
        get: function(parking_id) {
            var targetitem = false;
            //$this=this;
            if (this.count() === 0) {
                return targetitem;
            }
            var notesList = localStorage.get("favlistData");
            for (var i = 0; i < notesList.length; i++) {
                if (notesList[i].parking_id == parking_id) {
                    targetitem = true;
                    break;
                }
            }
            return targetitem;
        },
        //  Get all data from localStorage.
        selectAll: function() {
            var returnList = [];
            if (this.count() === 0) {
                return returnList;
            } else {
                returnList = localStorage.get("favlistData");
            }
            //noteData is the key of object that store in localStorage.
            return returnList;
        },
        // Add new note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will store in localStorage.
        insert: function(data) {
            console.log(data);
            var favList = localStorage.get("favlistData");
            if (favList == null) {
                // For first value of data.
                var newFavData = [{
                    id: 1,
                    parking_id: data.parking_space_id,
                    fulldata: data
                }];
                console.log(newFavData);
                localStorage.set("favlistData", newFavData);
            } else {
                // For up to second value of data.
                var newFavData = {
                    id: (favList.length + 1),
                    parking_id: data.parking_space_id,
                    fulldata: data
                };
                favList.push(newFavData);
                console.log(newFavData);
                localStorage.set("favlistData", favList);
            }
        },
        // Update note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will update to localStorage.
        update: function(data) {
            var favList = localStorage.get("favlistData");
            for (var i = 0; i <= favList.length; i++) {
                if (favList[i].id == data.id) {
                    favList[i] = data;
                    break;
                }
            }
            localStorage.set("favlistData", favList);
        },
        // Remove data from localStorage it will receive note data
        // from controller to remove data from localStorage.
        // Parameter :  
        // note = data that will delete from localStorage.
        delete: function(data) {
            var favList = localStorage.get("favlistData");
            for (var i = 0; i <= favList.length; i++) {
                if (favList[i].id == data.id) {
                    favList.splice(i, 1);
                    break;
                }
            }
            localStorage.set("favlistData", favList);
            return favList;
        },
        // Remove All data from localStorage.
        clear: function() {
            localStorage.removeAll();
        },
        // Get number of notes.
        count: function() {
            var favList = localStorage.get("favlistData");
            return (favList == null ? 0 : favList.length);
        }
    };
}); //End NoteDB service.
// NoteDB service will call localStorage Services to present notes data to controller.
appServices.factory('HistoryDBServices', function(localStorage) {
    return {
        //  Get all data from localStorage.
        get: function(parking_id) {
            var targetitem = false;
            if (this.count() === 0) {
                return targetitem;
            }
            var historyList = localStorage.get("historylistData");
            for (var i = 0; i < historyList.length; i++) {
                if (historyList[i].parking_id == parking_id) {
                    targetitem = true;
                    break;
                }
            }
            return targetitem;
        },
        //  Get all data from localStorage.
        selectAll: function() {
            var returnList = [];
            if (this.count() === 0) {
                return returnList;
            } else {
                returnList = localStorage.get("historylistData");
            }
            //noteData is the key of object that store in localStorage.
            return returnList;
        },
        // Add new note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will store in localStorage.
        insert: function(data) {
            var historyList = localStorage.get("historylistData");
            if (historyList == null) {
                // For first value of data.
                var newHistoryData = [{
                    id: 1,
                    parking_id: data.parking_space_id,
                    fulldata: data
                }];
                console.log(newHistoryData);
                localStorage.set("historylistData", newHistoryData);
            } else {
                // For up to second value of data.
                var newHistoryData = {
                    id: (historyList.length + 1),
                    parking_id: data.parking_space_id,
                    fulldata: data
                };
                historyList.push(newHistoryData);
                console.log(newHistoryData);
                localStorage.set("historylistData", historyList);
            }
        },
        // Update note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will update to localStorage.
        update: function(data) {
            var historyList = localStorage.get("historylistData");
            for (var i = 0; i <= historyList.length; i++) {
                if (historyList[i].id == data.id) {
                    historyList[i] = data;
                    break;
                }
            }
            localStorage.set("historylistData", historyList);
        },
        // Remove data from localStorage it will receive note data
        // from controller to remove data from localStorage.
        // Parameter :  
        // note = data that will delete from localStorage.
        delete: function(data) {
            var historyList = localStorage.get("historylistData");
            for (var i = 0; i <= historyList.length; i++) {
                if (historyList[i].id == data.id) {
                    historyList.splice(i, 1);
                    break;
                }
            }
            localStorage.set("historylistData", historyList);
            return historyList;
        },
        // Remove All data from localStorage.
        clear: function() {
            localStorage.removeAll();
        },
        // Get number of notes.
        count: function() {
            var historyList = localStorage.get("historylistData");
            return (historyList == null ? 0 : historyList.length);
        }
    };
}); //End NoteDB service.
appServices.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork) {
    return {
        isOnline: function() {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function() {
            if (ionic.Platform.isWebView()) {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        },
        startWatching: function() {
            if (ionic.Platform.isWebView()) {
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                    console.log("went online");
                });
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                    console.log("went offline");
                });
            } else {
                if (navigator.onLine) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
})