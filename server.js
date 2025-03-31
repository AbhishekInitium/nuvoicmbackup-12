
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
const PORT = process.env.PORT || 5000;

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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/incentives";

// In-memory storage as fallback when MongoDB is not available
let inMemoryKpiMappings = [];
let nextInMemoryId = 1;

// Function to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Track connection status
let mongoConnectionStatus = {
  connected: false,
  lastError: null,
  lastAttempt: null,
  connectionString: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') // Hide credentials in logs
};

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  mongoConnectionStatus.connected = true;
  mongoConnectionStatus.lastAttempt = new Date().toISOString();
  mongoConnectionStatus.lastError = null;
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.warn('Using in-memory data storage instead. Data will be lost when server restarts.');
  mongoConnectionStatus.connected = false;
  mongoConnectionStatus.lastAttempt = new Date().toISOString();
  mongoConnectionStatus.lastError = err.message;
  // Continue execution even without a DB connection - we'll use in-memory storage
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const currentStatus = isMongoConnected();
  
  // Update status if it's changed
  if (mongoConnectionStatus.connected !== currentStatus) {
    mongoConnectionStatus.connected = currentStatus;
    mongoConnectionStatus.lastAttempt = new Date().toISOString();
  }
  
  res.json({ 
    connected: currentStatus,
    message: currentStatus ? 'Connected to MongoDB' : 'Using in-memory storage',
    details: {
      lastAttempt: mongoConnectionStatus.lastAttempt,
      connectionString: mongoConnectionStatus.connectionString,
      lastError: mongoConnectionStatus.lastError
    }
  });
});

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

const KPIFieldMapping = mongoose.model('KPI_MAPPING', kpiFieldMappingSchema);
const SchemeMaster = mongoose.model('schememaster', schemeMasterSchema);

// API Routes for KPI Field Mappings

// GET all KPI field mappings
app.get('/api/kpi-fields', async (req, res) => {
  try {
    const kpiFields = await KPIFieldMapping.find().sort({ createdAt: -1 });
    console.log(`Fetched ${kpiFields.length} KPI mappings from MongoDB`);
    res.json(kpiFields);
  } catch (error) {
    console.error('Error fetching KPI field mappings:', error);
    res.status(500).json({ error: 'Failed to fetch KPI field mappings' });
  }
});

// GET available KPI fields for designers
app.get('/api/kpi-fields/available', async (req, res) => {
  try {
    const kpiFields = await KPIFieldMapping.find({ availableToDesigner: true }).sort({ kpiName: 1 });
    console.log(`Fetched ${kpiFields.length} available KPI fields for designers from MongoDB`);
    res.json(kpiFields);
  } catch (error) {
    console.error('Error fetching available KPI fields:', error);
    res.status(500).json({ error: 'Failed to fetch available KPI fields' });
  }
});

// POST create a new KPI field mapping
app.post('/api/kpi-fields', async (req, res) => {
  const data = req.body;
  if (isMongoConnected()) {
    try {
      const kpi = new KPIFieldMapping({
        section: data.section,
        kpiName: data.kpiName,
        description: data.description,
        sourceType: data.sourceType,
        sourceField: data.sourceField,
        sourceFileHeader: data.sourceFileHeader,
        dataType: data.dataType,
        api: data.api,
        availableToDesigner: data.availableToDesigner,
        createdAt: new Date().toISOString()
      });
      await kpi.save();
      console.log('KPI mapping saved to MongoDB:', kpi);
      res.status(201).json({ message: 'KPI saved to MongoDB', kpi });
    } catch (error) {
      console.error('MongoDB KPI save error:', error);
      res.status(500).json({ error: 'Failed to save KPI to database.' });
    }
  } else {
    // Fallback only if required
    const kpi = { 
      ...data, 
      _id: String(nextInMemoryId++), 
      createdAt: new Date().toISOString() 
    };
    inMemoryKpiMappings.push(kpi);
    console.log('KPI mapping saved to in-memory storage (MongoDB not available):', kpi);
    res.status(201).json({ message: 'Saved to memory (MongoDB not available)', kpi });
  }
});

// PUT update a KPI field mapping
app.put('/api/kpi-fields/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    const updatedField = await KPIFieldMapping.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedField) {
      return res.status(404).json({ error: 'KPI field mapping not found' });
    }

    console.log('KPI mapping updated in MongoDB:', updatedField);
    res.json({ message: 'KPI mapping updated', kpi: updatedField });
  } catch (error) {
    console.error('Error updating KPI field mapping:', error);
    res.status(500).json({ error: `Failed to update KPI field mapping: ${error.message}` });
  }
});

// DELETE a KPI field mapping
app.delete('/api/kpi-fields/:id', async (req, res) => {
  try {
    const deletedField = await KPIFieldMapping.findByIdAndDelete(req.params.id);
    
    if (!deletedField) {
      return res.status(404).json({ error: 'KPI field mapping not found' });
    }

    console.log('KPI mapping deleted from MongoDB:', deletedField._id);
    res.json({ message: 'KPI mapping deleted' });
  } catch (error) {
    console.error('Error deleting KPI field mapping:', error);
    res.status(500).json({ error: `Failed to delete KPI field mapping: ${error.message}` });
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
    const schemeMaster = await SchemeMaster.findOne({ schemeId: req.params.schemeId });
    
    if (!schemeMaster) {
      return res.status(404).json({ error: 'Scheme master not found' });
    }
    
    res.json({ scheme: schemeMaster });
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
    
    const existing = await SchemeMaster.findOne({ schemeId });
    
    if (existing) {
      // Update existing
      existing.kpiFields = kpiFields;
      existing.updatedAt = new Date().toISOString();
      const updated = await existing.save();
      console.log('Scheme master updated in MongoDB:', updated);
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
      console.log('New scheme master created in MongoDB:', saved);
      res.status(201).json({ message: 'Scheme master created', scheme: saved });
    }
  } catch (error) {
    console.error('Error saving scheme master:', error);
    res.status(500).json({ error: `Failed to save scheme master: ${error.message}` });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// For any routes not matched by the API, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/kpi-fields`);
});
