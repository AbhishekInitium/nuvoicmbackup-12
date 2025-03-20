
# SAP Proxy Server Setup

This application includes a proxy server to handle CORS issues when connecting to SAP systems.

## Running with Proxy

To start both the development server and the proxy server:

```bash
node start-with-proxy.js
```

## How It Works

The proxy server:
1. Runs on port 5000 by default
2. Forwards all `/api/sap/*` requests to the SAP backend
3. Handles CORS headers automatically
4. Preserves authentication headers

## Configuring the Proxy

To change the SAP backend URL or other settings:
1. Edit `src/proxy/proxyServer.js`
2. Update the `target` property in the `createProxyMiddleware` configuration

## Debugging

The proxy server logs all requests and errors. Check the console output for:
- Request path and method
- Where requests are being forwarded
- Any errors that occur

## Production Deployment

For production, you should set up a more robust proxy solution:
1. Deploy the proxy server to a cloud provider
2. Update the `S4_API_BASE_URL` in `s4BaseService.ts` to point to your deployed proxy
3. Ensure proper security measures are in place

Alternatively, consider asking your SAP administrator to configure CORS headers on the SAP system directly.
