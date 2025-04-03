
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Adjustment } from '@/types/incentiveTypes';
import ActionButton from '../ui-custom/ActionButton';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import EmptyRulesState from './EmptyRulesState';
import AdjustmentForm from './AdjustmentForm';

interface AdjustmentsListProps {
  adjustments: Adjustment[];
  dbFields: string[];
  onUpdateAdjustment: (index: number, field: keyof Adjustment, value: any) => void;
  onRemoveAdjustment: (index: number) => void;
  onAddAdjustment: () => void;
  currencySymbol: string;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const AdjustmentsList: React.FC<AdjustmentsListProps> = ({
  adjustments,
  dbFields,
  onUpdateAdjustment,
  onRemoveAdjustment,
  onAddAdjustment,
  currencySymbol,
  selectedScheme,
  kpiMetadata
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-app-gray-700">
          Adjustments
        </label>
        <ActionButton
          variant="outline"
          size="sm"
          onClick={onAddAdjustment}
        >
          <PlusCircle size={16} className="mr-1" /> Add Adjustment
        </ActionButton>
      </div>
      
      {adjustments.length === 0 ? (
        <EmptyRulesState
          message="No adjustments defined"
          description="Add adjustments to modify how certain transactions are treated"
          buttonText="Add Adjustment"
          onAction={onAddAdjustment}
        />
      ) : (
        <div className="space-y-4">
          {adjustments.map((adjustment, index) => (
            <AdjustmentForm
              key={index}
              adjustment={adjustment}
              dbFields={dbFields}
              currencySymbol={currencySymbol}
              onUpdate={(field, value) => onUpdateAdjustment(index, field, value)}
              onRemove={() => onRemoveAdjustment(index)}
              selectedScheme={selectedScheme}
              kpiMetadata={kpiMetadata}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdjustmentsList;
