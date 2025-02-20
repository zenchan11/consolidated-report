import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb+srv://ngawang:ngawang@cluster0.gdjtgmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = 'consolidated';

let client;
let db;

const connectToDatabase = async () => {
  if (db) return db;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// API Route Handler with CORS
export default async (req, res) => {
  // Set CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'https://consolidated-report-frontend.vercel.app'); // Allow your frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();
    const data = await db.collection('fresh_redyeing_additional_').find().toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch matching efficiency data' });
  }
};
