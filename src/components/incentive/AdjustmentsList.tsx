
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { Adjustment } from '@/types/incentiveTypes';
import AdjustmentForm from './AdjustmentForm';

interface AdjustmentsListProps {
  adjustments: Adjustment[];
  dbFields: string[];
  onAddAdjustment: () => void;
  onUpdateAdjustment: (index: number, field: keyof Adjustment, value: string | number) => void;
  onRemoveAdjustment: (index: number) => void;
  currencySymbol: string;
  getFieldDataType?: (fieldName: string) => string;
}

const AdjustmentsList: React.FC<AdjustmentsListProps> = ({
  adjustments,
  dbFields,
  onAddAdjustment,
  onUpdateAdjustment,
  onRemoveAdjustment,
  currencySymbol,
  getFieldDataType
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-app-gray-700">Adjustment Factors</h3>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={onAddAdjustment}
        >
          <PlusCircle size={16} className="mr-1" /> Add Adjustment
        </ActionButton>
      </div>
      
      {adjustments.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-app-gray-500">No adjustment factors defined yet</p>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onAddAdjustment}
            className="mx-auto mt-4"
          >
            <PlusCircle size={16} className="mr-1" /> Add Adjustment
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-4">
          {adjustments.map((adjustment, index) => (
            <AdjustmentForm
              key={index}
              adjustment={adjustment}
              index={index}
              dbFields={dbFields}
              onUpdate={onUpdateAdjustment}
              onRemove={onRemoveAdjustment}
              getFieldDataType={getFieldDataType}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AdjustmentsList;
