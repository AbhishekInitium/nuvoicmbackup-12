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
// Using a local MongoDB instance since we don't have the actual MongoDB Atlas credentials
// This will use a locally running MongoDB instance or MongoDB memory server for testing
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/incentives";

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

// In-memory fallback for when MongoDB is not available
let inMemorySchemes = [];
let nextInMemoryId = 1;

// Helper function to determine if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// API Routes

// GET all incentive schemes - return latest version of each schemeId
app.get('/api/incentives', async (req, res) => {
  try {
    if (isMongoConnected()) {
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
    } else {
      // Fallback to in-memory data if MongoDB is not connected
      console.log('Returning in-memory schemes:', inMemorySchemes.length);
      
      // Group by schemeId and get latest version
      const schemes = Object.values(
        inMemorySchemes.reduce((acc, scheme) => {
          const { schemeId } = scheme;
          if (!acc[schemeId] || acc[schemeId].metadata.version < scheme.metadata.version) {
            acc[schemeId] = scheme;
          }
          return acc;
        }, {})
      );
      
      res.json(schemes);
    }
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch incentive schemes' });
  }
});

// GET all versions of a specific scheme by schemeId
app.get('/api/incentives/versions/:schemeId', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const schemes = await Incentive.find({ 
        schemeId: req.params.schemeId 
      }).sort({ 'metadata.version': -1 });
      
      if (!schemes || schemes.length === 0) {
        return res.status(404).json({ error: 'No versions found for this scheme ID' });
      }
      
      res.json(schemes);
    } else {
      // Fallback to in-memory data
      const schemes = inMemorySchemes
        .filter(scheme => scheme.schemeId === req.params.schemeId)
        .sort((a, b) => b.metadata.version - a.metadata.version);
        
      if (schemes.length === 0) {
        return res.status(404).json({ error: 'No versions found for this scheme ID' });
      }
      
      res.json(schemes);
    }
  } catch (error) {
    console.error('Error fetching scheme versions:', error);
    res.status(500).json({ error: 'Failed to fetch scheme versions' });
  }
});

// GET a specific incentive scheme by ID
app.get('/api/incentives/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const scheme = await Incentive.findById(req.params.id);
      if (!scheme) {
        return res.status(404).json({ error: 'Incentive scheme not found' });
      }
      res.json(scheme);
    } else {
      // Fallback to in-memory data
      const scheme = inMemorySchemes.find(s => s._id === req.params.id);
      
      if (!scheme) {
        return res.status(404).json({ error: 'Incentive scheme not found' });
      }
      
      res.json(scheme);
    }
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
    
    if (isMongoConnected()) {
      const newScheme = new Incentive(schemeData);
      const savedScheme = await newScheme.save();
      res.status(201).json(savedScheme);
    } else {
      // Fallback to in-memory storage
      const inMemoryScheme = {
        ...schemeData,
        _id: String(nextInMemoryId++)
      };
      
      inMemorySchemes.push(inMemoryScheme);
      console.log(`Saved in-memory scheme with ID: ${inMemoryScheme._id}`);
      res.status(201).json(inMemoryScheme);
    }
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ error: `Failed to create incentive scheme: ${error.message}` });
  }
});

// POST - Save a new version of an existing scheme
app.post('/api/incentives/:schemeId/version', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const editedScheme = req.body;

    if (isMongoConnected()) {
      // Get latest version from MongoDB
      const latest = await Incentive.findOne({ schemeId }).sort({ 'metadata.version': -1 });

      if (!latest) {
        return res.status(404).json({ error: 'Scheme not found' });
      }

      // Create new version
      const newVersion = new Incentive({
        ...editedScheme,
        schemeId,
        metadata: {
          createdAt: editedScheme.metadata?.createdAt || latest.metadata.createdAt,
          updatedAt: new Date().toISOString(),
          version: latest.metadata.version + 1,
          status: 'DRAFT'
        }
      });

      const savedVersion = await newVersion.save();
      res.status(201).json(savedVersion);
    } else {
      // In-memory version
      const latest = [...inMemorySchemes]
        .filter(s => s.schemeId === schemeId)
        .sort((a, b) => b.metadata.version - a.metadata.version)[0];
        
      if (!latest) {
        return res.status(404).json({ error: 'Scheme not found' });
      }
      
      const newVersion = {
        ...editedScheme,
        _id: String(nextInMemoryId++),
        schemeId,
        metadata: {
          createdAt: editedScheme.metadata?.createdAt || latest.metadata.createdAt,
          updatedAt: new Date().toISOString(),
          version: latest.metadata.version + 1,
          status: 'DRAFT'
        }
      };
      
      inMemorySchemes.push(newVersion);
      console.log(`Saved in-memory version ${newVersion.metadata.version} for scheme ${schemeId}`);
      res.status(201).json(newVersion);
    }
  } catch (error) {
    console.error('Error saving new version:', error);
    res.status(500).json({ error: 'Failed to save version' });
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
