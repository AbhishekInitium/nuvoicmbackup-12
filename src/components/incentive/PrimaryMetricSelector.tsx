
import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PrimaryMetric } from '@/types/incentiveTypes';
import ActionButton from '../ui-custom/ActionButton';
import GlassCard from '../ui-custom/GlassCard';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  onAddMetric: () => void;
  onUpdateMetric: (index: number, field: keyof PrimaryMetric, value: string) => void;
  onRemoveMetric: (index: number) => void;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  primaryMetrics,
  onAddMetric,
  onUpdateMetric,
  onRemoveMetric
}) => {
  const metricOptions = [
    { value: "revenue", label: "Revenue" },
    { value: "units", label: "Units Sold" },
    { value: "profit", label: "Profit Margin" },
    { value: "bookings", label: "Bookings" }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-app-gray-700">Primary Metrics</label>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={onAddMetric}
        >
          <PlusCircle size={16} className="mr-1" /> Add Metric
        </ActionButton>
      </div>
      
      {primaryMetrics.length === 0 ? (
        <div className="text-center py-6 border border-dashed rounded-lg">
          <p className="text-app-gray-500 mb-2">No primary metrics defined</p>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onAddMetric}
            className="mx-auto"
          >
            <PlusCircle size={16} className="mr-1" /> Add Metric
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-4">
          {primaryMetrics.map((metric, index) => (
            <GlassCard key={index} variant="outlined" className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-5">
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">Metric</label>
                    <Select 
                      value={metric.name}
                      onValueChange={(value) => onUpdateMetric(index, 'name', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        {metricOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-7">
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                    <Input 
                      type="text" 
                      value={metric.description}
                      onChange={(e) => onUpdateMetric(index, 'description', e.target.value)}
                      placeholder="Describe this metric"
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
      <p className="text-sm text-app-gray-500 mt-2">The primary performance metrics used for commission calculation</p>
    </div>
  );
};

export default PrimaryMetricSelector;
