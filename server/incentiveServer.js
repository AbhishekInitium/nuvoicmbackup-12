
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
// Replace this URI with your actual MongoDB connection string
const MONGODB_URI = "mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schema - using flexible schema to match your frontend data structure
const incentiveSchema = new mongoose.Schema({
  name: String,
  description: String,
  effectiveStart: String,
  effectiveEnd: String,
  currency: String,
  revenueBase: String,
  participants: [String],
  commissionStructure: Object,
  measurementRules: Object,
  creditRules: Object,
  customRules: Array,
  salesQuota: Number,
  metadata: {
    createdAt: String,
    updatedAt: String,
    version: Number,
    status: String
  }
}, { strict: false }); // Allow flexible structure

const Incentive = mongoose.model('incentivescheme', incentiveSchema);

// API Routes

// GET all incentive schemes
app.get('/api/incentives', async (req, res) => {
  try {
    const schemes = await Incentive.find();
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch incentive schemes' });
  }
});

// GET a specific incentive scheme by ID
app.get('/api/incentives/:id', async (req, res) => {
  try {
    const scheme = await Incentive.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: 'Incentive scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ error: 'Failed to fetch incentive scheme' });
  }
});

// POST - Create a new incentive scheme
app.post('/api/incentives', async (req, res) => {
  try {
    // Add metadata
    const schemeData = {
      ...req.body,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        status: 'active'
      }
    };
    
    const newScheme = new Incentive(schemeData);
    const savedScheme = await newScheme.save();
    
    res.status(201).json(savedScheme);
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ error: 'Failed to create incentive scheme' });
  }
});

// PUT - Update an existing incentive scheme
app.put('/api/incentives/:id', async (req, res) => {
  try {
    const scheme = await Incentive.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({ error: 'Incentive scheme not found' });
    }
    
    // Update the scheme with new data
    const updates = {
      ...req.body,
      metadata: {
        ...scheme.metadata,
        updatedAt: new Date().toISOString(),
        version: scheme.metadata.version + 1
      }
    };
    
    const updatedScheme = await Incentive.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    
    res.json(updatedScheme);
  } catch (error) {
    console.error('Error updating scheme:', error);
    res.status(500).json({ error: 'Failed to update incentive scheme' });
  }
});

// DELETE - Remove an incentive scheme
app.delete('/api/incentives/:id', async (req, res) => {
  try {
    const deletedScheme = await Incentive.findByIdAndDelete(req.params.id);
    
    if (!deletedScheme) {
      return res.status(404).json({ error: 'Incentive scheme not found' });
    }
    
    res.json({ message: 'Incentive scheme deleted successfully' });
  } catch (error) {
    console.error('Error deleting scheme:', error);
    res.status(500).json({ error: 'Failed to delete incentive scheme' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/incentives`);
});
