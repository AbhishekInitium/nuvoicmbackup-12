
const mongoose = require('mongoose');

// MongoDB Connection
// Using a local MongoDB instance for development
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/incentiveDB";

// Connection function with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Please make sure MongoDB is running on your local machine or update the connection string');
    return false;
  }
};

// Check connection status
const getConnectionStatus = () => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};

module.exports = {
  connectDB,
  getConnectionStatus
};
