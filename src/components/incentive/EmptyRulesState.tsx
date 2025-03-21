
import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyRulesStateProps {
  onAddRule: () => void;
}

const EmptyRulesState: React.FC<EmptyRulesStateProps> = ({ onAddRule }) => {
  return (
    <div className="text-center py-8 border border-dashed rounded-lg">
      <p className="text-app-gray-500">No custom rules defined yet</p>
      <button
        className="mt-4 text-app-blue hover:text-app-blue-dark font-medium flex items-center justify-center mx-auto"
        onClick={onAddRule}
      >
        <Plus size={18} className="mr-1" /> Add your first custom rule
      </button>
    </div>
  );
};

export default EmptyRulesState;
