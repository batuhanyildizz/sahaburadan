const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); 

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Connected to MongoDB`);        
        db = client.db(process.env.DB_NAME);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

function getDatabase() {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase first.');
    }
    return db;
}

module.exports = { connectToDatabase, getDatabase };
