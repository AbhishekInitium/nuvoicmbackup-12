
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { MeasurementRules as MeasurementRulesType } from '@/types/incentiveTypes';
import { useMeasurementRules } from '@/hooks/useMeasurementRules';
import PrimaryMetricSelector from './PrimaryMetricSelector';
import AdjustmentsList from './AdjustmentsList';
import ExclusionsList from './ExclusionsList';
import EmptyRulesState from './EmptyRulesState';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';

interface MeasurementRulesProps {
  measurementRules: MeasurementRulesType;
  revenueBase: string;
  currency: string;
  updateMeasurementRules: (rules: MeasurementRulesType) => void;
  selectedScheme?: SchemeAdminConfig | null;
}

const MeasurementRules: React.FC<MeasurementRulesProps> = ({
  measurementRules,
  revenueBase,
  currency,
  updateMeasurementRules,
  selectedScheme
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
    <div className="space-y-8">
      {/* Primary Metrics Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-app-gray-700">
            Qualifying Criteria
          </label>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={addPrimaryMetric}
          >
            <PlusCircle size={16} className="mr-1" /> Add Criteria
          </ActionButton>
        </div>

        {rules.primaryMetrics.length === 0 ? (
          <EmptyRulesState
            message="No qualifying criteria defined"
            description="Add criteria to determine when a transaction qualifies for incentive"
            buttonText="Add Qualifying Criteria"
            onAction={addPrimaryMetric}
          />
        ) : (
          <div className="space-y-4">
            {rules.primaryMetrics.map((metric, index) => (
              <PrimaryMetricSelector
                key={index}
                primaryMetrics={[metric]}
                dbFields={getQualificationFields()}
                currencySymbol={currencySymbol}
                onAddMetric={() => {}}
                onUpdateMetric={(field, value) => updatePrimaryMetric(index, field, value)}
                onRemoveMetric={() => removePrimaryMetric(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Adjustments */}
      <AdjustmentsList
        adjustments={rules.adjustments}
        dbFields={getAdjustmentFields()}
        onUpdateAdjustment={updateAdjustment}
        onRemoveAdjustment={removeAdjustment}
        onAddAdjustment={addAdjustment}
        currencySymbol={currencySymbol}
      />

      {/* Exclusions */}
      <ExclusionsList
        exclusions={rules.exclusions}
        dbFields={getExclusionFields()}
        onUpdateExclusion={updateExclusion}
        onRemoveExclusion={removeExclusion}
        onAddExclusion={addExclusion}
      />
    </div>
  );
};

export default MeasurementRules;
