const { MongoClient } = require('mongodb');

// MongoDB connection URI
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://ngawang:ngawang@cluster0.gdjtgmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = 'consolidated';

// Collection mapping
const COLLECTION_MAP = {
  'Dyed Store': 'dyed_store',
  'Matching Efficiency': 'matching_efficiency',
  'Fresh Redyeing Additional': 'fresh_redyeing_additional_',
  'Fresh Redyeing Additional ': 'fresh_redyeing_additional_',
  'Undyed Yarn': 'undyed_yarn',
  'Total Color Used': 'total_color_used',
  'Available Section': 'available_section',
  'Total Order Received': 'total_order_received'
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DATABASE_NAME);

    // Validate request body
    if (!req.body || !req.body.sheets) {
      return res.status(400).json({ 
        error: 'Invalid request format',
        message: 'Request body must contain "sheets" property'
      });
    }

    const { sheets } = req.body;
    const results = [];

    // Process each sheet
    for (const [sheetName, data] of Object.entries(sheets)) {
      const normalizedSheetName = sheetName.trim();
      
      if (COLLECTION_MAP[normalizedSheetName]) {
        try {
          const collectionName = COLLECTION_MAP[normalizedSheetName];
          const collection = db.collection(collectionName);
          
          // Clear existing data
          await collection.deleteMany({});
          
          // Insert new data
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
      }
    }

    return res.status(200).json({ 
      message: 'Data processed successfully',
      results
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error.message
    });
  } finally {
    // Close MongoDB connection
    if (client) {
      await client.close();
    }
  }
};