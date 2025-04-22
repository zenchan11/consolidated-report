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
app.use(express.json({ limit: '10mb' })); // Increase payload limit if needed
app.use(express.urlencoded({ extended: true }));
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

app.get('/matching-efficiency', async (req, res) => {
    try {
        const data = await db.collection('matching_efficiency').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch party total data' });
    }
});
app.get('/fresh-redyeing-additional', async (req, res) => {
    try {
        const data = await db.collection('fresh_redyeing_additional_').find().toArray(); // Replace with your collection name
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch party total data' });
    }
});
app.post('/upload-json', async (req, res) => {
    console.log('Received body:', req.body); // Debug log
    
    try {
        // Validate request body
        if (!req.body || !req.body.sheets) {
            return res.status(400).json({ 
                error: 'Invalid request format',
                message: 'Request body must contain "sheets" property'
            });
        }

        // Define your collection mapping with proper sheet name handling
        const COLLECTION_MAP = {
            'Dyed Store': 'dyed_store',
            'Matching Efficiency': 'matching_efficiency',
            'Fresh Redyeing Additional': 'fresh_redyeing_additional_',  // Note: No trailing space
            'Fresh Redyeing Additional ': 'fresh_redyeing_additional_', // Handle both versions
            'Undyed Yarn': 'undyed_yarn',
            'Total Color Used': 'total_color_used',
            'Available Section': 'available_section',
            'Total Order Received': 'total_order_received'
        };

        const { sheets } = req.body;
        const results = [];

        // Process each sheet
        for (const [sheetName, data] of Object.entries(sheets)) {
            // Normalize sheet name by trimming whitespace
            const normalizedSheetName = sheetName.trim();
            
            if (COLLECTION_MAP[normalizedSheetName]) {
                try {
                    const collectionName = COLLECTION_MAP[normalizedSheetName];
                    const collection = db.collection(collectionName);
                    
                    // Clear existing data
                    await collection.deleteMany({});
                    
                    // Insert new data (if array and not empty)
                    if (Array.isArray(data) && data.length > 0) {
                        const result = await collection.insertMany(data);
                        results.push({
                            sheet: normalizedSheetName,
                            collection: collectionName,
                            insertedCount: result.insertedCount
                        });
                    }
                } catch (sheetError) {
                    console.error(`Error processing sheet ${normalizedSheetName}:`, sheetError);
                    results.push({
                        sheet: normalizedSheetName,
                        error: sheetError.message
                    });
                }
            } else {
                console.warn(`No collection mapping found for sheet: "${sheetName}"`);
                results.push({
                    sheet: sheetName,
                    warning: 'No collection mapping found'
                });
            }
        }

        res.json({ 
            message: 'Data processed successfully',
            results
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message,
            receivedBody: req.body // For debugging
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
