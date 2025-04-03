
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

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
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-app-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <h3 className="text-lg font-medium text-app-gray-700 mb-2">{message}</h3>
      <p className="text-sm text-app-gray-500 text-center max-w-md mb-6">{description}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onAction}
        className="flex items-center gap-2"
      >
        <PlusCircle size={16} /> {buttonText}
      </Button>
    </div>
  );
};

export default EmptyRulesState;
