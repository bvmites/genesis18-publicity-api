const router = require('express').Router();

const newSchema = require('../../schema/newSchema');

const Validator = require('jsonschema').Validator;
const validator = Validator();

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);

    // Get Events by Token
    // POST /publicity/find
    router.post('/find', async (req, res) => {

        let schema = req.body;
        const error = new Error();
        if (!validator.validate(schema, newSchema).valid) {
            error.message = 'Invalid request';
            error.code = 'ValidationException';
            throw error;
        }

        try {
            const id = req.body.username;
            const token = req.body.token;
            const events = await participantDB.getEvents(id);
            console.log(events);
            const orders = events.orders;
            const result = {};
            console.log(orders);
            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token === token) {
                    result.events = orders[i].events;
                    result.sum = orders[i].sum;
                }
            }
            console.log(result);
            res.status(200).send(result);

        } catch (e) {
            console.log("Error related to getting events")
        }

    });

    //update payment status
    //Post /publicity/paid
    router.post('/paid', async (req, res) => {

        try {
            let schema = req.body;
            const error = new Error();
            if (!validator.validate(schema, newSchema).valid) {
                error.message = 'Invalid request';
                error.code = 'ValidationException';
                throw error;
            }

            const id = req.body.username;
            const token = req.body.token;
            const participant = await participantDB.getEvents(id);
            console.log(participant);
            const orders = participant.orders;
            console.log(orders);
            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token === token) {
                    participant.orders[i].paid = true;
                }
            }
            const paid = await participantDB.markPaid(id, participant);
            res.status(200).send("updated");

        } catch (e) {
            console.log("Error related to getting events")
        }

    });


    return router;
};