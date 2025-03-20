
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
        <AlertTitle>How to use this tool</AlertTitle>
        <AlertDescription>
          You can enter either a path like <code>/sap/opu/odata/sap/API_SERVICE/Entity</code> or a 
          full URL like <code>https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SERVICE/Entity</code>.
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
