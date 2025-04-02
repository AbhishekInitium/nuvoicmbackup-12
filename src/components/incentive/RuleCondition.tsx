
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RuleCondition } from '@/types/incentiveTypes';
import { OPERATORS, DB_FIELDS } from '@/constants/incentiveConstants';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';

interface RuleConditionComponentProps {
  condition: RuleCondition;
  currencySymbol: string;
  availableFields?: string[];
  onUpdate: (field: keyof RuleCondition, value: string | number) => void;
  onRemove: () => void;
  selectedScheme?: SchemeAdminConfig | null;
}

const RuleConditionComponent: React.FC<RuleConditionComponentProps> = ({
  condition,
  currencySymbol,
  availableFields = [],
  onUpdate,
  onRemove,
  selectedScheme
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

  // Get data type for the selected field
  const getFieldDataType = (fieldName: string): string => {
    if (!selectedScheme) return 'Char10'; // Default to text if no scheme
    
    // Look for the field in all KPI collections
    const allKpis = [
      ...(selectedScheme.qualificationFields || []),
      ...(selectedScheme.adjustmentFields || []),
      ...(selectedScheme.exclusionFields || []),
      ...(selectedScheme.customRules || [])
    ];
    
    const fieldConfig = allKpis.find(kpi => kpi.kpi === fieldName);
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

  const dataType = getFieldDataType(condition.field || '');
  const inputType = getInputTypeForDataType(dataType);

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
        type={inputType}
        className="w-36 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={condition.value || ''}
        onChange={(e) => {
          const value = e.target.value;
          
          // Parse value according to type
          if (inputType === 'number') {
            const numValue = parseFloat(value);
            onUpdate('value', isNaN(numValue) ? 0 : numValue);
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
