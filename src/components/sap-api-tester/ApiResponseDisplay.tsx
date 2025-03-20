
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [viewMode, setViewMode] = useState<'raw' | 'formatted'>('raw');

  // A function to detect if the response follows OData format
  const isODataResponse = (data: any): boolean => {
    return (
      data && 
      (data['@odata.context'] !== undefined || 
       data.d !== undefined || 
       data.value !== undefined)
    );
  };

  // Function to try to extract array data from OData responses
  const extractArrayData = (data: any): any[] | null => {
    if (!data) return null;
    
    // OData V4 format with 'value' array
    if (Array.isArray(data.value)) {
      return data.value;
    }
    
    // OData V2 format with d.results array
    if (data.d && Array.isArray(data.d.results)) {
      return data.d.results;
    }
    
    // OData V2 format without results (direct entity)
    if (data.d && typeof data.d === 'object') {
      return [data.d];
    }
    
    return null;
  };

  // Shows metadata properties for OData responses
  const renderODataMetadata = (data: any) => {
    if (!data) return null;
    
    const metadataEntries = Object.entries(data)
      .filter(([key]) => key.startsWith('@odata') || key === '__metadata');
    
    if (metadataEntries.length === 0) return null;
    
    return (
      <Card className="mb-4 bg-slate-50 border-slate-200">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-semibold">OData Metadata</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1 text-xs">
            {metadataEntries.map(([key, value]) => (
              <div key={key} className="grid grid-cols-2">
                <span className="font-medium">{key}:</span>
                <span className="text-slate-600">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Display the original, unmodified response to ensure we see the exact API output
  return (
    <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Response</h2>
        {response && (
          <div className="flex space-x-2">
            <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as 'raw' | 'formatted')}>
              <TabsList>
                <TabsTrigger value="raw">Raw</TabsTrigger>
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Expand View</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Full API Response</DialogTitle>
                </DialogHeader>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
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
          
          {viewMode === 'raw' ? (
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">Raw Response:</span> Showing exactly what was returned by the API
              </div>
              <pre className="text-sm overflow-auto max-h-[400px] whitespace-pre-wrap bg-slate-100 p-4 rounded-md">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          ) : isODataResponse(response) ? (
            <div>
              {/* Display metadata if available */}
              {renderODataMetadata(response)}
              
              {/* Display array data in a table if possible */}
              {extractArrayData(response) ? (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Formatted Response:</span> Found {extractArrayData(response)?.length} items in the response
                  </div>
                  <div className="overflow-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {extractArrayData(response)?.[0] && 
                            Object.keys(extractArrayData(response)[0])
                              .filter(key => !key.startsWith('@') && key !== '__metadata')
                              .map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                              ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extractArrayData(response)?.map((item, index) => (
                          <TableRow key={index}>
                            {Object.entries(item)
                              .filter(([key]) => !key.startsWith('@') && key !== '__metadata')
                              .map(([key, value]) => (
                                <TableCell key={key}>
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Formatted Response:</span> Single entity or custom format
                  </div>
                  <pre className="text-sm overflow-auto max-h-[400px] whitespace-pre-wrap bg-slate-100 p-4 rounded-md">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                <span className="font-medium">Response:</span> Non-OData format
              </div>
              <pre className="text-sm overflow-auto max-h-[400px] whitespace-pre-wrap bg-slate-100 p-4 rounded-md">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {!showResponse && !error && (
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <p>Send a request to see the response here</p>
        </div>
      )}
    </div>
  );
};

export default ApiResponseDisplay;
