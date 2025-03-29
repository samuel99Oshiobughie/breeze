import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define cached connection interface
interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Attach `mongoose` to globalThis without using `any`
const globalWithMongoose = globalThis as typeof globalThis & { mongoose?: Cached };

// Initialize global.mongoose if not already defined
globalWithMongoose.mongoose = globalWithMongoose.mongoose ?? { conn: null, promise: null };

const cached: Cached = globalWithMongoose.mongoose;

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
