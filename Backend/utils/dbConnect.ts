import { MongoClient, Db } from 'mongodb';

//database connection
const url = 'mongodb://localhost:27017';
const dbName = 'myVideoDB';
let db: Db;

const client = new MongoClient(url);

async function databaseConnect(): Promise<Db> {
    if (!db) {
        try {
            await client.connect()
            db = client.db(dbName);
            console.log('Connected to database');
        } catch (error) {
            console.log("Error in connecting database", error)
            throw error;
        }
    }
    return db;
}

export default databaseConnect


