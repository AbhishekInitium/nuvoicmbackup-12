
import React from 'react';
import { Button } from '../ui/button';
import { Save, Upload } from 'lucide-react';

interface SavePlanButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isEditMode?: boolean;
  isDisabled?: boolean;
}

const SavePlanButton: React.FC<SavePlanButtonProps> = ({ 
  onClick,
  isLoading,
  isEditMode = false,
  isDisabled = false
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading || isDisabled}
      className="min-w-[120px]"
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isEditMode ? "Saving..." : "Creating..."}
        </span>
      ) : (
        <span className="flex items-center">
          {isEditMode ? (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              Create Scheme
            </>
          )}
        </span>
      )}
    </Button>
  );
};

export default SavePlanButton;
