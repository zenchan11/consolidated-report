const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*', // Adjust for your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// MongoDB connection setup
const MONGO_URI = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const DATABASE_NAME = 'consolidated'; // Replace with your database name

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(DATABASE_NAME);
    })
    .catch(error => console.error('Failed to connect to MongoDB', error));

// Define routes
app.get('/', (req, res) => res.json("Hello message"));

app.get('/undyed-yarn', async (req, res) => {
    try {
        const data = await db.collection('undyed_yarn').find().toArray(); // Replace 'undyedYarn' with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch undyed yarn data' });
    }
});

app.get('/available-section', async (req, res) => {
    try {
        const data = await db.collection('available_section').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch available section data' });
    }
});

app.get('/dyed-store', async (req, res) => {
    try {
        const data = await db.collection('dyed_store').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dyed store data' });
    }
});

app.get('/total-color-used', async (req, res) => {
    try {
        const data = await db.collection('total_color_used').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch total color used data' });
    }
});

app.get('/total-order-received', async (req, res) => {
    try {
        const data = await db.collection('total_order_received').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch total order received data' });
    }
});

app.get('/party-total', async (req, res) => {
    try {
        const data = await db.collection('partyTotal').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch party total data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
