
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';

interface EmptyRulesStateProps {
  message: string;
  description: string;
  buttonText: string;
  onAction?: () => void;
}

const EmptyRulesState: React.FC<EmptyRulesStateProps> = ({
  message,
  description,
  buttonText,
  onAction
}) => {
  const handleAction = () => {
    console.log("EmptyRulesState - Action button clicked");
    if (typeof onAction === 'function') {
      onAction();
    }
  };

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="space-y-3">
        <p className="text-lg font-medium text-gray-700">{message}</p>
        <p className="text-gray-500">{description}</p>
        
        {onAction && (
          <div className="mt-4">
            <ActionButton 
              variant="outline" 
              size="md" 
              onClick={handleAction}
              type="button"
            >
              <PlusCircle className="mr-1 h-4 w-4" /> {buttonText}
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyRulesState;
