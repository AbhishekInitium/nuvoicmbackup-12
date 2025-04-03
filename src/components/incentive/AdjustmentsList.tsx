
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Adjustment } from '@/types/incentiveTypes';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import EmptyRulesState from './EmptyRulesState';
import AdjustmentForm from './AdjustmentForm';
import { Button } from '../ui/button';

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
      {adjustments.length === 0 ? (
        <EmptyRulesState
          message="No adjustments defined"
          description="Add adjustments to modify how certain transactions are treated"
          buttonText="Add Adjustment"
          onAction={onAddAdjustment}
        />
      ) : (
        <div className="space-y-4 bg-gray-50 p-4 rounded-md">
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
