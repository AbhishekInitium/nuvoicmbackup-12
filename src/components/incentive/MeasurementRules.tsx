
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { MeasurementRules as MeasurementRulesType } from '@/types/incentiveTypes';
import { useMeasurementRules } from '@/hooks/useMeasurementRules';

// Import smaller components
import PrimaryMetricSelector from './PrimaryMetricSelector';
import QualificationInput from './QualificationInput';
import AdjustmentsList from './AdjustmentsList';
import ExclusionsList from './ExclusionsList';

interface MeasurementRulesProps {
  measurementRules: MeasurementRulesType;
  revenueBase: string;
  currency: string;
  updateMeasurementRules: (updatedRules: MeasurementRulesType) => void;
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
    updateMinQualification,
    addAdjustment,
    updateAdjustment,
    removeAdjustment,
    addExclusion,
    updateExclusion,
    removeExclusion
  } = useMeasurementRules(measurementRules, revenueBase, updateMeasurementRules);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        <PrimaryMetricSelector
          primaryMetrics={rules.primaryMetrics}
          onAddMetric={addPrimaryMetric}
          onUpdateMetric={updatePrimaryMetric}
          onRemoveMetric={removePrimaryMetric}
        />
        
        <QualificationInput
          primaryMetric={rules.primaryMetrics.length > 0 ? rules.primaryMetrics[0].name : "revenue"}
          minQualification={rules.minQualification}
          currencySymbol={currencySymbol}
          onMinQualificationChange={updateMinQualification}
        />
      </div>
      
      <div className="section-divider"></div>
      
      <Tabs defaultValue="adjustments" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="adjustments">Adjustment Factors</TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="adjustments" className="mt-0">
          <AdjustmentsList
            adjustments={rules.adjustments}
            dbFields={getDbFields()}
            onAddAdjustment={addAdjustment}
            onUpdateAdjustment={updateAdjustment}
            onRemoveAdjustment={removeAdjustment}
          />
        </TabsContent>
        
        <TabsContent value="exclusions" className="mt-0">
          <ExclusionsList
            exclusions={rules.exclusions}
            dbFields={getDbFields()}
            onAddExclusion={addExclusion}
            onUpdateExclusion={updateExclusion}
            onRemoveExclusion={removeExclusion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeasurementRules;
