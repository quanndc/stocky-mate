import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null,
        promise: Promise<typeof mongoose> | null
    }
    var mongoDBClientCache: {
        client: MongoClient | null,
        promise: Promise<MongoClient> | null
    }
}

let cached = global.mongooseCache;
let cachedClient = global.mongoDBClientCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

if (!cachedClient) {
    cachedClient = global.mongoDBClientCache = { client: null, promise: null };
}

export const connectToDatabase = async () => {
    if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);

    return cached.conn
}

export const getMongoDBClient = async () => {
    if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

    if (cachedClient.client) {
        return cachedClient.client;
    }

    if (!cachedClient.promise) {
        cachedClient.promise = MongoClient.connect(MONGODB_URI);
    }

    try {
        cachedClient.client = await cachedClient.promise;
    } catch (e) {
        cachedClient.promise = null;
        throw e;
    }

    return cachedClient.client;
}

export const getMongoDBDatabase = async () => {
    const client = await getMongoDBClient();
    return client.db();
}