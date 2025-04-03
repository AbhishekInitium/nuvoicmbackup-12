
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PrimaryMetric } from '@/types/incentiveTypes';
import GlassCard from '../ui-custom/GlassCard';
import { getOperatorsByDataType } from '@/constants/operatorConstants';
import { KpiField } from '@/types/schemeAdminTypes';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  dbFields: string[];
  currencySymbol: string;
  kpiMetadata?: Record<string, KpiField>;
  onAddMetric: () => void;
  onUpdateMetric: (field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: () => void;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  primaryMetrics,
  dbFields,
  currencySymbol,
  kpiMetadata,
  onAddMetric,
  onUpdateMetric,
  onRemoveMetric
}) => {
  // Since we're working with a single metric at a time
  const metric = primaryMetrics[0];
  const [dataType, setDataType] = useState<string | undefined>(undefined);
  
  // Update data type when field changes
  useEffect(() => {
    if (metric.field && kpiMetadata && kpiMetadata[metric.field]) {
      const fieldDataType = kpiMetadata[metric.field].dataType;
      setDataType(fieldDataType);
      console.log(`Setting data type for ${metric.field} with dataType ${fieldDataType}`);
    }
  }, [metric.field, kpiMetadata]);
  
  // Determine input type based on field data type
  const getInputType = (): string => {
    if (metric.field && kpiMetadata && kpiMetadata[metric.field]) {
      const dataType = kpiMetadata[metric.field].dataType;
      console.log(`PrimaryMetricSelector - Getting input type for ${metric.field} with dataType ${dataType}`);
      
      switch(dataType?.toLowerCase()) {
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
  
  // Debug logs
  console.log("PrimaryMetricSelector - Available fields:", dbFields);
  console.log("PrimaryMetricSelector - KPI Metadata:", kpiMetadata);
  console.log("PrimaryMetricSelector - Current metric:", metric);
  console.log("PrimaryMetricSelector - Input type:", inputType);
  console.log("PrimaryMetricSelector - Data type:", dataType);
  console.log("PrimaryMetricSelector - Operators:", operators);

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
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {dbFields.length > 0 ? (
                  dbFields.map(field => {
                    // Get the display name from metadata if available
                    const displayName = kpiMetadata && kpiMetadata[field] 
                      ? kpiMetadata[field].description || field 
                      : field;
                    return (
                      <SelectItem key={field} value={field}>{displayName}</SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-fields" disabled>No fields available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
            <Select 
              value={metric.operator}
              onValueChange={(value) => onUpdateMetric('operator', value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {operators.map(op => (
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
                const value = e.target.value;
                
                // Only try to parse as number if input type is number
                if (inputType === 'number') {
                  const numValue = parseFloat(value);
                  onUpdateMetric('value', isNaN(numValue) ? value : numValue);
                } else {
                  onUpdateMetric('value', value);
                }
              }}
              step={inputType === 'number' ? "0.01" : undefined}
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
