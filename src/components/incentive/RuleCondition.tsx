
import React from 'react';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RuleCondition } from '@/types/incentiveTypes';
import { OPERATORS, METRICS, TIME_PERIODS } from '@/constants/incentiveConstants';
import { Input } from "@/components/ui/input";

interface RuleConditionProps {
  condition: RuleCondition;
  currencySymbol: string;
  onUpdate: (field: keyof RuleCondition, value: string | number) => void;
  onRemove: () => void;
}

const RuleConditionComponent: React.FC<RuleConditionProps> = ({
  condition,
  currencySymbol,
  onUpdate,
  onRemove
}) => {
  return (
    <div className="p-3 border border-app-gray-200 rounded-lg bg-app-gray-50 bg-opacity-50">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
          <div className="sm:col-span-3">
            <Select 
              value={condition.period || 'current'}
              onValueChange={(value) => onUpdate('period', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map(period => (
                  <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-3">
            <Select 
              value={condition.metric || ''}
              onValueChange={(value) => onUpdate('metric', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map(metric => (
                  <SelectItem key={metric.value} value={metric.value}>{metric.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-2">
            <Select 
              value={condition.operator}
              onValueChange={(value) => onUpdate('operator', value)}
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
            <Input 
              type="number" 
              value={condition.value}
              onChange={(e) => onUpdate('value', parseFloat(e.target.value))}
              step="0.01"
            />
          </div>
          
          <div className="sm:col-span-1 flex justify-end">
            <button 
              className="p-1 rounded-full hover:bg-app-gray-200 text-app-gray-500 hover:text-app-red transition-colors duration-200"
              onClick={onRemove}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleConditionComponent;
