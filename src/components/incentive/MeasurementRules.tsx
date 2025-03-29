
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

interface MeasurementRulesProps {
  measurementRules: MeasurementRulesType;
  revenueBase: string;
  currency: string;
  updateMeasurementRules: (rules: MeasurementRulesType) => void;
}

const MeasurementRules: React.FC<MeasurementRulesProps> = ({
  measurementRules,
  revenueBase,
  currency,
  updateMeasurementRules
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
                dbFields={getDbFields()}
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
        dbFields={getDbFields()}
        onUpdateAdjustment={updateAdjustment}
        onRemoveAdjustment={removeAdjustment}
        onAddAdjustment={addAdjustment}
        currencySymbol={currencySymbol}
      />

      {/* Exclusions */}
      <ExclusionsList
        exclusions={rules.exclusions}
        dbFields={getDbFields()}
        onUpdateExclusion={updateExclusion}
        onRemoveExclusion={removeExclusion}
        onAddExclusion={addExclusion}
      />
    </div>
  );
};

export default MeasurementRules;
