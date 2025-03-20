
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
  return (
    <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Response</h2>
        {response && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View Full Response</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>API Response</DialogTitle>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </DialogContent>
          </Dialog>
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
          <pre className="text-sm overflow-auto h-[500px] whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
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
