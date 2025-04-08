
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://abhishekbhate:rr48QVSFnzq5rqsJ@cluster0.jmskiuq.mongodb.net/NUVO_ICM_MAIN?retryWrites=true&w=majority&appName=Cluster0";

// Global database connection for reuse across the application
let db;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  db = mongoose.connection;
  
  // Initialize default users if they don't exist
  initializeDefaultUsers();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.warn('Using in-memory data storage instead. Data will be lost when server restarts.');
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'agent', 'finance'],
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);

// Session Schema for tracking user sessions
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: Date,
  active: {
    type: Boolean,
    default: true
  }
});

const Session = mongoose.model('Session', sessionSchema);

// In-memory fallback for when MongoDB is not available
let inMemoryUsers = [
  { _id: '1', username: 'admin_user', role: 'admin', clientId: 'NUVO_01', createdAt: new Date(), lastLogin: null },
  { _id: '2', username: 'manager_user', role: 'manager', clientId: 'NUVO_01', createdAt: new Date(), lastLogin: null },
  { _id: '3', username: 'agent_user', role: 'agent', clientId: 'NUVO_01', createdAt: new Date(), lastLogin: null },
  { _id: '4', username: 'finance_user', role: 'finance', clientId: 'NUVO_01', createdAt: new Date(), lastLogin: null },
];
let inMemorySessions = [];
let nextInMemoryId = 5;

// Helper function to determine if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Function to initialize default users if they don't exist
async function initializeDefaultUsers() {
  if (!isMongoConnected()) return;

  const defaultUsers = [
    { username: 'admin_user', role: 'admin', clientId: 'NUVO_01' },
    { username: 'manager_user', role: 'manager', clientId: 'NUVO_01' },
    { username: 'agent_user', role: 'agent', clientId: 'NUVO_01' },
    { username: 'finance_user', role: 'finance', clientId: 'NUVO_01' },
  ];

  try {
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        console.log(`Creating default user: ${userData.username}`);
        const newUser = new User(userData);
        await newUser.save();
      }
    }
    console.log('Default users initialized successfully');
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
}

// API Routes

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, role, clientId } = req.body;
    
    if (!username || !role || !clientId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (isMongoConnected()) {
      // Find or create user
      let user = await User.findOne({ username, clientId });
      
      if (!user) {
        // Create new user if not found
        user = new User({
          username,
          role,
          clientId
        });
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      // Create session
      const session = new Session({ userId: user._id });
      await session.save();
      
      res.json({
        username: user.username,
        role: user.role,
        clientId: user.clientId,
        isAuthenticated: true
      });
    } else {
      // Fallback to in-memory storage
      let user = inMemoryUsers.find(u => u.username === username && u.clientId === clientId);
      
      if (!user) {
        user = {
          _id: String(nextInMemoryId++),
          username,
          role,
          clientId,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        inMemoryUsers.push(user);
      } else {
        user.lastLogin = new Date();
      }
      
      // Create session
      inMemorySessions.push({
        _id: String(nextInMemoryId++),
        userId: user._id,
        loginTime: new Date(),
        active: true
      });
      
      res.json({
        username: user.username,
        role: user.role,
        clientId: user.clientId,
        isAuthenticated: true
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Logout endpoint
app.post('/api/users/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (isMongoConnected()) {
      // Mark all active sessions as inactive
      await Session.updateMany(
        { userId: userId, active: true },
        { active: false, logoutTime: new Date() }
      );
    } else {
      // Fallback to in-memory storage
      inMemorySessions.forEach(session => {
        if (session.userId === userId && session.active) {
          session.active = false;
          session.logoutTime = new Date();
        }
      });
    }
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed', details: error.message });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const clientId = req.query.clientId || 'NUVO_01';
    
    if (isMongoConnected()) {
      const user = await User.findOne({ username: userId, clientId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        clientId: user.clientId
      });
    } else {
      // Fallback to in-memory storage
      const user = inMemoryUsers.find(u => u.username === userId && u.clientId === clientId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        clientId: user.clientId
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
});

// Get all users for a specific client
app.get('/api/users', async (req, res) => {
  try {
    const clientId = req.query.clientId || 'NUVO_01';
    
    if (isMongoConnected()) {
      const users = await User.find({ clientId }).select('-__v');
      res.json(users);
    } else {
      const users = inMemoryUsers.filter(u => u.clientId === clientId);
      res.json(users);
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users', details: error.message });
  }
});

// Export MongoDB connection for reuse
module.exports = {
  mongoose,
  isMongoConnected
};

// Start server
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/users`);
});
