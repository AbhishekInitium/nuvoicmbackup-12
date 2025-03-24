
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, Copy, Check, AlertTriangle } from 'lucide-react';

interface ApiResponseDisplayProps {
  response: any;
  error: string | null;
  showResponse: boolean;
  loading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  rawInfo?: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    time?: number;
  };
}

const ApiResponseDisplay: React.FC<ApiResponseDisplayProps> = ({
  response,
  error,
  showResponse,
  loading,
  activeTab,
  onTabChange,
  rawInfo = {}
}) => {
  const [copied, setCopied] = useState(false);

  // Function to copy response to clipboard
  const copyToClipboard = () => {
    if (!response) return;
    
    const textToCopy = typeof response === 'string' 
      ? response 
      : JSON.stringify(response, null, 2);
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Function to determine if the response is HTML
  const isHtmlResponse = (data: any): boolean => {
    if (typeof data !== 'string') return false;
    return data.trim().startsWith('<!DOCTYPE html>') || 
          data.trim().startsWith('<html') || 
          (rawInfo.headers && 
          rawInfo.headers['content-type'] && 
          rawInfo.headers['content-type'].includes('text/html'));
  };

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
      <div className="mb-4 bg-slate-50 border rounded-md p-3">
        <h3 className="text-sm font-semibold mb-2">OData Metadata</h3>
        <div className="space-y-1 text-xs">
          {metadataEntries.map(([key, value]) => (
            <div key={key} className="grid grid-cols-2">
              <span className="font-medium">{key}:</span>
              <span className="text-slate-600">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Display response body
  const renderResponseBody = () => {
    if (isHtmlResponse(response)) {
      return (
        <div>
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">HTML Response:</span> The API returned HTML instead of JSON
          </div>
          <Alert className="mb-4 border-amber-300 bg-amber-50 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>HTML Response Detected</AlertTitle>
            <AlertDescription>
              <p>The server returned HTML instead of JSON data. This may indicate:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>The API endpoint requires different authentication</li>
                <li>The endpoint doesn't support the requested format</li>
                <li>This is an error page or login page (not redirecting to it)</li>
              </ul>
            </AlertDescription>
          </Alert>
          <div className="bg-slate-100 p-4 rounded-md max-h-[400px] overflow-auto text-xs">
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        </div>
      );
    }
    
    if (isODataResponse(response)) {
      return (
        <div>
          {renderODataMetadata(response)}
          
          {extractArrayData(response) ? (
            <div>
              <div className="text-sm text-muted-foreground mb-2 flex justify-between items-center">
                <span>Found {extractArrayData(response)?.length} items in the response</span>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="overflow-auto max-h-[400px] border rounded-md">
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
              <div className="text-sm text-muted-foreground mb-2 flex justify-between items-center">
                <span>Single entity or custom format</span>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre className="text-sm overflow-auto max-h-[400px] whitespace-pre-wrap bg-slate-100 p-4 rounded-md border">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div>
        <div className="text-sm text-muted-foreground mb-2 flex justify-between items-center">
          <span>Response body</span>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="text-sm overflow-auto max-h-[400px] whitespace-pre-wrap bg-slate-100 p-4 rounded-md border">
          {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
        </pre>
      </div>
    );
  };

  // Display response headers
  const renderResponseHeaders = () => {
    if (!rawInfo.headers || Object.keys(rawInfo.headers).length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No headers available
        </div>
      );
    }
    
    return (
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(rawInfo.headers).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (!showResponse && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] border rounded-md text-muted-foreground">
        <p>Send a request to see the response here</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Status:</span>
          {loading ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Sending...
            </Badge>
          ) : error ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Error
            </Badge>
          ) : rawInfo.status ? (
            <Badge 
              variant="outline" 
              className={rawInfo.status >= 200 && rawInfo.status < 300 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"}
            >
              {rawInfo.status} {rawInfo.statusText}
            </Badge>
          ) : (
            <Badge variant="outline">Unknown</Badge>
          )}
        </div>
        
        {rawInfo.time && (
          <div className="text-sm text-muted-foreground">
            Time: {rawInfo.time}ms
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive m-4">
          <p className="font-medium">Error:</p>
          <p className="whitespace-pre-wrap">{error}</p>
          {error.includes('Network Error') && (
            <div className="mt-2 p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">Troubleshooting tips:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Make sure the proxy server is running. Try running <code>node start-with-proxy.js</code></li>
                <li>Try turning OFF the "Use Proxy Server" option for direct access to endpoints that support CORS</li>
                <li>Check that your SAP credentials are correct</li>
                <li>Confirm the endpoint URL is valid and accessible</li>
              </ul>
            </div>
          )}
          {error.includes('Redirection detected') && (
            <div className="mt-2 p-3 bg-muted rounded-md text-sm">
              <p className="font-medium">About this error:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>We prevented automatic redirection to show you this response</li>
                <li>This is likely a login page or authentication issue</li>
                <li>Check your credentials and API endpoint</li>
                <li>The HTML response below may contain more details about the issue</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {showResponse && (
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="body">
              {renderResponseBody()}
            </TabsContent>
            
            <TabsContent value="headers">
              {renderResponseHeaders()}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Card>
  );
};

export default ApiResponseDisplay;
