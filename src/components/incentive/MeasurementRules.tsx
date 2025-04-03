
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { MeasurementRules as MeasurementRulesType } from '@/types/incentiveTypes';
import { useMeasurementRules } from '@/hooks/useMeasurementRules';
import PrimaryMetricSelector from './PrimaryMetricSelector';
import AdjustmentsList from './AdjustmentsList';
import ExclusionsList from './ExclusionsList';
import EmptyRulesState from './EmptyRulesState';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

interface MeasurementRulesProps {
  measurementRules: MeasurementRulesType;
  revenueBase: string;
  currency: string;
  updateMeasurementRules: (rules: MeasurementRulesType) => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const MeasurementRules: React.FC<MeasurementRulesProps> = ({
  measurementRules,
  revenueBase,
  currency,
  updateMeasurementRules,
  selectedScheme,
  kpiMetadata
}) => {
  const currencySymbol = getCurrencySymbol(currency);
  const {
    rules,
    getDbFields,
    addPrimaryMetric,
    updatePrimaryMetric,
    removePrimaryMetric,
    addAdjustment,
    updateAdjustment,
    removeAdjustment,
    addExclusion,
    updateExclusion,
    removeExclusion
  } = useMeasurementRules(measurementRules, revenueBase, updateMeasurementRules);

  // Get fields from the selected scheme configuration if available
  const getQualificationFields = () => {
    if (!selectedScheme?.qualificationFields?.length) return getDbFields();
    
    // Extract KPI names from qualification fields
    return selectedScheme.qualificationFields.map(field => field.kpi);
  };

  // Get fields for adjustments
  const getAdjustmentFields = () => {
    if (!selectedScheme?.adjustmentFields?.length) return getDbFields();
    
    // Use adjustment fields if available
    return selectedScheme.adjustmentFields.map(field => field.kpi);
  };

  // Get fields for exclusions
  const getExclusionFields = () => {
    if (!selectedScheme?.exclusionFields?.length) return getDbFields();
    
    // Use exclusion fields if available
    return selectedScheme.exclusionFields.map(field => field.kpi);
  };

  return (
    <div className="space-y-10">
      {/* Primary Metrics Section */}
      <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Qualifying Criteria</h3>
            <p className="text-sm text-gray-500">Define conditions that transactions must meet</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addPrimaryMetric}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} /> Add Criteria
          </Button>
        </div>

        {rules.primaryMetrics.length === 0 ? (
          <EmptyRulesState
            message="No qualifying criteria defined"
            description="Add criteria to determine when a transaction qualifies for incentive"
            buttonText="Add Qualifying Criteria"
            onAction={addPrimaryMetric}
          />
        ) : (
          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            {rules.primaryMetrics.map((metric, index) => (
              <div key={index} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                <PrimaryMetricSelector
                  primaryMetrics={[metric]}
                  dbFields={getQualificationFields()}
                  currencySymbol={currencySymbol}
                  onAddMetric={() => {}}
                  onUpdateMetric={(metricIndex, field, value) => updatePrimaryMetric(index, field, value)}
                  onRemoveMetric={() => removePrimaryMetric(index)}
                  selectedScheme={selectedScheme}
                  kpiMetadata={kpiMetadata}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjustments */}
      <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Adjustments</h3>
            <p className="text-sm text-gray-500">Modify how specific transactions are processed</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addAdjustment}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} /> Add Adjustment
          </Button>
        </div>
        
        <AdjustmentsList
          adjustments={rules.adjustments}
          dbFields={getAdjustmentFields()}
          onUpdateAdjustment={updateAdjustment}
          onRemoveAdjustment={removeAdjustment}
          onAddAdjustment={addAdjustment}
          currencySymbol={currencySymbol}
          selectedScheme={selectedScheme}
          kpiMetadata={kpiMetadata}
        />
      </div>

      {/* Exclusions */}
      <div className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exclusions</h3>
            <p className="text-sm text-gray-500">Specify transactions that should be excluded</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addExclusion}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} /> Add Exclusion
          </Button>
        </div>
        
        <ExclusionsList
          exclusions={rules.exclusions}
          dbFields={getExclusionFields()}
          onUpdateExclusion={updateExclusion}
          onRemoveExclusion={removeExclusion}
          onAddExclusion={addExclusion}
          selectedScheme={selectedScheme}
          kpiMetadata={kpiMetadata}
        />
      </div>
    </div>
  );
};

export default MeasurementRules;
