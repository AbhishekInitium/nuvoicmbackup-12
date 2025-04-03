
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Exclusion } from '@/types/incentiveTypes';
import ActionButton from '../ui-custom/ActionButton';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import EmptyRulesState from './EmptyRulesState';
import ExclusionForm from './ExclusionForm';

interface ExclusionsListProps {
  exclusions: Exclusion[];
  dbFields: string[];
  onUpdateExclusion: (index: number, field: keyof Exclusion, value: any) => void;
  onRemoveExclusion: (index: number) => void;
  onAddExclusion: () => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const ExclusionsList: React.FC<ExclusionsListProps> = ({
  exclusions,
  dbFields,
  onUpdateExclusion,
  onRemoveExclusion,
  onAddExclusion,
  selectedScheme,
  kpiMetadata
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-app-gray-700">
          Exclusions
        </label>
        <ActionButton
          variant="outline"
          size="sm"
          onClick={onAddExclusion}
        >
          <PlusCircle size={16} className="mr-1" /> Add Exclusion
        </ActionButton>
      </div>
      
      {exclusions.length === 0 ? (
        <EmptyRulesState
          message="No exclusions defined"
          description="Add exclusions to identify transactions that should be excluded"
          buttonText="Add Exclusion"
          onAction={onAddExclusion}
        />
      ) : (
        <div className="space-y-4">
          {exclusions.map((exclusion, index) => (
            <ExclusionForm
              key={index}
              exclusion={exclusion}
              dbFields={dbFields}
              onUpdate={(field, value) => onUpdateExclusion(index, field, value)}
              onRemove={() => onRemoveExclusion(index)}
              selectedScheme={selectedScheme}
              kpiMetadata={kpiMetadata}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExclusionsList;
