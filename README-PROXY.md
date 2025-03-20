
# SAP Proxy Server Setup

This application includes a proxy server to handle CORS issues when connecting to SAP systems.

## Running with Proxy

To start both the development server and the proxy server:

```bash
node start-with-proxy.js
```

## Testing the Proxy

To verify the proxy server is working correctly:

1. Start the proxy server using the command above
2. Navigate to `http://localhost:5000/api/test` in your browser or use a tool like Postman
3. You should receive a JSON response confirming the proxy is working

## SAP API Tester Tool

The application includes a built-in API testing tool similar to Postman:

1. Start the application with the proxy server using `node start-with-proxy.js`
2. Navigate to `/api-tester` in your browser
3. Configure and test your SAP API calls directly from the browser

The API Tester allows you to:
- Select HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Specify endpoint URLs
- Add request headers
- Configure query parameters
- Add a request body for POST/PUT/PATCH requests
- Toggle authentication
- View detailed responses

## How It Works

The proxy server:
1. Runs on port 5000 by default
2. Forwards all `/api/sap/*` requests to the SAP backend
3. Handles CORS headers automatically
4. Preserves authentication headers

## Available Endpoints

- `/api/test` - Test endpoint that returns a 200 response with request details
- `/api/health` - Health check endpoint that confirms the proxy is running
- `/api/inspect-request` - Endpoint that returns details about the incoming request (useful for debugging)
- `/api/sap/*` - All requests to this path are forwarded to the SAP backend

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
