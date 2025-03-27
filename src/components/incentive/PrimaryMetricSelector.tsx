
import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PrimaryMetric } from '@/types/incentiveTypes';
import ActionButton from '../ui-custom/ActionButton';
import GlassCard from '../ui-custom/GlassCard';
import { OPERATORS } from '@/constants/incentiveConstants';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  dbFields: string[];
  currencySymbol: string;
  onAddMetric: () => void;
  onUpdateMetric: (index: number, field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: (index: number) => void;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  primaryMetrics,
  dbFields,
  currencySymbol,
  onAddMetric,
  onUpdateMetric,
  onRemoveMetric
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-app-gray-700">Qualifying Criteria</label>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={onAddMetric}
        >
          <PlusCircle size={16} className="mr-1" /> Add Criteria
        </ActionButton>
      </div>
      
      {primaryMetrics.length === 0 ? (
        <div className="text-center py-6 border border-dashed rounded-lg">
          <p className="text-app-gray-500 mb-2">No qualifying criteria defined</p>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onAddMetric}
            className="mx-auto"
          >
            <PlusCircle size={16} className="mr-1" /> Add Criteria
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-4">
          {primaryMetrics.map((metric, index) => (
            <GlassCard key={index} variant="outlined" className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
                    <Select 
                      value={metric.field}
                      onValueChange={(value) => onUpdateMetric(index, 'field', value)}
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
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
                    <Select 
                      value={metric.operator}
                      onValueChange={(value) => onUpdateMetric(index, 'operator', value)}
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
                    <div className="relative">
                      <input 
                        type="number" 
                        className="form-input pl-8 w-full"
                        value={metric.value}
                        onChange={(e) => onUpdateMetric(index, 'value', parseFloat(e.target.value))}
                        step="0.01"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-app-gray-400">{currencySymbol}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                    <Input 
                      type="text" 
                      value={metric.description}
                      onChange={(e) => onUpdateMetric(index, 'description', e.target.value)}
                      placeholder="Describe this criteria"
                    />
                  </div>
                </div>
                
                <button 
                  className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200 ml-3"
                  onClick={() => onRemoveMetric(index)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
      <p className="text-sm text-app-gray-500 mt-2">The qualifying criteria that determine eligibility for commission calculation</p>
    </div>
  );
};

export default PrimaryMetricSelector;
