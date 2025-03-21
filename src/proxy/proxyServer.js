
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
  // Handle the targetUrl query parameter for full URLs
  if (req.query.targetUrl) {
    try {
      const targetUrl = decodeURIComponent(req.query.targetUrl);
      console.log(`[Proxy] Using full URL target: ${targetUrl}`);
      const parsedUrl = new URL(targetUrl);
      
      // Set the target URL for the proxy middleware to use
      req.targetUrl = targetUrl;
      
      // Get just the pathname and search parts
      const pathWithSearch = parsedUrl.pathname + (parsedUrl.search ? parsedUrl.search : '');
      req.targetPath = pathWithSearch;
      
      // If the path already starts with the original path, don't add it again
      req.url = req.targetPath;
      
      console.log(`[Proxy] Will forward to: ${parsedUrl.origin} with path: ${req.url}`);
    } catch (error) {
      console.error('[Proxy] Error parsing URL:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format',
        error: error.message
      });
    }
  } else {
    // Legacy path handling for partial URLs
    let targetPath = req.url.replace(/^\/api\/sap/, '');
    
    // If the path contains a full URL (starts with http:// or https://)
    if (targetPath.match(/^https?:\/\//)) {
      try {
        // Parse the URL to extract the actual path
        const parsedUrl = new URL(targetPath);
        // Store the full target URL for the proxy
        req.targetUrl = targetPath;
        // Update the path to just be the pathname portion
        req.url = parsedUrl.pathname + (parsedUrl.search || '');
        console.log(`[Proxy] Legacy: Converted full URL to path: ${req.url}`);
        console.log(`[Proxy] Legacy: Will forward to: ${req.targetUrl}`);
      } catch (error) {
        console.error('[Proxy] Error parsing URL:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format',
          error: error.message
        });
      }
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
      try {
        const parsedUrl = new URL(req.targetUrl);
        return `${parsedUrl.origin}`;
      } catch (e) {
        console.error('[Proxy] Error parsing target URL:', e);
        return 'https://my418390-api.s4hana.cloud.sap';
      }
    }
    // Otherwise use the default target
    return 'https://my418390-api.s4hana.cloud.sap';
  },
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // If we have a specific target path from the middleware, use it
    if (req.targetPath) {
      return req.targetPath;
    }
    
    // Otherwise use the standard path rewrite
    return path.replace(/^\/api\/sap/, '');
  },
  onProxyReq: (proxyReq, req) => {
    // Forward the authorization header if it exists
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
    
    // Add proper headers for JSON responses
    proxyReq.setHeader('Accept', 'application/json');
    
    // Log proxy requests for debugging
    console.log(`[Proxy] Forwarding to: ${proxyReq.path}`);
    console.log(`[Proxy] With headers:`, req.headers);
  },
  onError: (err, req, res) => {
    console.error('[Proxy] Error:', err);
    res.status(500).json({
      success: false,
      message: 'Proxy Error',
      error: err.message,
      code: err.code
    });
  },
  // Add logging for debugging
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] Response status: ${proxyRes.statusCode}`);
    console.log(`[Proxy] Response headers:`, proxyRes.headers);
    
    // Log a preview of the response body for JSON responses
    if (proxyRes.headers['content-type']?.includes('application/json')) {
      let responseBody = '';
      
      proxyRes.on('data', (chunk) => {
        responseBody += chunk.toString('utf8');
      });
      
      proxyRes.on('end', () => {
        try {
          // Only log a preview (first 300 characters) to avoid flooding the console
          const preview = responseBody.substring(0, 300) + (responseBody.length > 300 ? '...' : '');
          console.log(`[Proxy] Response body preview:`, preview);
        } catch (e) {
          console.error('[Proxy] Error parsing response body:', e);
        }
      });
    }
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
