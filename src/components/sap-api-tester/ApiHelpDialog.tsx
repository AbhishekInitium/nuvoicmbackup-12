
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApiHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiHelpDialog: React.FC<ApiHelpDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>SAP API Testing Guide</DialogTitle>
          <DialogDescription>
            How to successfully connect to and test SAP APIs
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basics">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4">
            <div>
              <h3 className="font-semibold">Starting the Proxy Server</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Always start the application with the proxy server to handle CORS and authentication:
              </p>
              <pre className="bg-muted p-2 rounded mt-2 text-sm overflow-x-auto">
                node start-with-proxy.js
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">URL Formats</h3>
              <div className="space-y-2 mt-2">
                <p className="text-sm"><strong>Path only:</strong></p>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                  /sap/opu/odata/sap/API_SALESORGANIZATION_SRV/A_SalesOrganization
                </pre>
                
                <p className="text-sm"><strong>Full URL:</strong></p>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                  https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SALESORGANIZATION_SRV/A_SalesOrganization
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold">Common Request Parameters:</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
                <li><code className="bg-muted px-1 rounded">$format=json</code> - Request JSON format response</li>
                <li><code className="bg-muted px-1 rounded">$top=10</code> - Limit results to 10 items</li>
                <li><code className="bg-muted px-1 rounded">$skip=10</code> - Skip the first 10 results</li>
                <li><code className="bg-muted px-1 rounded">$filter=PropertyName eq 'Value'</code> - Filter results</li>
                <li><code className="bg-muted px-1 rounded">$select=Property1,Property2</code> - Select specific properties</li>
                <li><code className="bg-muted px-1 rounded">$expand=NavigationProperty</code> - Expand related entities</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div>
              <h3 className="font-semibold">Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The API Tester supports Basic Auth with the SAP credentials.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Headers</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Common headers used with SAP OData APIs:
              </p>
              <pre className="bg-muted p-2 rounded mt-2 text-sm overflow-x-auto">
{`{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "sap-client": "100"
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">OData Filter Examples</h3>
              <div className="space-y-2 mt-2 text-sm">
                <p><strong>Equal to:</strong></p>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                  $filter=SalesOrganization eq '1000'
                </pre>
                
                <p><strong>Greater than:</strong></p>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                  $filter=TotalNetAmount gt 1000
                </pre>
                
                <p><strong>Multiple conditions:</strong></p>
                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                  $filter=SalesOrganization eq '1000' and CreationDate gt datetime'2023-01-01T00:00:00'
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="troubleshooting" className="space-y-4">
            <div>
              <h3 className="font-semibold">Network Errors</h3>
              <p className="text-sm text-muted-foreground mt-1">
                If you see "Network Error" messages:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                <li>Ensure the proxy server is running with <code>node start-with-proxy.js</code></li>
                <li>Check your network connection</li>
                <li>Verify the SAP system is accessible (try in browser)</li>
                <li>Make sure you're using the proxy option (enabled by default)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Authentication Errors</h3>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                <li>Ensure your SAP username and password are correct</li>
                <li>Check that the "Use Authentication" switch is enabled</li>
                <li>Verify you have access to the specific API endpoint</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Invalid JSON Errors</h3>
              <p className="text-sm text-muted-foreground mt-1">
                When entering JSON in the headers, params, or body fields:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                <li>Ensure all property names are in double quotes</li>
                <li>Check for missing commas or extra commas</li>
                <li>Verify brackets and braces are properly matched</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Testing Proxy Connection</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To verify the proxy server is running correctly:
              </p>
              <pre className="bg-muted p-2 rounded mt-2 text-sm overflow-x-auto">
                http://localhost:5000/api/test
              </pre>
              <p className="text-sm text-muted-foreground mt-1">
                You should see a JSON response confirming the proxy is working.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ApiHelpDialog;
