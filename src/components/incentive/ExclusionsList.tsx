
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Exclusion } from '@/types/incentiveTypes';
import ExclusionForm from './ExclusionForm';
import ActionButton from '../ui-custom/ActionButton';
import EmptyRulesState from './EmptyRulesState';
import { KpiField } from '@/types/schemeAdminTypes';

interface ExclusionsListProps {
  exclusions: Exclusion[];
  dbFields: string[];
  kpiMetadata?: Record<string, KpiField>;
  onUpdateExclusion: (index: number, field: keyof Exclusion, value: string | number) => void;
  onRemoveExclusion: (index: number) => void;
  onAddExclusion: () => void;
  currencySymbol?: string;
  isReadOnly?: boolean;
}

const ExclusionsList: React.FC<ExclusionsListProps> = ({
  exclusions,
  dbFields,
  kpiMetadata,
  onUpdateExclusion,
  onRemoveExclusion,
  onAddExclusion,
  currencySymbol = '$',
  isReadOnly = false
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-app-gray-700">Exclusion Rules</h3>
        {!isReadOnly && (
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onAddExclusion}
          >
            <PlusCircle size={16} className="mr-1" /> Add Exclusion
          </ActionButton>
        )}
      </div>
      
      {exclusions.length === 0 ? (
        <EmptyRulesState
          message="No exclusion rules defined"
          description="Add exclusions to filter out specific transactions"
          buttonText="Add Exclusion"
          onAction={!isReadOnly ? onAddExclusion : undefined}
        />
      ) : (
        <div className="space-y-4">
          {exclusions.map((exclusion, index) => (
            <ExclusionForm
              key={index}
              exclusion={exclusion}
              exclusionIndex={index}
              dbFields={dbFields}
              kpiMetadata={kpiMetadata}
              currencySymbol={currencySymbol}
              onUpdateExclusion={onUpdateExclusion}
              onRemoveExclusion={onRemoveExclusion}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExclusionsList;
