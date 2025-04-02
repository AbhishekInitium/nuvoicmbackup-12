
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import GlassCard from '../ui-custom/GlassCard';
import { Exclusion } from '@/types/incentiveTypes';
import { OPERATORS } from '@/constants/incentiveConstants';

interface ExclusionFormProps {
  exclusion: Exclusion;
  index: number;
  dbFields: string[];
  onUpdate: (index: number, field: keyof Exclusion, value: string | number) => void;
  onRemove: (index: number) => void;
  getFieldDataType?: (fieldName: string) => string;
}

const ExclusionForm: React.FC<ExclusionFormProps> = ({
  exclusion,
  index,
  dbFields,
  onUpdate,
  onRemove,
  getFieldDataType
}) => {
  const [dataType, setDataType] = useState<string>('Decimal');
  
  // Update data type when field changes
  useEffect(() => {
    if (getFieldDataType && exclusion.field) {
      setDataType(getFieldDataType(exclusion.field));
    }
  }, [exclusion.field, getFieldDataType]);

  // Format value based on data type
  const formatValue = (value: any): string | number => {
    if (value === undefined || value === null) return '';
    return String(value);
  };

  const handleValueChange = (value: string) => {
    let processedValue: string | number = value;

    if (dataType === 'Int8' || dataType === 'Decimal') {
      const numValue = value === '' ? 0 : parseFloat(value);
      if (!isNaN(numValue)) {
        processedValue = numValue;
      }
    }

    onUpdate(index, 'value', processedValue);
  };

  return (
    <GlassCard key={index} variant="outlined" className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
            <Select 
              value={exclusion.field}
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
          
          <div>
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
            <Select 
              value={exclusion.operator}
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
          
          <div>
            <label className="block text-sm font-medium text-app-gray-700 mb-2">
              Value
              {dataType && <span className="ml-1 text-xs text-app-gray-400">({dataType})</span>}
            </label>
            <Input 
              type={dataType === 'Decimal' || dataType === 'Int8' ? "number" : "text"}
              value={formatValue(exclusion.value)}
              onChange={(e) => handleValueChange(e.target.value)}
              step={dataType === 'Decimal' ? "0.01" : "1"}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
            <Input 
              type="text" 
              value={exclusion.description}
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

export default ExclusionForm;
