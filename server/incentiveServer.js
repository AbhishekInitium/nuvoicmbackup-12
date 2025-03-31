const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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

// KPI Field Mapping Schema
const kpiFieldMappingSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true
  },
  kpiName: {
    type: String,
    required: true
  },
  description: String,
  sourceType: {
    type: String,
    enum: ['System', 'External'],
    required: true
  },
  sourceField: String,
  sourceFileHeader: String,
  dataType: {
    type: String,
    enum: ['string', 'number', 'date', 'boolean', 'Char4', ''],
    default: 'string'
  },
  api: String,
  availableToDesigner: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

// Scheme Master Schema
const schemeMasterSchema = new mongoose.Schema({
  schemeId: {
    type: String,
    required: true,
    unique: true
  },
  kpiFields: [String], // Array of kpiNames selected
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

const Incentive = mongoose.model('incentivescheme', incentiveSchema);
const KPIFieldMapping = mongoose.model('KPI_MAPPING', kpiFieldMappingSchema);
const SchemeMaster = mongoose.model('schememaster', schemeMasterSchema);

// In-memory fallback for when MongoDB is not available
let inMemorySchemes = [];
let inMemoryKpiMappings = [];
let inMemorySchemeMasters = [];
let nextInMemoryId = 1;

// Helper function to determine if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// API Routes for Incentives

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

    console.log('Attempting to create new version for schemeId:', schemeId);
    console.log('Edited scheme data:', JSON.stringify(editedScheme, null, 2));

    if (isMongoConnected()) {
      // Find ALL documents with this schemeId and sort to get the latest
      const latest = await Incentive.findOne({ schemeId }).sort({ 'metadata.version': -1 });

      if (!latest) {
        console.error(`No scheme found with schemeId: ${schemeId}`);
        return res.status(404).json({ 
          error: 'Scheme not found', 
          details: `No scheme exists with schemeId: ${schemeId}` 
        });
      }

      // Create new version
      const newVersion = new Incentive({
        ...editedScheme,
        schemeId,
        metadata: {
          createdAt: editedScheme.metadata?.createdAt || latest.metadata.createdAt,
          updatedAt: new Date().toISOString(),
          version: latest.metadata.version + 1,
          status: editedScheme.metadata?.status || 'DRAFT'
        }
      });

      console.log('New version to be saved:', JSON.stringify(newVersion.toObject(), null, 2));

      const savedVersion = await newVersion.save();
      
      console.log(`Successfully created version ${savedVersion.metadata.version} for scheme ${schemeId}`);
      
      res.status(201).json(savedVersion);
    } else {
      res.status(500).json({ error: 'Database connection not available' });
    }
  } catch (error) {
    console.error('Error saving new version:', error);
    res.status(500).json({ 
      error: 'Failed to save version', 
      details: error.message 
    });
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

// API Routes for KPI Field Mappings

// GET all KPI field mappings
app.get('/api/kpi-fields', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const kpiFields = await KPIFieldMapping.find().sort({ createdAt: -1 });
      res.json(kpiFields);
    } else {
      res.json(inMemoryKpiMappings);
    }
  } catch (error) {
    console.error('Error fetching KPI field mappings:', error);
    res.status(500).json({ error: 'Failed to fetch KPI field mappings' });
  }
});

// GET available KPI fields for designers
app.get('/api/kpi-fields/available', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const kpiFields = await KPIFieldMapping.find({ availableToDesigner: true }).sort({ kpiName: 1 });
      res.json(kpiFields);
    } else {
      const availableFields = inMemoryKpiMappings.filter(field => field.availableToDesigner);
      res.json(availableFields);
    }
  } catch (error) {
    console.error('Error fetching available KPI fields:', error);
    res.status(500).json({ error: 'Failed to fetch available KPI fields' });
  }
});

// POST create a new KPI field mapping
app.post('/api/kpi-fields', async (req, res) => {
  try {
    const mappingData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const kpiField = new KPIFieldMapping(mappingData);
      const savedField = await kpiField.save();
      res.status(201).json({ message: 'KPI mapping saved', kpi: savedField });
    } else {
      const newMapping = {
        ...mappingData,
        _id: String(nextInMemoryId++)
      };
      inMemoryKpiMappings.push(newMapping);
      res.status(201).json({ message: 'KPI mapping saved', kpi: newMapping });
    }
  } catch (error) {
    console.error('Error creating KPI field mapping:', error);
    res.status(500).json({ error: 'Failed to create KPI field mapping' });
  }
});

// PUT update a KPI field mapping
app.put('/api/kpi-fields/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (isMongoConnected()) {
      const updatedField = await KPIFieldMapping.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedField) {
        return res.status(404).json({ error: 'KPI field mapping not found' });
      }

      res.json({ message: 'KPI mapping updated', kpi: updatedField });
    } else {
      const index = inMemoryKpiMappings.findIndex(field => field._id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'KPI field mapping not found' });
      }

      inMemoryKpiMappings[index] = {
        ...inMemoryKpiMappings[index],
        ...updateData
      };

      res.json({ message: 'KPI mapping updated', kpi: inMemoryKpiMappings[index] });
    }
  } catch (error) {
    console.error('Error updating KPI field mapping:', error);
    res.status(500).json({ error: 'Failed to update KPI field mapping' });
  }
});

// DELETE a KPI field mapping
app.delete('/api/kpi-fields/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const deletedField = await KPIFieldMapping.findByIdAndDelete(req.params.id);
      
      if (!deletedField) {
        return res.status(404).json({ error: 'KPI field mapping not found' });
      }

      res.json({ message: 'KPI mapping deleted' });
    } else {
      const index = inMemoryKpiMappings.findIndex(field => field._id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: 'KPI field mapping not found' });
      }

      inMemoryKpiMappings.splice(index, 1);
      res.json({ message: 'KPI mapping deleted' });
    }
  } catch (error) {
    console.error('Error deleting KPI field mapping:', error);
    res.status(500).json({ error: 'Failed to delete KPI field mapping' });
  }
});

// POST upload Excel file to extract headers
app.post('/api/upload-format', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    const headers = sheet[0];
    
    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });
    
    res.json({ headers });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

// API Routes for Scheme Masters

// GET scheme master by schemeId
app.get('/api/schemes/:schemeId/master', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const schemeMaster = await SchemeMaster.findOne({ schemeId: req.params.schemeId });
      
      if (!schemeMaster) {
        return res.status(404).json({ error: 'Scheme master not found' });
      }
      
      res.json({ scheme: schemeMaster });
    } else {
      const schemeMaster = inMemorySchemeMasters.find(master => master.schemeId === req.params.schemeId);
      
      if (!schemeMaster) {
        return res.status(404).json({ error: 'Scheme master not found' });
      }
      
      res.json({ scheme: schemeMaster });
    }
  } catch (error) {
    console.error('Error fetching scheme master:', error);
    res.status(500).json({ error: 'Failed to fetch scheme master' });
  }
});

// POST create or update scheme master
app.post('/api/schemes/:schemeId/master', async (req, res) => {
  try {
    const { kpiFields } = req.body;
    const { schemeId } = req.params;
    
    if (isMongoConnected()) {
      const existing = await SchemeMaster.findOne({ schemeId });
      
      if (existing) {
        // Update existing
        existing.kpiFields = kpiFields;
        existing.updatedAt = new Date().toISOString();
        const updated = await existing.save();
        res.json({ message: 'Scheme master updated', scheme: updated });
      } else {
        // Create new
        const schemeMaster = new SchemeMaster({
          schemeId,
          kpiFields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        const saved = await schemeMaster.save();
        res.status(201).json({ message: 'Scheme master created', scheme: saved });
      }
    } else {
      const existing = inMemorySchemeMasters.find(master => master.schemeId === schemeId);
      
      if (existing) {
        // Update existing
        existing.kpiFields = kpiFields;
        existing.updatedAt = new Date().toISOString();
        res.json({ message: 'Scheme master updated', scheme: existing });
      } else {
        // Create new
        const schemeMaster = {
          _id: String(nextInMemoryId++),
          schemeId,
          kpiFields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        inMemorySchemeMasters.push(schemeMaster);
        res.status(201).json({ message: 'Scheme master created', scheme: schemeMaster });
      }
    }
  } catch (error) {
    console.error('Error saving scheme master:', error);
    res.status(500).json({ error: 'Failed to save scheme master' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/incentives`);
});
