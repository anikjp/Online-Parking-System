

// NoteDB service will call localStorage Services to present notes data to controller.
appServices.factory('NoteDB', function (localStorage) {
    return {
        //  Get all data from localStorage.
        selectAll: function () {
            //noteData is the key of object that store in localStorage.
            return localStorage.get("noteData");
        },

        // Add new note data to localStorage.
        // It will receive note data from controller to store in localStorage.
        // Parameter :  
        // note = data that will store in localStorage.
        insert: function (note) {
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
            } 
            else {
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
        update: function (note) {
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
        delete: function (note) {
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
        clear: function () {
            localStorage.removeAll();
        },
        
        // Get number of notes.
        count: function () {
            var notesList = localStorage.get("noteData");
            return (notesList == null ? 0 : notesList.length);
        }
    };
});//End NoteDB service.