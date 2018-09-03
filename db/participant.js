module.exports = (db) => ({
    getEvents: (id) => {
        return db.collection('participants').findOne({id: id});
    },
    markPaid: (id, newParticipant) => {
        return db.collection('participants').findOneAndReplace({id: id}, newParticipant);
    }
});