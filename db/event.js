const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
    getNewEvent: (id) => {
        return db.collection('events').findOne({_id: ObjectId(id)});
    },
    updateParticipant: (id, newEvent) => {
        return db.collection('events').findOneAndReplace({_id: ObjectId(id)}, newEvent);
    }
});