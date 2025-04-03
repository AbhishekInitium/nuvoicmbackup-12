
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { MeasurementRules as MeasurementRulesType, IncentivePlan } from '@/types/incentiveTypes';
import { useMeasurementRules } from '@/hooks/useMeasurementRules';
import PrimaryMetricSelector from './PrimaryMetricSelector';
import AdjustmentsList from './AdjustmentsList';
import ExclusionsList from './ExclusionsList';
import EmptyRulesState from './EmptyRulesState';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';

interface MeasurementRulesProps {
  plan: IncentivePlan;
  updatePlan: (field: string, value: any) => void;
  isReadOnly?: boolean;
  selectedScheme?: SchemeAdminConfig | null;
}

const MeasurementRules: React.FC<MeasurementRulesProps> = ({
  plan,
  updatePlan,
  isReadOnly = false,
  selectedScheme
}) => {
  const currency = plan.currency;
  const currencySymbol = getCurrencySymbol(currency);
  
  // Use the selected scheme from the plan if not directly provided
  const schemeConfig = selectedScheme || plan.selectedSchemeConfig;

  const {
    rules,
    getDbFields,
    getKpiMetadata,
    addPrimaryMetric,
    updatePrimaryMetric,
    removePrimaryMetric,
    addAdjustment,
    updateAdjustment,
    removeAdjustment,
    addExclusion,
    updateExclusion,
    removeExclusion
  } = useMeasurementRules(
    plan.measurementRules, 
    plan.revenueBase, 
    (updatedRules) => updatePlan('measurementRules', updatedRules),
    schemeConfig
  );

  // Debug logs
  console.log("MeasurementRules Component - Plan:", plan);
  console.log("MeasurementRules Component - Selected scheme:", schemeConfig);
  
  // Get fields for each category
  const qualificationFields = getDbFields('qualification');
  const adjustmentFields = getDbFields('adjustment');
  const exclusionFields = getDbFields('exclusion');
  const kpiMetadata = getKpiMetadata();

  return (
    <SectionPanel title="3. Measurement Rules" defaultExpanded={true}>
      <div className="space-y-8">
        {/* Primary Metrics Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-app-gray-700">
              Qualifying Criteria
            </label>
            {!isReadOnly && (
              <ActionButton
                variant="outline"
                size="sm"
                onClick={addPrimaryMetric}
              >
                <PlusCircle size={16} className="mr-1" /> Add Criteria
              </ActionButton>
            )}
          </div>

          {rules.primaryMetrics.length === 0 ? (
            <EmptyRulesState
              message="No qualifying criteria defined"
              description="Add criteria to determine when a transaction qualifies for incentive"
              buttonText="Add Qualifying Criteria"
              onAction={!isReadOnly ? addPrimaryMetric : undefined}
            />
          ) : (
            <div className="space-y-4">
              {rules.primaryMetrics.map((metric, index) => (
                <PrimaryMetricSelector
                  key={index}
                  primaryMetrics={[metric]}
                  dbFields={qualificationFields}
                  currencySymbol={currencySymbol}
                  kpiMetadata={kpiMetadata}
                  onAddMetric={() => {}}
                  onUpdateMetric={!isReadOnly ? (field, value) => updatePrimaryMetric(index, field, value) : () => {}}
                  onRemoveMetric={!isReadOnly ? () => removePrimaryMetric(index) : () => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Adjustments */}
        <AdjustmentsList
          adjustments={rules.adjustments}
          dbFields={adjustmentFields}
          kpiMetadata={kpiMetadata}
          onUpdateAdjustment={!isReadOnly ? updateAdjustment : () => {}}
          onRemoveAdjustment={!isReadOnly ? removeAdjustment : () => {}}
          onAddAdjustment={!isReadOnly ? addAdjustment : undefined}
          currencySymbol={currencySymbol}
          isReadOnly={isReadOnly}
        />

        {/* Exclusions */}
        <ExclusionsList
          exclusions={rules.exclusions}
          dbFields={exclusionFields}
          kpiMetadata={kpiMetadata}
          onUpdateExclusion={!isReadOnly ? updateExclusion : () => {}}
          onRemoveExclusion={!isReadOnly ? removeExclusion : () => {}}
          onAddExclusion={!isReadOnly ? addExclusion : undefined}
          isReadOnly={isReadOnly}
        />
      </div>
    </SectionPanel>
  );
};

// Import SectionPanel for the component
import SectionPanel from '../ui-custom/SectionPanel';

export default MeasurementRules;
