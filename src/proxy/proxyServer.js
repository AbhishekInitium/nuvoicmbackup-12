const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  next();
});

// Test endpoint to verify the proxy server is working
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Proxy server is working correctly!',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Request details endpoint - helpful for debugging
app.all('/api/inspect-request', (req, res) => {
  // Extract relevant request information
  const requestInfo = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  };
  
  console.log('[Proxy] Request inspection:', requestInfo);
  res.status(200).json({
    success: true,
    message: 'Request details captured',
    request: requestInfo
  });
});

// URL validator middleware
const validateSapUrl = (req, res, next) => {
  let targetPath = req.url.replace(/^\/api\/sap/, '');
  
  // If the path contains a full URL (starts with http:// or https://)
  if (targetPath.match(/^https?:\/\//)) {
    try {
      // Parse the URL to extract the actual path
      const parsedUrl = new URL(targetPath);
      // Store the full target URL for the proxy
      req.targetUrl = targetPath;
      // Update the path to just be the pathname portion
      req.url = `/api/sap${parsedUrl.pathname}${parsedUrl.search || ''}`;
      console.log(`[Proxy] Converted full URL to: ${req.url}`);
      console.log(`[Proxy] Will forward to: ${req.targetUrl}`);
    } catch (error) {
      console.error('[Proxy] Error parsing URL:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format',
        error: error.message
      });
    }
  }
  
  next();
};

// Apply URL validator middleware to /api/sap routes
app.use('/api/sap', validateSapUrl);

// Proxy middleware for SAP S/4HANA - now with dynamic target
const sapProxy = createProxyMiddleware({
  router: (req) => {
    // If a full URL was provided, use that as the target
    if (req.targetUrl) {
      // Extract just the origin part of the URL
      const parsedUrl = new URL(req.targetUrl);
      return `${parsedUrl.origin}`;
    }
    // Otherwise use the default target
    return 'https://my418390-api.s4hana.cloud.sap';
  },
  changeOrigin: true,
  pathRewrite: {
    // Keep the path as is, we've already modified it in the middleware if needed
    '^/api/sap': '', 
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
  },
  // Add logging for debugging
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] Response status: ${proxyRes.statusCode}`);
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
  console.log(`Test endpoint available at: http://localhost:${PORT}/api/test`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});
