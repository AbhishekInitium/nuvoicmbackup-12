
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Exclusion } from '@/types/incentiveTypes';
import RuleCondition from './RuleCondition';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import { Button } from '@/components/ui/button';

interface ExclusionFormProps {
  exclusion: Exclusion;
  dbFields: string[];
  onUpdate: (field: keyof Exclusion, value: any) => void;
  onRemove: () => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const ExclusionForm: React.FC<ExclusionFormProps> = ({
  exclusion,
  dbFields,
  onUpdate,
  onRemove,
  selectedScheme,
  kpiMetadata
}) => {
  // Handle condition update
  const handleConditionUpdate = (field: string, value: string | number) => {
    // Create a copy of the current condition
    const updatedCondition = { ...exclusion.condition, [field]: value };
    onUpdate('condition', updatedCondition);

    // If this is a field update and we have metadata, also update description
    if (field === 'field' && kpiMetadata && kpiMetadata[value as string]) {
      const metadata = kpiMetadata[value as string];
      if (metadata.description) {
        onUpdate('description', metadata.description);
      }
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-app-gray-700 mb-2">Exclude when:</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove} 
            className="text-app-gray-500 hover:text-app-red"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        
        <div>
          <RuleCondition
            condition={exclusion.condition}
            availableFields={dbFields}
            currencySymbol="$" // Not used for exclusions but required by the component
            onUpdate={handleConditionUpdate}
            onRemove={onRemove}
            selectedScheme={selectedScheme}
            kpiMetadata={kpiMetadata}
          />
          
          {exclusion.description && (
            <p className="text-sm text-app-gray-500 mt-2">{exclusion.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExclusionForm;
