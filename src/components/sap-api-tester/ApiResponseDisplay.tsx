
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ApiResponseDisplayProps {
  response: any;
  error: string | null;
  showResponse: boolean;
  loading: boolean;
}

const ApiResponseDisplay: React.FC<ApiResponseDisplayProps> = ({
  response,
  error,
  showResponse,
  loading
}) => {
  // Format the response by extracting the actual data
  const formatResponse = (responseData: any) => {
    if (!responseData) return null;
    
    // For OData responses, the actual data is often in the "d" or "value" property
    if (responseData.d) {
      // OData V2 format
      return responseData.d.results ? responseData.d.results : responseData.d;
    } else if (responseData.value) {
      // OData V4 format
      return responseData.value;
    } else {
      // Return the original response if we can't determine the format
      return responseData;
    }
  };

  // Get the formatted response data
  const formattedResponse = formatResponse(response);
  
  // Display the raw response in the dialog, but the formatted data in the main view
  return (
    <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Response</h2>
        {response && (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Raw Response</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Raw API Response</DialogTitle>
                </DialogHeader>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Formatted Response</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Formatted API Response</DialogTitle>
                </DialogHeader>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(formattedResponse, null, 2)}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          {error.includes('Network Error') && (
            <div className="mt-2 p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">Troubleshooting tips:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Make sure the proxy server is running. Try running <code>node start-with-proxy.js</code></li>
                <li>Check that your SAP credentials are correct</li>
                <li>Confirm the endpoint URL is valid and accessible</li>
                <li>Browser security policies may be blocking cross-origin requests</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {showResponse && !error && (
        <div className="p-4 rounded-md bg-muted">
          <p className="font-medium mb-2">Status: {loading ? 'Sending...' : 'Success'}</p>
          
          {formattedResponse && Array.isArray(formattedResponse) ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Found {formattedResponse.length} items in the response</p>
              <div className="overflow-auto h-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {formattedResponse.length > 0 && Object.keys(formattedResponse[0]).map((key) => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formattedResponse.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(item).map((value: any, valIndex) => (
                          <td key={valIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <pre className="text-sm overflow-auto h-[500px] whitespace-pre-wrap">
              {JSON.stringify(formattedResponse || response, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      {!showResponse && !error && (
        <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
          <p>Send a request to see the response here</p>
        </div>
      )}
    </div>
  );
};

export default ApiResponseDisplay;
