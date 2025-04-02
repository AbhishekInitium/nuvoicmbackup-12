
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import GlassCard from '../ui-custom/GlassCard';
import { Adjustment } from '@/types/incentiveTypes';
import { OPERATORS } from '@/constants/incentiveConstants';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';

interface AdjustmentFormProps {
  adjustment: Adjustment;
  index: number;
  dbFields: string[];
  onUpdate: (index: number, field: keyof Adjustment, value: string | number) => void;
  onRemove: (index: number) => void;
  selectedScheme?: SchemeAdminConfig | null;
}

const AdjustmentForm: React.FC<AdjustmentFormProps> = ({
  adjustment,
  index,
  dbFields,
  onUpdate,
  onRemove,
  selectedScheme
}) => {
  // Get data type for the selected field
  const getFieldDataType = (fieldName: string): string => {
    if (!selectedScheme) return 'Char10'; // Default to text if no scheme
    
    // Look for the field in adjustment fields
    const fieldConfig = selectedScheme.adjustmentFields?.find(kpi => kpi.kpi === fieldName);
    return fieldConfig?.dataType || 'Char10'; // Default to text if not found
  };

  // Determine input type based on data type
  const getInputTypeForDataType = (dataType: string) => {
    switch(dataType) {
      case 'Int8':
      case 'Decimal':
      case 'Currency':
        return 'number';
      case 'Date':
        return 'date';
      default:
        return 'text';
    }
  };

  const dataType = getFieldDataType(adjustment.field || '');
  const inputType = getInputTypeForDataType(dataType);

  return (
    <GlassCard key={index} variant="outlined" className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
            <Select 
              value={adjustment.field || ''}
              onValueChange={(value) => onUpdate(index, 'field', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {dbFields.map(field => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
            <Select 
              value={adjustment.operator || ''}
              onValueChange={(value) => onUpdate(index, 'operator', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map(op => (
                  <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
            <Input 
              type={inputType}
              value={adjustment.value || 0}
              onChange={(e) => {
                let value = e.target.value;
                
                // Parse value according to type
                if (inputType === 'number') {
                  const numValue = parseFloat(value);
                  onUpdate(index, 'value', isNaN(numValue) ? 0 : numValue);
                } else {
                  onUpdate(index, 'value', value);
                }
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Factor</label>
            <Input 
              type="number" 
              step="0.01"
              value={adjustment.factor || 1}
              onChange={(e) => onUpdate(index, 'factor', parseFloat(e.target.value))}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
            <Input 
              type="text" 
              value={adjustment.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
            />
          </div>
        </div>
        
        <button 
          className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200 ml-3"
          onClick={() => onRemove(index)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </GlassCard>
  );
};

export default AdjustmentForm;
