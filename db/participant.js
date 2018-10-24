const ObjectId = require('mongodb').ObjectId;
module.exports = (db) => ({
    getEvents: (id) => {
        return db.collection('participants').findOne({id: id});
    },
    markPaid: (id, newParticipant) => {
        return db.collection('participants').findOneAndReplace({id: id}, newParticipant);
    },
    getall: ()=>{
        return db.collection('participants').find({}).toArray();
    }
    // getParticipant: (id) => {
    //     return db.collection('events').findOne({_id: ObjectId(id)});
    // },
    // updateParticipant: (id, newEvent) => {
    //     return db.collection('events').findOneAndReplace({_id: ObjectId(id)}, newEvent);
    // }
});