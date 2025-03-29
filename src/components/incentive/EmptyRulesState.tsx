
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';

export interface EmptyRulesStateProps {
  message: string;
  description: string;
  buttonText: string;
  onAction: () => void;
}

const EmptyRulesState: React.FC<EmptyRulesStateProps> = ({
  message,
  description,
  buttonText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-app-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-app-gray-700 mb-2">{message}</h3>
      <p className="text-sm text-app-gray-500 text-center max-w-md mb-6">{description}</p>
      <ActionButton
        variant="outline"
        size="sm"
        onClick={onAction}
      >
        <PlusCircle size={16} className="mr-1" /> {buttonText}
      </ActionButton>
    </div>
  );
};

export default EmptyRulesState;
