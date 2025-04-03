
import React from 'react';
import { Adjustment } from '@/types/incentiveTypes';
import RuleCondition from './RuleCondition';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADJUSTMENT_TYPES } from '@/constants/incentiveConstants';

interface AdjustmentFormProps {
  adjustment: Adjustment;
  dbFields: string[];
  currencySymbol: string;
  onUpdate: (field: keyof Adjustment, value: any) => void;
  onRemove: () => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const AdjustmentForm: React.FC<AdjustmentFormProps> = ({
  adjustment,
  dbFields,
  currencySymbol,
  onUpdate,
  onRemove,
  selectedScheme,
  kpiMetadata
}) => {
  // Handle condition update
  const handleConditionUpdate = (field: string, value: string | number) => {
    // Create a copy of the current condition
    const updatedCondition = { ...adjustment.condition, [field]: value };
    onUpdate('condition', updatedCondition);
    
    // If this is a field update and we have metadata, also update description and other metadata fields
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
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <div className="flex items-center space-x-4">
              <Select
                value={adjustment.type}
                onValueChange={(value) => onUpdate('type', value)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Adjustment Type" />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">by</span>
                <Input
                  type="number"
                  className="w-20"
                  value={adjustment.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    onUpdate('value', isNaN(value) ? 0 : value);
                  }}
                />
                
                <span className="text-sm">
                  {adjustment.type === 'percentage' ? '%' : currencySymbol}
                </span>
              </div>
            </div>
            
            {adjustment.description && (
              <p className="text-sm text-app-gray-500 mt-1">{adjustment.description}</p>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <span className="text-sm text-app-gray-600 mb-2 block">When:</span>
          <RuleCondition
            condition={adjustment.condition}
            availableFields={dbFields}
            currencySymbol={currencySymbol}
            onUpdate={handleConditionUpdate}
            onRemove={onRemove}
            selectedScheme={selectedScheme}
            kpiMetadata={kpiMetadata}
          />
        </div>
      </div>
    </div>
  );
};

export default AdjustmentForm;
