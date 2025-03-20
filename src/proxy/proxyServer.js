
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  next();
});

// Proxy middleware for SAP S/4HANA
const sapProxy = createProxyMiddleware({
  target: 'https://my418390-api.s4hana.cloud.sap',
  changeOrigin: true,
  pathRewrite: {
    '^/api/sap': '', // Remove /api/sap prefix when forwarding
  },
  onProxyReq: (proxyReq, req) => {
    // Forward the authorization header if it exists
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
    
    // Log proxy requests for debugging
    console.log(`[Proxy] Forwarding to: ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy] Error:', err);
    res.status(500).send('Proxy Error: ' + err.message);
  }
});

// Use the SAP proxy middleware for all /api/sap requests
app.use('/api/sap', sapProxy);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('Proxy server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
