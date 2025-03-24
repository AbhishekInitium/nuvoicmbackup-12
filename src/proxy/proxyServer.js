const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  next();
});

// SAP S/4HANA Cloud API base URL
const SAP_BASE_URL = 'https://my418390-api.s4hana.cloud.sap';

// Test endpoint to verify the proxy server is working
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Proxy server is working correctly!',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Direct proxy to SAP endpoints
app.use('/api/sap', createProxyMiddleware({
  target: SAP_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/sap': '' // rewrites /api/sap/... to /...
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[SAP Proxy] Forwarding request to: ${SAP_BASE_URL}${req.originalUrl.replace('/api/sap', '')}`);
    
    // If custom auth header not provided, use default auth
    if (!proxyReq.getHeader('Authorization')) {
      // Using hardcoded credentials for now - in production use environment variables
      const auth = 'Basic ' + Buffer.from('S4HANA_BASIC:GGWYYnbPqPWmpcuCHt9zuht<NFnlkbQYJEHvkfLi').toString('base64');
      proxyReq.setHeader('Authorization', auth);
    }
    
    // Add SAP client cookie if not present
    if (!proxyReq.getHeader('Cookie') || !proxyReq.getHeader('Cookie').includes('sap-client')) {
      const cookie = proxyReq.getHeader('Cookie') || '';
      proxyReq.setHeader('Cookie', `${cookie}${cookie ? '; ' : ''}sap-usercontext=sap-client=080`);
    }
    
    // Set Accept header if not present
    if (!proxyReq.getHeader('Accept')) {
      proxyReq.setHeader('Accept', 'application/json');
    }
    
    console.log('[SAP Proxy] Request headers:', proxyReq.getHeaders());
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[SAP Proxy] Response status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[SAP Proxy] Error:', err);
    res.status(500).json({
      success: false,
      message: 'Proxy Error',
      error: err.message
    });
  }
}));

// URL validator middleware
const validateTargetUrl = (req, res, next) => {
  try {
    // Handle target URL from query parameter - No decoding
    if (req.query.targetUrl) {
      const targetUrl = req.query.targetUrl; // No decodeURIComponent here
      console.log(`[Proxy] Target URL: ${targetUrl}`);
      
      try {
        // Parse the URL to validate it
        const parsedUrl = new URL(targetUrl);
        req.targetUrl = targetUrl;
        req.targetOrigin = parsedUrl.origin;
        req.targetPath = parsedUrl.pathname + (parsedUrl.search || '');
        
        console.log(`[Proxy] Will forward to: ${req.targetOrigin} with path: ${req.targetPath}`);
      } catch (error) {
        console.error('[Proxy] Error parsing URL:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format',
          error: error.message
        });
      }
    } else {
      // No target URL provided
      return res.status(400).json({
        success: false,
        message: 'No target URL provided'
      });
    }
    next();
  } catch (error) {
    console.error('[Proxy] Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in URL validation',
      error: error.message
    });
  }
};

// Apply URL validator middleware to target proxy route
app.use('/api/proxy', validateTargetUrl);

// Dynamic proxy middleware
app.use('/api/proxy', (req, res, next) => {
  if (!req.targetUrl || !req.targetOrigin) {
    return res.status(400).json({
      success: false,
      message: 'Target URL not properly validated'
    });
  }
  
  // Create proxy middleware on the fly for this specific request
  const proxy = createProxyMiddleware({
    target: req.targetOrigin,
    changeOrigin: true,
    pathRewrite: (path) => req.targetPath,
    onProxyReq: (proxyReq, req) => {
      // Forward all headers from the original request
      Object.keys(req.headers).forEach(key => {
        // Skip host header to avoid conflicts
        if (key.toLowerCase() !== 'host') {
          proxyReq.setHeader(key, req.headers[key]);
        }
      });
      
      console.log(`[Proxy] Forwarding to: ${req.targetOrigin}${req.targetPath}`);
      console.log(`[Proxy] With headers:`, req.headers);
      
      // If this is a POST/PUT/PATCH with a body, we need to restream it
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the response for debugging
      console.log(`[Proxy] Response from ${req.targetOrigin}: ${proxyRes.statusCode}`);
      console.log(`[Proxy] Response headers:`, proxyRes.headers);
      
      // Store the original response data for logging/debugging
      let responseBody = '';
      const originalWrite = res.write;
      const originalEnd = res.end;
      
      proxyRes.on('data', (chunk) => {
        responseBody += chunk.toString('utf8');
      });
      
      proxyRes.on('end', () => {
        try {
          if (proxyRes.headers['content-type']?.includes('application/json')) {
            console.log(`[Proxy] Response body preview:`, responseBody.substring(0, 300));
          }
        } catch (e) {
          console.error('[Proxy] Error processing response:', e);
        }
      });
    },
    onError: (err, req, res) => {
      console.error('[Proxy] Error during proxy request:', err);
      res.status(500).json({
        success: false,
        message: 'Proxy Error',
        error: err.message,
        code: err.code
      });
    }
  });
  
  // Apply the dynamically configured proxy to this request
  proxy(req, res, next);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('Proxy server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ SAP Proxy server running on http://localhost:${PORT}`);
  console.log(`Test endpoint available at: http://localhost:${PORT}/api/test`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`SAP API proxy available at: http://localhost:${PORT}/api/sap/...`);
});
