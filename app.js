const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const events = require('./api/publicity');
const users = require('./api/user');

const auth = require('./middleware/auth');

dotenv.config();
const server = require('http').createServer(app);
server.listen(4000);
(async () => {

    const client = await MongoClient.connect(process.env.DB,{useNewUrlParser: true});
    const db = client.db('Genesis-18');
    console.log('Connected to database');
    app.use('/events', auth, events(db));
    app.use('/users', users(db));

})();

module.exports = app;