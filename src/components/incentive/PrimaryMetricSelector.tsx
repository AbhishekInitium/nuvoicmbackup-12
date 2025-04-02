
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PrimaryMetric } from '@/types/incentiveTypes';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  dbFields: string[];
  currencySymbol: string;
  onAddMetric: () => void;
  onUpdateMetric: (field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: () => void;
  getFieldDataType?: (fieldName: string) => string;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  primaryMetrics,
  dbFields,
  currencySymbol,
  onUpdateMetric,
  onRemoveMetric,
  getFieldDataType
}) => {
  const metric = primaryMetrics[0];
  const [dataType, setDataType] = useState<string>('Decimal');

  useEffect(() => {
    if (getFieldDataType && metric.field) {
      const fieldDataType = getFieldDataType(metric.field);
      setDataType(fieldDataType);
    }
  }, [metric.field, getFieldDataType]);

  // Handle input based on data type
  const handleValueChange = (value: string) => {
    let processedValue: string | number = value;

    if (dataType === 'Int8' || dataType === 'Decimal') {
      // Convert to number but prevent invalid input
      const numValue = value === '' ? 0 : parseFloat(value);
      if (!isNaN(numValue)) {
        processedValue = numValue;
      } else {
        return; // Invalid number input, don't update
      }
    } else if (dataType === 'Currency') {
      // Handle currency - remove currency symbol if present and convert to number
      const numValue = value.replace(currencySymbol, '').trim();
      const parsedValue = parseFloat(numValue);
      if (!isNaN(parsedValue)) {
        processedValue = parsedValue;
      } else {
        return; // Invalid currency input, don't update
      }
    }

    onUpdateMetric('value', processedValue);
  };

  // Format display value based on data type
  const formatDisplayValue = (value: number | string): string => {
    if (dataType === 'Currency' && typeof value === 'number') {
      return `${currencySymbol}${value}`;
    }
    return String(value);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-sm font-medium text-app-gray-700 mb-1">Field</label>
          <Select
            value={metric.field || ''}
            onValueChange={(value) => {
              onUpdateMetric('field', value);
              if (getFieldDataType) {
                setDataType(getFieldDataType(value));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {dbFields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto flex-1 sm:max-w-[150px]">
          <label className="block text-sm font-medium text-app-gray-700 mb-1">Operator</label>
          <Select
            value={metric.operator || '>'}
            onValueChange={(value) => onUpdateMetric('operator', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=">">Greater than (&gt;)</SelectItem>
              <SelectItem value=">=">Greater than or equal (&ge;)</SelectItem>
              <SelectItem value="<">Less than (&lt;)</SelectItem>
              <SelectItem value="<=">Less than or equal (&le;)</SelectItem>
              <SelectItem value="=">Equal (=)</SelectItem>
              <SelectItem value="!=">Not equal (&ne;)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto flex-1 sm:max-w-[180px]">
          <label className="block text-sm font-medium text-app-gray-700 mb-1">
            Value 
            <span className="ml-1 text-xs text-app-gray-400">({dataType})</span>
          </label>
          <Input
            value={formatDisplayValue(metric.value || 0)}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Value"
            className="w-full"
          />
        </div>

        <div className="w-full sm:w-auto flex-1">
          <label className="block text-sm font-medium text-app-gray-700 mb-1">Description</label>
          <Input
            value={metric.description || ''}
            onChange={(e) => onUpdateMetric('description', e.target.value)}
            placeholder="e.g., Net Revenue threshold"
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-app-gray-500 hover:text-app-red mb-1"
            onClick={onRemoveMetric}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PrimaryMetricSelector;
