
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PrimaryMetric } from '@/types/incentiveTypes';
import GlassCard from '../ui-custom/GlassCard';
import { OPERATORS } from '@/constants/incentiveConstants';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  dbFields: string[];
  currencySymbol: string;
  onAddMetric: () => void;
  onUpdateMetric: (field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: () => void;
  selectedScheme?: SchemeAdminConfig | null;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  primaryMetrics,
  dbFields,
  currencySymbol,
  onAddMetric,
  onUpdateMetric,
  onRemoveMetric,
  selectedScheme
}) => {
  // Since we're working with a single metric at a time
  const metric = primaryMetrics[0];

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

  const dataType = getFieldDataType(metric.field);
  const inputType = getInputTypeForDataType(dataType);

  return (
    <GlassCard variant="outlined" className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
            <Select 
              value={metric.field}
              onValueChange={(value) => onUpdateMetric('field', value)}
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
          
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
            <Select 
              value={metric.operator}
              onValueChange={(value) => onUpdateMetric('operator', value)}
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
          
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
            <Input 
              type={inputType}
              value={metric.value}
              onChange={(e) => {
                let value = e.target.value;
                
                // Parse value according to type
                if (inputType === 'number') {
                  const numValue = parseFloat(value);
                  onUpdateMetric('value', isNaN(numValue) ? 0 : numValue);
                } else {
                  onUpdateMetric('value', value);
                }
              }}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
            <Input 
              type="text" 
              value={metric.description}
              onChange={(e) => onUpdateMetric('description', e.target.value)}
              placeholder="Describe this criteria"
            />
          </div>
        </div>
        
        <button 
          className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200 ml-3"
          onClick={onRemoveMetric}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </GlassCard>
  );
};

export default PrimaryMetricSelector;
