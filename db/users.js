const crypto = require('crypto');
const hashPassword = require('../utils/hashPassword');

module.exports = (db) => ({
    get: (username) => {
        return db.collection('publicity').findOne({_id: username});
    },
    create: ({username, password}) => {
        const salt = crypto.randomBytes(512).toString('hex');
        const iterations = Math.floor((Math.random() * 500) + 500);
        const hashedPassword = hashPassword(password, salt, iterations);
        return db.collection('publicity').insertOne({
            _id: username,
            password: {
                hash: hashedPassword,
                salt,
                iterations
            }
        });
    }
});