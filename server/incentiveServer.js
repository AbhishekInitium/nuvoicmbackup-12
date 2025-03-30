
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

// Define Schema with required fields
const incentiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  schemeId: String, // Used to group versions together
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
    createdAt: {
      type: String,
      default: () => new Date().toISOString()
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString()
    },
    version: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'SIMULATION', 'PRODUCTION'],
      default: 'DRAFT'
    }
  }
}, { strict: false }); // Allow flexible structure

const Incentive = mongoose.model('incentivescheme', incentiveSchema);

// API Routes

// GET all incentive schemes - return latest version of each schemeId
app.get('/api/incentives', async (req, res) => {
  try {
    // Group by schemeId and find the highest version for each
    const schemes = await Incentive.aggregate([
      { 
        $sort: { 
          schemeId: 1, 
          "metadata.version": -1 
        } 
      },
      {
        $group: {
          _id: "$schemeId",
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      {
        $sort: { 'metadata.updatedAt': -1 }
      }
    ]);
    
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch incentive schemes' });
  }
});

// GET all versions of a specific scheme by schemeId
app.get('/api/incentives/versions/:schemeId', async (req, res) => {
  try {
    const schemes = await Incentive.find({ 
      schemeId: req.params.schemeId 
    }).sort({ 'metadata.version': -1 });
    
    if (!schemes || schemes.length === 0) {
      return res.status(404).json({ error: 'No versions found for this scheme ID' });
    }
    
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching scheme versions:', error);
    res.status(500).json({ error: 'Failed to fetch scheme versions' });
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
    // Ensure the scheme has required metadata
    const schemeData = {
      ...req.body,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: req.body.metadata?.version || 1,
        status: req.body.metadata?.status || 'DRAFT'
      }
    };
    
    const newScheme = new Incentive(schemeData);
    const savedScheme = await newScheme.save();
    
    res.status(201).json(savedScheme);
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ error: `Failed to create incentive scheme: ${error.message}` });
  }
});

// PUT - Update an existing incentive scheme
// This is kept for compatibility but we're now using POST for new versions
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
        ...scheme.metadata.toObject(),
        ...req.body.metadata,
        updatedAt: new Date().toISOString()
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

// PATCH - Update scheme status only
app.patch('/api/incentives/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['DRAFT', 'APPROVED', 'SIMULATION', 'PRODUCTION'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const scheme = await Incentive.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({ error: 'Incentive scheme not found' });
    }
    
    const updatedScheme = await Incentive.findByIdAndUpdate(
      req.params.id,
      { 
        'metadata.status': status,
        'metadata.updatedAt': new Date().toISOString()
      },
      { new: true }
    );
    
    res.json(updatedScheme);
  } catch (error) {
    console.error('Error updating scheme status:', error);
    res.status(500).json({ error: 'Failed to update incentive scheme status' });
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
