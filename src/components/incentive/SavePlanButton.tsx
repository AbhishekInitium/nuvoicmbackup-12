
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SavePlanButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

const SavePlanButton: React.FC<SavePlanButtonProps> = ({ 
  onClick, 
  isLoading, 
  isEditMode 
}) => {
  return (
    <Button
      variant="default"
      size="lg"
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center"
    >
      <Save size={18} className="mr-2" /> 
      {isLoading ? "Saving..." : isEditMode ? "Save New Version" : "Save Scheme"}
    </Button>
  );
};

export default SavePlanButton;
