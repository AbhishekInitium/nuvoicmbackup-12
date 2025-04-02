
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { Exclusion } from '@/types/incentiveTypes';
import ExclusionForm from './ExclusionForm';

interface ExclusionsListProps {
  exclusions: Exclusion[];
  dbFields: string[];
  onAddExclusion: () => void;
  onUpdateExclusion: (index: number, field: keyof Exclusion, value: string | number) => void;
  onRemoveExclusion: (index: number) => void;
  getFieldDataType?: (fieldName: string) => string;
}

const ExclusionsList: React.FC<ExclusionsListProps> = ({
  exclusions,
  dbFields,
  onAddExclusion,
  onUpdateExclusion,
  onRemoveExclusion,
  getFieldDataType
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-app-gray-700">Exclusions</h3>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={onAddExclusion}
        >
          <PlusCircle size={16} className="mr-1" /> Add Exclusion
        </ActionButton>
      </div>
      
      {exclusions.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-app-gray-500">No exclusions defined yet</p>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onAddExclusion}
            className="mx-auto mt-4"
          >
            <PlusCircle size={16} className="mr-1" /> Add Exclusion
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-4">
          {exclusions.map((exclusion, index) => (
            <ExclusionForm
              key={index}
              exclusion={exclusion}
              index={index}
              dbFields={dbFields}
              onUpdate={onUpdateExclusion}
              onRemove={onRemoveExclusion}
              getFieldDataType={getFieldDataType}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ExclusionsList;
