import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI; // Use environment variables for sensitive data
const DATABASE_NAME = process.env.DATABASE_NAME; // Same for database name
let db;

const connectToDatabase = async () => {
  if (db) return db;
  try {
    const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
    db = client.db(DATABASE_NAME);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

export default async (req, res) => {
  const db = await connectToDatabase();
  try {
    const data = await db.collection('dyed_store').find().toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dyed store data' });
  }
};
