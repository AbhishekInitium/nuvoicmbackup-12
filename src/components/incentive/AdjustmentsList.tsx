
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Adjustment } from '@/types/incentiveTypes';
import AdjustmentForm from './AdjustmentForm';
import ActionButton from '../ui-custom/ActionButton';
import EmptyRulesState from './EmptyRulesState';
import { KpiField } from '@/types/schemeAdminTypes';

interface AdjustmentsListProps {
  adjustments: Adjustment[];
  dbFields: string[];
  kpiMetadata?: Record<string, KpiField>;
  onUpdateAdjustment: (index: number, field: keyof Adjustment, value: string | number) => void;
  onRemoveAdjustment: (index: number) => void;
  onAddAdjustment: () => void;
  currencySymbol: string;
}

const AdjustmentsList: React.FC<AdjustmentsListProps> = ({
  adjustments,
  dbFields,
  kpiMetadata,
  onUpdateAdjustment,
  onRemoveAdjustment,
  onAddAdjustment,
  currencySymbol
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-app-gray-700">Adjustment Rules</h3>
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
          message="No adjustment rules defined"
          description="Add adjustments to modify base commission values"
          buttonText="Add Adjustment"
          onAction={onAddAdjustment}
        />
      ) : (
        <div className="space-y-4">
          {adjustments.map((adjustment, index) => (
            <AdjustmentForm
              key={adjustment.id}
              adjustment={adjustment}
              adjustmentIndex={index}
              dbFields={dbFields}
              kpiMetadata={kpiMetadata}
              currencySymbol={currencySymbol}
              onUpdateAdjustment={onUpdateAdjustment}
              onRemoveAdjustment={onRemoveAdjustment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdjustmentsList;
