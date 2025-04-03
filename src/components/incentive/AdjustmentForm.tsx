
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Adjustment } from '@/types/incentiveTypes';
import GlassCard from '../ui-custom/GlassCard';
import { getOperatorsByDataType } from '@/constants/operatorConstants';
import { KpiField } from '@/types/schemeAdminTypes';

interface AdjustmentFormProps {
  adjustment: Adjustment;
  adjustmentIndex: number;
  dbFields: string[];
  kpiMetadata?: Record<string, KpiField>;
  currencySymbol: string;
  onUpdateAdjustment: (index: number, field: keyof Adjustment, value: string | number) => void;
  onRemoveAdjustment: (index: number) => void;
  isReadOnly?: boolean;
}

const AdjustmentForm: React.FC<AdjustmentFormProps> = ({
  adjustment,
  adjustmentIndex,
  dbFields,
  kpiMetadata,
  currencySymbol,
  onUpdateAdjustment,
  onRemoveAdjustment,
  isReadOnly = false
}) => {
  const [dataType, setDataType] = useState<string | undefined>(undefined);

  // Update data type when field changes
  useEffect(() => {
    if (adjustment.field && kpiMetadata && kpiMetadata[adjustment.field]) {
      const fieldDataType = kpiMetadata[adjustment.field].dataType;
      setDataType(fieldDataType);
      console.log(`AdjustmentForm - Setting data type for ${adjustment.field} with dataType ${fieldDataType}`);
    }
  }, [adjustment.field, kpiMetadata]);

  // Determine input type based on field data type
  const getInputType = (): string => {
    if (adjustment.field && kpiMetadata && kpiMetadata[adjustment.field]) {
      const fieldDataType = kpiMetadata[adjustment.field].dataType;
      
      switch(fieldDataType?.toLowerCase()) {
        case 'number':
        case 'decimal':
        case 'integer':
        case 'int8':
        case 'float':
          return 'number';
        case 'date':
          return 'date';
        case 'boolean':
          return 'checkbox';
        case 'char1':
        case 'char2':
        case 'char3':
        case 'char4':
        case 'char':
        case 'char10':
        case 'string':
        case 'text':
        default:
          return 'text';
      }
    }
    
    return 'text';
  };

  const inputType = getInputType();
  
  // Get operators based on data type
  const operators = getOperatorsByDataType(dataType);
  
  console.log(`Adjustment Form #${adjustmentIndex} - Available fields:`, dbFields);
  console.log(`Adjustment Form #${adjustmentIndex} - KPI Metadata:`, kpiMetadata);
  console.log(`Adjustment Form #${adjustmentIndex} - Data Type:`, dataType);
  console.log(`Adjustment Form #${adjustmentIndex} - Available operators:`, operators);

  return (
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-4">
        <Input 
          type="text" 
          value={adjustment.description}
          onChange={(e) => onUpdateAdjustment(adjustmentIndex, 'description', e.target.value)}
          className="text-lg font-medium border-none px-0 h-auto focus-visible:ring-0"
          placeholder="Adjustment Description"
          disabled={isReadOnly}
        />
        {!isReadOnly && (
          <button 
            className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200"
            onClick={() => onRemoveAdjustment(adjustmentIndex)}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {adjustment.field}
            </div>
          ) : (
            <Select 
              value={adjustment.field}
              onValueChange={(value) => onUpdateAdjustment(adjustmentIndex, 'field', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {dbFields.map(field => {
                  // Get the display name from metadata if available
                  const displayName = kpiMetadata && kpiMetadata[field] 
                    ? kpiMetadata[field].description || field 
                    : field;
                  return (
                    <SelectItem key={field} value={field || "default-field"}>{displayName}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {adjustment.operator}
            </div>
          ) : (
            <Select 
              value={adjustment.operator}
              onValueChange={(value) => onUpdateAdjustment(adjustmentIndex, 'operator', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {operators.map(op => (
                  <SelectItem key={op.value} value={op.value || "default-operator"}>{op.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {adjustment.value}
            </div>
          ) : (
            <Input 
              type={inputType}
              value={adjustment.value}
              onChange={(e) => {
                const value = e.target.value;
                
                // Only try to parse as number if input type is number
                if (inputType === 'number') {
                  const numValue = parseFloat(value);
                  onUpdateAdjustment(adjustmentIndex, 'value', isNaN(numValue) ? value : numValue);
                } else {
                  onUpdateAdjustment(adjustmentIndex, 'value', value);
                }
              }}
              step={inputType === 'number' ? "0.01" : undefined}
              disabled={isReadOnly}
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default AdjustmentForm;
