
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db.cjs');
const incentiveRoutes = require('./routes/incentiveRoutes.cjs');
const healthRoutes = require('./routes/healthRoutes.cjs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json());

// Connect to MongoDB
connectDB().then(connected => {
  if (!connected) {
    console.warn('Server starting with MongoDB disconnected');
  }
});

// Routes
app.use('/api/incentives', incentiveRoutes);
app.use('/health', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/incentives`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
