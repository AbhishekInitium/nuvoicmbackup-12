
const express = require('express');
const router = express.Router();
const { getConnectionStatus } = require('../config/db.cjs');

// Health check route
router.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    mongodb: getConnectionStatus()
  });
});

module.exports = router;
