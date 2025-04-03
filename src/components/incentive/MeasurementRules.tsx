
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
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

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

  // Get KPI metadata as a lookup object for field properties
  const getKpiMetadata = () => {
    if (!selectedScheme?.qualificationFields?.length) return {};
    
    // Create a dictionary of KPI metadata keyed by KPI name
    const metadata: Record<string, KpiField> = {};
    selectedScheme.qualificationFields.forEach(field => {
      metadata[field.kpi] = field;
    });
    
    return metadata;
  };

  // Get fields for adjustments
  const getAdjustmentFields = () => {
    if (!selectedScheme?.adjustmentFields?.length) return getDbFields();
    
    // Use adjustment fields if available
    return selectedScheme.adjustmentFields.map(field => field.kpi);
  };

  // Get adjustment fields metadata
  const getAdjustmentMetadata = () => {
    if (!selectedScheme?.adjustmentFields?.length) return {};
    
    const metadata: Record<string, KpiField> = {};
    selectedScheme.adjustmentFields.forEach(field => {
      metadata[field.kpi] = field;
    });
    
    return metadata;
  };

  // Get fields for exclusions
  const getExclusionFields = () => {
    if (!selectedScheme?.exclusionFields?.length) return getDbFields();
    
    // Use exclusion fields if available
    return selectedScheme.exclusionFields.map(field => field.kpi);
  };

  // Get exclusion fields metadata
  const getExclusionMetadata = () => {
    if (!selectedScheme?.exclusionFields?.length) return {};
    
    const metadata: Record<string, KpiField> = {};
    selectedScheme.exclusionFields.forEach(field => {
      metadata[field.kpi] = field;
    });
    
    return metadata;
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
                kpiMetadata={getKpiMetadata()}
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
        kpiMetadata={getAdjustmentMetadata()}
        onUpdateAdjustment={updateAdjustment}
        onRemoveAdjustment={removeAdjustment}
        onAddAdjustment={addAdjustment}
        currencySymbol={currencySymbol}
      />

      {/* Exclusions */}
      <ExclusionsList
        exclusions={rules.exclusions}
        dbFields={getExclusionFields()}
        kpiMetadata={getExclusionMetadata()}
        onUpdateExclusion={updateExclusion}
        onRemoveExclusion={removeExclusion}
        onAddExclusion={addExclusion}
      />
    </div>
  );
};

export default MeasurementRules;
