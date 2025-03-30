
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StorageNoticeProps {
  schemeId: string;
  versionNumber: number;
  isEditMode: boolean;
}

const StorageNotice: React.FC<StorageNoticeProps> = ({ 
  schemeId, 
  versionNumber, 
  isEditMode 
}) => {
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription>
        Your scheme has been {isEditMode ? 'saved as a new version' : 'saved'} in MongoDB with the ID: {schemeId}. 
        The scheme is {isEditMode ? `now version ${versionNumber}` : 'set to DRAFT status'}.
      </AlertDescription>
    </Alert>
  );
};

export default StorageNotice;
