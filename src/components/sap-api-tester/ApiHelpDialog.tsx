
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ApiHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiHelpDialog: React.FC<ApiHelpDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Testing Tips</DialogTitle>
          <DialogDescription>
            How to format your API requests correctly
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">When using proxy (recommended):</h3>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>You can use either full URLs or relative paths</li>
              <li>Example path: <code className="bg-muted px-1 rounded">/sap/opu/odata/sap/API_SERVICE/Entity</code></li>
              <li>Example URL: <code className="bg-muted px-1 rounded">https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SERVICE/Entity</code></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">When not using proxy:</h3>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>You must use full URLs including the protocol (https://)</li>
              <li>CORS issues may prevent direct access from the browser</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Common request parameters:</h3>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><code className="bg-muted px-1 rounded">$format=json</code> - Request JSON format response</li>
              <li><code className="bg-muted px-1 rounded">$top=10</code> - Limit results to 10 items</li>
              <li><code className="bg-muted px-1 rounded">$filter=PropertyName eq 'Value'</code> - Filter results</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiHelpDialog;
