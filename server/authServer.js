
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

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.warn('Using in-memory data storage instead. Data will be lost when server restarts.');
  // Continue execution even without a DB connection - we'll use in-memory storage
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
let inMemoryUsers = [];
let inMemorySessions = [];
let nextInMemoryId = 1;

// Helper function to determine if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

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
      let user = await User.findOne({ username });
      
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
      let user = inMemoryUsers.find(u => u.username === username);
      
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
    
    if (isMongoConnected()) {
      const user = await User.findById(userId);
      
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
      const user = inMemoryUsers.find(u => u._id === userId);
      
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

// Start server
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/users`);
});
