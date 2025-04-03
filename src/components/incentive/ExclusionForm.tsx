
import React from 'react';
import { Exclusion } from '@/types/incentiveTypes';
import RuleCondition from './RuleCondition';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

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
    <div className="border rounded-md p-4 bg-app-gray-50">
      <div className="flex flex-col space-y-4">
        <div>
          <span className="text-sm text-app-gray-600 mb-2 block">Exclude when:</span>
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
            <p className="text-sm text-app-gray-500 mt-1">{exclusion.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExclusionForm;
