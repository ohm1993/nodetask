const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'test';
let db;
const connectToDB = async () => {
    if (db) {
        return db;
    }
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
};

module.exports = connectToDB;