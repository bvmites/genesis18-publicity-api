const router = require('express').Router();

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);

    // Get Events by Token

    router.post('/find', async (req, res) => {
        try {
            const id = req.body.id;
            const token = req.body.token;
            const events = await participantDB.getEvents(id);
            console.log(events);
            const orders = events.orders;
            const result = {};
            console.log(orders);
            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token == token) {
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

    router.post('/paid', async (req, res) => {
        try {
            const id = req.body.id;
            const publicityid = req.body.publicityid;
            const token = req.body.token;
            const participant = await participantDB.getEvents(id);
            console.log(participant);
            const orders = participant.orders;
            console.log(orders);
            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token == token) {
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