const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

/**
 * built-in middleware functions
 */

app.use(cors());
app.use(express.json());


/**
 * Database Connection
 */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("volunteerManagement");
        const eventCollection = database.collection("events");
        const volunteerCollection = database.collection("volunteers");

        // POST API to add event
        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result);
        });

        // POST API to add volunteer
        app.post('/volunteer', async (req, res) => {
            const volunteer = req.body;
            const result = await volunteerCollection.insertOne(volunteer);
            res.send(result);
        });

        // GET API to get all events
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        });

        // GET API to get all volunteer
        app.get('/volunteers', async (req, res) => {
            const cursor = volunteerCollection.find({});
            const volunteers = await cursor.toArray();
            res.send(volunteers);
        });

        // POST API to get myEvents by email
        app.post('/volunteers/byemail', async (req, res) => {
            const email = req.body;
            const query = { email: { $in: email } }
            const myEvents = await volunteerCollection.find(query).toArray();
            res.send(myEvents);
        });


        // DELETE API to delete volunteer
        app.delete('/volunteers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await volunteerCollection.deleteOne(query);
            res.json(result)

        });

        // console.log('Successfully database connected');
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Node Server is Running');
});

app.listen(port, () => {
    console.log('Listening at', port);
});