
import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface IncentiveNotificationsProps {
  showStorageNotice: boolean;
  connectionError: string | null;
  schemeId: string;
}

const IncentiveNotifications: React.FC<IncentiveNotificationsProps> = ({
  showStorageNotice,
  connectionError,
  schemeId
}) => {
  return (
    <>
      {showStorageNotice && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            Your scheme has been saved in MongoDB with the ID: {schemeId}. 
            The scheme status is set to DRAFT.
          </AlertDescription>
        </Alert>
      )}
      
      {connectionError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <span className="font-semibold">MongoDB Connection Error:</span> {connectionError}
            <p className="mt-1">Make sure the incentiveServer.cjs is running with: <code>node server/incentiveServer.cjs</code></p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default IncentiveNotifications;
