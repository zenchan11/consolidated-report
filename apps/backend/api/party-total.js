import { MongoClient } from 'mongodb';

// const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = 'mongodb://localhost:27017'; 
const MONGO_URI='mmongodb+srv://ngawang:ngawang@cluster0.gdjtgmf.mongodb.net/'
const DATABASE_NAME = 'consolidated'; // Replace with your database name

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
    const data = await db.collection('party_total').find().toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch party total data' });
  }
};
