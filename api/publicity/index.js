const router = require('express').Router();

const newSchema = require('../../schema/newSchema');
const paidSchema = require('../../schema/paidSchema');


const Validator = require('jsonschema').Validator;
const validator = new Validator();

module.exports = (db) => {
    const participantDB = require('../../db/participant')(db);
    const eventDB = require('../../db/event')(db);

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
                    result.paid = orders[i].paid;
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
            if (!validator.validate(schema, paidSchema).valid) {
                error.message = 'Invalid request';
                error.code = 'ValidationException';
                throw error;
            }

            const id = req.body.username;
            const publicityId = req.body.publicityId;
            // const eventids = req.body.eventids;
            const token = req.body.token;
            const participant = await participantDB.getEvents(id);
            // console.log(participant);
            const participantId = participant.id;
            const orders = participant.orders;
            for(let i = 0; i < orders.length; ++i){
                if(orders[i].token === token){

                }
            }
            // const eventids = participant
            let eventIds = []
            for (let i = 0; i < orders.length; ++i) {
                if (orders[i].token === token) {
                    participant.orders[i].paid = true;
                    participant.orders[i].paidTo = publicityId;

                    for(let j = 0; j < participant.orders[i].events.length ; ++j){
                        eventIds.push(participant.orders[i].events[j])
                    }
                    // console.log(eventIds);
                }
            }
            const paid = await participantDB.markPaid(id, participant);
            for (let i = 0; i < eventIds.length; ++i) {
                // console.log(eventIds[i]);
                const newEvent = await eventDB.getNewEvent(eventIds[i]);
                // console.log(newEvent);
                const eventId = newEvent._id;
                newEvent.participants.push(participantId);
                const updateParticipant = await eventDB.updateParticipant(eventId,newEvent);
            }
            res.status(200).json("updated");

        } catch (e) {
            console.log(e.message);
        }
    });

    //GET publicity/getall
    router.get('/getall', async (request, response) => {
        try{
            let all = await participantDB.getall();
            // console.log(all[4].orders.length);
            ans = [];
            for(let j = 0; j < all.length; ++j){
                for(let i=0; i < all[j].orders.length; ++i){
                    if (all[j].orders[i].paid === false){
                        let notpaid = {};
                        notpaid = {
                            id: all[j].id,
                            name: all[j].name,
                            phone: all[j].phone,
                            token: all[j].orders[i].token
                        };
                        ans.push(notpaid);
                    }
                }
            }
            // console.log(ans);
            response.status(200).json(ans);
        }
        catch (e) {
            console.log(e.message);
        }
    });

    //GET /publicity/all
    router.get('/all',async (request, response)=> {
        try{
            let all = await participantDB.getall();
            console.log(all);
            // ans = [];

            // console.log(ans);
            response.status(200).json(all);
        }
        catch (e) {
            console.log(e.message);
        }
    });
    return router;
};