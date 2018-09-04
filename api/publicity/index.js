const router = require('express').Router();

const newSchema = require('../../schema/newSchema');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);

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

            const orders = events.orders;
            const result = {};

            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token === token) {
                    result.events = orders[i].events;
                    result.sum = orders[i].sum;
                }
            }

            res.status(200).send(result);

        } catch (e) {
            console.log("Error related to getting events")
        }

    });

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
            const publicityid = req.body.publicityid;
            const token = req.body.token;
            const participant = await participantDB.getEvents(id);

            const orders = participant.orders;

            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token === token) {
                    participant.orders[i].paid = true;
                    participant.orders[i].paidTo = publicityid;
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