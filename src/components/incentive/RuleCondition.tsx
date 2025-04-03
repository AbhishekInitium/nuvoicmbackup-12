
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RuleCondition } from '@/types/incentiveTypes';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

// Define operators directly in the component since they were missing from constants
const OPERATORS = [
  { value: '>', label: 'Greater than' },
  { value: '>=', label: 'Greater than or equal to' },
  { value: '<', label: 'Less than' },
  { value: '<=', label: 'Less than or equal to' },
  { value: '=', label: 'Equal to' },
  { value: '!=', label: 'Not equal to' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' }
];

interface RuleConditionComponentProps {
  condition: RuleCondition;
  currencySymbol: string;
  availableFields?: string[];
  onUpdate: (field: keyof RuleCondition, value: string | number) => void;
  onRemove: () => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const RuleConditionComponent: React.FC<RuleConditionComponentProps> = ({
  condition,
  currencySymbol,
  availableFields = [],
  onUpdate,
  onRemove,
  selectedScheme,
  kpiMetadata
}) => {
  // Get field options from DB_FIELDS or use provided availableFields
  const getFieldOptions = () => {
    if (availableFields && availableFields.length > 0) {
      return availableFields;
    }
    
    // Fallback to a basic set of fields if no constants or availableFields
    return ['sales', 'revenue', 'quantity', 'margin', 'product'];
  };
  
  const fieldOptions = getFieldOptions();

  // Get data type for the selected field
  const getFieldDataType = (fieldName: string): string => {
    // First check the kpiMetadata (most accurate and complete)
    if (kpiMetadata && kpiMetadata[fieldName]) {
      return kpiMetadata[fieldName].dataType;
    }
    
    // Fallback to scheme config if available
    if (selectedScheme) {
      // Look for the field in all KPI collections
      const allKpis = [
        ...(selectedScheme.qualificationFields || []),
        ...(selectedScheme.adjustmentFields || []),
        ...(selectedScheme.exclusionFields || []),
        ...(selectedScheme.customRules || [])
      ];
      
      const fieldConfig = allKpis.find(kpi => kpi.kpi === fieldName);
      if (fieldConfig) {
        return fieldConfig.dataType;
      }
    }
    
    // Default to text if not found
    return 'Char10';
  };

  // Handle field selection with metadata
  const handleFieldSelect = (fieldName: string) => {
    console.log("Field selected:", fieldName);
    // First update the field name
    onUpdate('field', fieldName);
    
    // If we have metadata for this field, copy all the relevant properties
    if (kpiMetadata && kpiMetadata[fieldName]) {
      const metadata = kpiMetadata[fieldName];
      
      // Update other properties with metadata
      if (metadata.description) {
        onUpdate('description', metadata.description);
      }
      
      if (metadata.sourceType) {
        onUpdate('sourceType', metadata.sourceType);
      }
      
      if (metadata.sourceField) {
        onUpdate('sourceField', metadata.sourceField);
      }
      
      // Include the dataType in the condition for future reference
      if (metadata.dataType) {
        onUpdate('dataType', metadata.dataType);
      }
    }
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

  // Helper to find the operator label
  const getOperatorLabel = (operatorValue: string): string => {
    if (!operatorValue) return '';
    const op = OPERATORS.find(op => op.value === operatorValue);
    return op ? op.label : operatorValue;
  };

  return (
    <div className="flex items-center space-x-3">
      <Select 
        value={condition.field || ""}
        onValueChange={handleFieldSelect}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Select field">
            {condition.field || "Select field"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {fieldOptions.map(field => (
            <SelectItem key={field} value={field}>{field}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={condition.operator || ""}
        onValueChange={(value) => onUpdate('operator', value)}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Operator">
            {getOperatorLabel(condition.operator || "")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
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
