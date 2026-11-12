import app from '../app.js';
import connectDB from '../config/db.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('Failed to connect to MongoDB in serverless handler:', err);
    }
  }
  return app(req, res);
}
