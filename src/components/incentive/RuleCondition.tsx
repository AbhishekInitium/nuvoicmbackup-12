
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RuleCondition } from '@/types/incentiveTypes';
import { OPERATORS, DB_FIELDS } from '@/constants/incentiveConstants';

interface RuleConditionComponentProps {
  condition: RuleCondition;
  currencySymbol: string;
  availableFields?: string[];
  onUpdate: (field: keyof RuleCondition, value: string | number) => void;
  onRemove: () => void;
}

const RuleConditionComponent: React.FC<RuleConditionComponentProps> = ({
  condition,
  currencySymbol,
  availableFields = [],
  onUpdate,
  onRemove
}) => {
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
          {fieldOptions.map(field => (
            <SelectItem key={field} value={field}>{field}</SelectItem>
          ))}
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
        type="text" 
        className="w-36"
        value={condition.value || ''}
        onChange={(e) => {
          const value = e.target.value;
          // Try to parse as number if possible
          const numValue = parseFloat(value);
          onUpdate('value', isNaN(numValue) ? value : numValue);
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
