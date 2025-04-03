
import React from 'react';
import { PrimaryMetric } from '@/types/incentiveTypes';
import RuleCondition from './RuleCondition'; 
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  dbFields: string[];
  currencySymbol: string;
  onAddMetric: () => void;
  onUpdateMetric: (index: number, field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: (index: number) => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({ 
  primaryMetrics, 
  dbFields, 
  currencySymbol,
  onAddMetric, 
  onUpdateMetric, 
  onRemoveMetric,
  selectedScheme,
  kpiMetadata
}) => {
  // Handle condition updates with explicit index
  const handleMetricUpdate = (index: number, field: keyof PrimaryMetric, value: string | number) => {
    console.log(`Updating metric ${index}, field: ${String(field)}, value: ${value}`);
    onUpdateMetric(index, field, value);
  };

  return (
    <div className="space-y-4">
      {primaryMetrics.length === 0 ? (
        <p className="text-sm text-app-gray-500 italic">No qualification criteria defined</p>
      ) : (
        primaryMetrics.map((metric, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <RuleCondition
                  condition={metric}
                  availableFields={dbFields}
                  currencySymbol={currencySymbol}
                  onUpdate={(field, value) => handleMetricUpdate(index, field, value)}
                  onRemove={() => onRemoveMetric(index)}
                  selectedScheme={selectedScheme}
                  kpiMetadata={kpiMetadata}
                />
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveMetric(index)}
                className="text-app-gray-500 hover:text-app-red ml-2"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            {metric.description && (
              <p className="text-xs text-app-gray-500 mt-1 ml-1">
                {metric.description}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PrimaryMetricSelector;
