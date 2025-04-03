
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RuleCondition } from '@/types/incentiveTypes';
import { OPERATORS, DB_FIELDS } from '@/constants/incentiveConstants';
import { KpiField } from '@/types/schemeAdminTypes';

interface RuleConditionComponentProps {
  condition: RuleCondition;
  currencySymbol: string;
  availableFields?: string[];
  kpiMetadata?: Record<string, KpiField>;
  onUpdate: (field: keyof RuleCondition, value: string | number) => void;
  onRemove: () => void;
}

const RuleConditionComponent: React.FC<RuleConditionComponentProps> = ({
  condition,
  currencySymbol,
  availableFields = [],
  kpiMetadata,
  onUpdate,
  onRemove
}) => {
  const [inputType, setInputType] = useState<string>("text");
  
  // Get field options from DB_FIELDS or use provided availableFields
  const getFieldOptions = () => {
    if (availableFields && availableFields.length > 0) {
      return availableFields;
    }
    
    // Fallback to default fields from constant
    const allFields = Object.values(DB_FIELDS).flat();
    return [...new Set(allFields.map(field => field.value))];
  };
  
  const fieldOptions = getFieldOptions();

  // Set input type based on field data type
  useEffect(() => {
    if (condition.field && kpiMetadata && kpiMetadata[condition.field]) {
      const dataType = kpiMetadata[condition.field].dataType;
      
      // Determine input type based on the dataType
      switch(dataType?.toLowerCase()) {
        case 'number':
        case 'decimal':
        case 'integer':
        case 'int8':
          setInputType('number');
          break;
        case 'date':
          setInputType('date');
          break;
        case 'boolean':
          setInputType('checkbox');
          break;
        case 'char1':
        case 'char2':
        case 'char3':
        case 'char4':
        case 'char':
        case 'char10':
        case 'string':
        default:
          setInputType('text');
          break;
      }
    }
  }, [condition.field, kpiMetadata]);

  return (
    <div className="flex items-center space-x-3">
      <Select 
        value={condition.field || ''}
        onValueChange={(value) => onUpdate('field', value)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {fieldOptions.map(field => {
            // Get the display name from metadata if available
            const displayName = kpiMetadata && kpiMetadata[field] 
              ? kpiMetadata[field].description || field 
              : field;
            return (
              <SelectItem key={field} value={field}>{displayName}</SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      
      <Select 
        value={condition.operator || '>'}
        onValueChange={(value) => onUpdate('operator', value)}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map(op => (
            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input 
        type={inputType}
        className="w-36"
        value={condition.value || ''}
        onChange={(e) => {
          const value = e.target.value;
          
          // Only try to parse as number if input type is number
          if (inputType === 'number') {
            const numValue = parseFloat(value);
            onUpdate('value', isNaN(numValue) ? value : numValue);
          } else {
            onUpdate('value', value);
          }
        }}
      />
      
      <button 
        className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red"
        onClick={onRemove}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default RuleConditionComponent;
