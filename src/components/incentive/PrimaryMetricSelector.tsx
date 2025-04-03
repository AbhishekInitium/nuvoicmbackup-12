
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PrimaryMetric } from '@/types/incentiveTypes';
import GlassCard from '../ui-custom/GlassCard';
import { getOperatorsByDataType } from '@/constants/operatorConstants';
import { KpiField } from '@/types/schemeAdminTypes';

interface PrimaryMetricSelectorProps {
  metric: PrimaryMetric;
  metricIndex: number;
  dbFields: string[];
  kpiMetadata?: Record<string, KpiField>;
  onUpdateMetric: (index: number, field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: (index: number) => void;
  isReadOnly?: boolean;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  metric,
  metricIndex,
  dbFields,
  kpiMetadata,
  onUpdateMetric,
  onRemoveMetric,
  isReadOnly = false
}) => {
  const [inputType, setInputType] = useState<string>("text");
  const [dataType, setDataType] = useState<string | undefined>(undefined);
  
  // Safety check to ensure we have a valid field
  const safeDbFields = dbFields && dbFields.length > 0 ? 
    dbFields.filter(field => field !== undefined && field !== "") :
    ["default_field"]; // Fallback to prevent empty values
  
  // Update data type when field changes
  useEffect(() => {
    if (metric.field && kpiMetadata && kpiMetadata[metric.field]) {
      const fieldDataType = kpiMetadata[metric.field].dataType;
      setDataType(fieldDataType);
      console.log(`PrimaryMetricSelector - Getting input type for ${metric.field} with dataType ${fieldDataType}`);
      
      // Determine input type based on data type
      switch(fieldDataType?.toLowerCase()) {
        case 'number':
        case 'decimal':
        case 'integer':
        case 'int8':
        case 'float':
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
        case 'text':
        default:
          setInputType('text');
          break;
      }
    }
  }, [metric.field, kpiMetadata]);
  
  // Get operators based on data type
  const operators = getOperatorsByDataType(dataType);
  
  // For debugging
  console.log("PrimaryMetricSelector - Available fields:", dbFields);
  console.log("PrimaryMetricSelector - KPI Metadata:", kpiMetadata);
  console.log("PrimaryMetricSelector - Current metric:", metric);
  console.log("PrimaryMetricSelector - Input type:", inputType);
  console.log("PrimaryMetricSelector - Data type:", dataType);
  console.log("PrimaryMetricSelector - Operators:", operators);
  
  return (
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-4">
        <Input 
          type="text" 
          value={metric.description}
          onChange={(e) => onUpdateMetric(metricIndex, 'description', e.target.value)}
          className="text-lg font-medium border-none px-0 h-auto focus-visible:ring-0"
          placeholder="Criteria Description"
          disabled={isReadOnly}
        />
        {!isReadOnly && (
          <button 
            className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200"
            onClick={() => onRemoveMetric(metricIndex)}
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
              {metric.field}
            </div>
          ) : (
            <Select 
              value={metric.field}
              onValueChange={(value) => onUpdateMetric(metricIndex, 'field', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {safeDbFields.map((field, index) => {
                  // Get the display name from metadata if available
                  const displayName = kpiMetadata && kpiMetadata[field] 
                    ? kpiMetadata[field].description || field 
                    : field;
                  return (
                    <SelectItem key={index} value={field}>{displayName}</SelectItem>
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
              {metric.operator}
            </div>
          ) : (
            <Select 
              value={metric.operator}
              onValueChange={(value) => onUpdateMetric(metricIndex, 'operator', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {metric.value}
            </div>
          ) : (
            <Input 
              type={inputType}
              value={metric.value}
              onChange={(e) => {
                const value = e.target.value;
                
                // Only try to parse as number if input type is number
                if (inputType === 'number') {
                  const numValue = parseFloat(value);
                  onUpdateMetric(metricIndex, 'value', isNaN(numValue) ? value : numValue);
                } else {
                  onUpdateMetric(metricIndex, 'value', value);
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

export default PrimaryMetricSelector;
