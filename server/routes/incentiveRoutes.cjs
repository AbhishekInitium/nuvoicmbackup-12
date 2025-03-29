
const express = require('express');
const router = express.Router();
const Incentive = require('../models/incentiveSchema.cjs');

// GET all incentive schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Incentive.find().sort({ 'metadata.createdAt': -1 });
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch incentive schemes', details: error.message });
  }
});

// GET a specific incentive scheme by ID
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Incentive.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: 'Incentive scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ error: 'Failed to fetch incentive scheme', details: error.message });
  }
});

// POST - Create a new incentive scheme
router.post('/', async (req, res) => {
  try {
    console.log('Received scheme data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const { name, effectiveStart, effectiveEnd, revenueBase } = req.body;
    if (!name || !effectiveStart || !effectiveEnd || !revenueBase) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Name, effectiveStart, effectiveEnd, and revenueBase are required'
      });
    }
    
    // Ensure the scheme has required metadata
    const schemeData = {
      ...req.body,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        status: req.body.metadata?.status || 'DRAFT'
      }
    };
    
    const newScheme = new Incentive(schemeData);
    const savedScheme = await newScheme.save();
    
    console.log('Scheme saved successfully with ID:', savedScheme._id);
    res.status(201).json(savedScheme);
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({ 
      error: 'Failed to create incentive scheme',
      details: error.message,
      stack: error.stack
    });
  }
});

// PUT - Update an existing incentive scheme
router.put('/:id', async (req, res) => {
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
        ...req.body.metadata,
        updatedAt: new Date().toISOString(),
        version: (scheme.metadata.version || 0) + 1
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
router.patch('/:id/status', async (req, res) => {
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
        'metadata.updatedAt': new Date().toISOString(),
        'metadata.version': (scheme.metadata.version || 0) + 1
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
