import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Reads connection URI from MONGO_URI environment variable.
 * Gracefully reports if MONGO_URI is missing without crashing health endpoints.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI === 'your_mongodb_connection_string') {
    console.warn(
      '⚠️  [Database Warning]: MONGO_URI is not configured in environment variables. Database operations will be inactive.'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    return false;
  }
};

export default connectDB;

