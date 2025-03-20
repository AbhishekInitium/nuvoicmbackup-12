
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiTesterHeaderProps {
  onShowHelp: () => void;
}

const ApiTesterHeader: React.FC<ApiTesterHeaderProps> = ({ onShowHelp }) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">SAP API Tester</h1>
      <p className="text-gray-500 mb-4">
        Test your SAP API endpoints before implementing them in your application.
      </p>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Important: The proxy server must be running</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            To successfully connect to SAP APIs, you must run both the development 
            server and the proxy server together using:
          </p>
          <p className="bg-muted p-2 rounded text-sm font-mono">node start-with-proxy.js</p>
          <p>
            You can enter either a path like <code className="bg-muted px-1 py-0.5 rounded-sm text-sm">/sap/opu/odata/sap/API_SERVICE/Entity</code> or a 
            full URL like <code className="bg-muted px-1 py-0.5 rounded-sm text-sm">https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SERVICE/Entity</code>
          </p>
          <p>
            For OData services, add <code className="bg-muted px-1 py-0.5 rounded-sm text-sm">$format=json</code> as a parameter and 
            <code className="bg-muted px-1 py-0.5 rounded-sm text-sm">{"Content-Type": "application/json", "Accept": "application/json"}</code> as headers.
          </p>
          <p>
            Use the Raw/Formatted toggle to view the response in different formats:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Raw:</strong> Shows the complete API response exactly as returned by SAP</li>
            <li><strong>Formatted:</strong> Detects OData format and displays in a readable table when possible</li>
          </ul>
          <Button 
            variant="link" 
            onClick={onShowHelp}
            className="p-0 h-auto text-blue-500 font-normal"
          >
            View formatting tips
          </Button>
        </AlertDescription>
      </Alert>
    </>
  );
};

export default ApiTesterHeader;
