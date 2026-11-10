import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize database connection (graceful fallback if MONGO_URI is unset)
connectDB();

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 [Server Running]: http://localhost:${PORT}`);
  console.log(`📡 [Health Endpoint]: http://localhost:${PORT}/api/health`);
});

export default server;

