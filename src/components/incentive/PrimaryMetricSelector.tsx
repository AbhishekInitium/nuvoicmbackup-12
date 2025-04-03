
import React from 'react';
import { PrimaryMetric } from '@/types/incentiveTypes';
import RuleCondition from './RuleCondition'; 
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

interface PrimaryMetricSelectorProps {
  primaryMetrics: PrimaryMetric[];
  dbFields: string[];
  currencySymbol: string;
  onAddMetric: () => void;
  onUpdateMetric: (field: keyof PrimaryMetric, value: string | number) => void;
  onRemoveMetric: () => void;
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
  // Use the first metric as the current one
  const metric = primaryMetrics[0];

  const handleUpdate = (field: keyof PrimaryMetric, value: string | number) => {
    console.log(`Updating ${field} to:`, value);
    onUpdateMetric(field, value);
  };

  return (
    <div className="space-y-1">
      <RuleCondition
        condition={metric}
        availableFields={dbFields}
        currencySymbol={currencySymbol}
        onUpdate={handleUpdate}
        onRemove={onRemoveMetric}
        selectedScheme={selectedScheme}
        kpiMetadata={kpiMetadata}
      />
      
      {metric.description && (
        <p className="text-xs text-app-gray-500 ml-1">
          {metric.description}
        </p>
      )}
    </div>
  );
};

export default PrimaryMetricSelector;
