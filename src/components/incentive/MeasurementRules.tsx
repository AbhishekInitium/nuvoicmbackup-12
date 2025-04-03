
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import SectionPanel from '../ui-custom/SectionPanel';
import { IncentivePlan, MeasurementRules as MeasurementRulesType, PrimaryMetric } from '@/types/incentiveTypes';
import ActionButton from '../ui-custom/ActionButton';
import PrimaryMetricSelector from './PrimaryMetricSelector';
import AdjustmentsList from './AdjustmentsList';
import ExclusionsList from './ExclusionsList';
import { Input } from "@/components/ui/input";
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';
import { v4 as uuidv4 } from 'uuid';

interface MeasurementRulesProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
  isReadOnly?: boolean;
  selectedScheme?: SchemeAdminConfig | null;
}

const MeasurementRules: React.FC<MeasurementRulesProps> = ({ 
  plan,
  updatePlan,
  isReadOnly = false,
  selectedScheme
}) => {
  const [localMeasurementRules, setLocalMeasurementRules] = useState<MeasurementRulesType>({
    primaryMetrics: [],
    minQualification: 0,
    adjustments: [],
    exclusions: []
  });
  
  const currencySymbol = getCurrencySymbol(plan.currency);
  
  useEffect(() => {
    if (plan.measurementRules) {
      setLocalMeasurementRules(plan.measurementRules);
    }
  }, [plan.measurementRules]);
  
  // Function to get fields for a specific category from the selected scheme
  const getDbFields = (category: 'qualification' | 'adjustment' | 'exclusion') => {
    if (!selectedScheme) return [];
    
    let fields: KpiField[] = [];
    
    switch (category) {
      case 'qualification':
        fields = selectedScheme.qualificationFields || [];
        break;
      case 'adjustment':
        fields = selectedScheme.adjustmentFields || [];
        break;
      case 'exclusion':
        fields = selectedScheme.exclusionFields || [];
        break;
    }
    
    console.log(`Fields for category ${category}:`, fields);
    
    // Extract KPI names and filter out empty strings
    const kpiNames = fields
      .map(field => field.kpi)
      .filter(kpi => kpi !== undefined && kpi !== '');
    
    console.log(`getDbFields for ${category}:`, kpiNames);
    return kpiNames;
  };
  
  // Function to get KPI metadata
  const getKpiMetadata = () => {
    if (!selectedScheme) return {};
    
    const metadata: Record<string, KpiField> = {};
    
    // Include qualification fields
    if (selectedScheme.qualificationFields?.length) {
      selectedScheme.qualificationFields.forEach(field => {
        if (field.kpi) {  // Ensure kpi is not empty
          metadata[field.kpi] = field;
        }
      });
    }
    
    // Include adjustment fields
    if (selectedScheme.adjustmentFields?.length) {
      selectedScheme.adjustmentFields.forEach(field => {
        if (field.kpi) {  // Ensure kpi is not empty
          metadata[field.kpi] = field;
        }
      });
    }
    
    // Include exclusion fields
    if (selectedScheme.exclusionFields?.length) {
      selectedScheme.exclusionFields.forEach(field => {
        if (field.kpi) {  // Ensure kpi is not empty
          metadata[field.kpi] = field;
        }
      });
    }
    
    return metadata;
  };
  
  // Get the available fields and metadata
  const qualificationFields = getDbFields('qualification');
  const adjustmentFields = getDbFields('adjustment');
  const exclusionFields = getDbFields('exclusion');
  const kpiMetadata = getKpiMetadata();
  
  // Update the parent component with the local changes
  const updateMeasurementRules = (updatedRules: MeasurementRulesType) => {
    setLocalMeasurementRules(updatedRules);
    updatePlan('measurementRules', updatedRules);
  };
  
  // Handle minimum qualification threshold change
  const handleMinQualificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const updatedRules = {
      ...localMeasurementRules,
      minQualification: isNaN(value) ? 0 : value
    };
    updateMeasurementRules(updatedRules);
  };
  
  // Add a new primary metric
  const handleAddPrimaryMetric = () => {
    console.log("Adding new primary metric");
    const newMetric: PrimaryMetric = {
      id: uuidv4(),
      field: qualificationFields.length > 0 ? qualificationFields[0] : "default_field",
      operator: ">",
      value: 0,
      description: "New qualifying criteria"
    };
    
    const updatedRules = {
      ...localMeasurementRules,
      primaryMetrics: [...localMeasurementRules.primaryMetrics, newMetric]
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Update a primary metric
  const handleUpdateMetric = (index: number, field: keyof PrimaryMetric, value: string | number) => {
    const updatedMetrics = [...localMeasurementRules.primaryMetrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    
    const updatedRules = {
      ...localMeasurementRules,
      primaryMetrics: updatedMetrics
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Remove a primary metric
  const handleRemoveMetric = (index: number) => {
    const updatedMetrics = [...localMeasurementRules.primaryMetrics];
    updatedMetrics.splice(index, 1);
    
    const updatedRules = {
      ...localMeasurementRules,
      primaryMetrics: updatedMetrics
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Add adjustment
  const handleAddAdjustment = () => {
    const newAdjustment = {
      id: uuidv4(),
      field: adjustmentFields.length > 0 ? adjustmentFields[0] : "default_field",
      operator: "=",
      value: "",
      description: "New adjustment"
    };
    
    const updatedRules = {
      ...localMeasurementRules,
      adjustments: [...localMeasurementRules.adjustments, newAdjustment]
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Update adjustment
  const handleUpdateAdjustment = (index: number, field: keyof any, value: string | number) => {
    const updatedAdjustments = [...localMeasurementRules.adjustments];
    updatedAdjustments[index] = { ...updatedAdjustments[index], [field]: value };
    
    const updatedRules = {
      ...localMeasurementRules,
      adjustments: updatedAdjustments
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Remove adjustment
  const handleRemoveAdjustment = (index: number) => {
    const updatedAdjustments = [...localMeasurementRules.adjustments];
    updatedAdjustments.splice(index, 1);
    
    const updatedRules = {
      ...localMeasurementRules,
      adjustments: updatedAdjustments
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Add exclusion
  const handleAddExclusion = () => {
    const newExclusion = {
      id: uuidv4(),
      field: exclusionFields.length > 0 ? exclusionFields[0] : "default_field",
      operator: "=",
      value: "",
      description: "New exclusion"
    };
    
    const updatedRules = {
      ...localMeasurementRules,
      exclusions: [...localMeasurementRules.exclusions, newExclusion]
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Update exclusion
  const handleUpdateExclusion = (index: number, field: keyof any, value: string | number) => {
    const updatedExclusions = [...localMeasurementRules.exclusions];
    updatedExclusions[index] = { ...updatedExclusions[index], [field]: value };
    
    const updatedRules = {
      ...localMeasurementRules,
      exclusions: updatedExclusions
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  // Remove exclusion
  const handleRemoveExclusion = (index: number) => {
    const updatedExclusions = [...localMeasurementRules.exclusions];
    updatedExclusions.splice(index, 1);
    
    const updatedRules = {
      ...localMeasurementRules,
      exclusions: updatedExclusions
    };
    
    updateMeasurementRules(updatedRules);
  };
  
  return (
    <SectionPanel title="4. Measurement Rules" defaultExpanded={true}>
      <div className="space-y-6">
        {/* Qualifying Criteria */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Qualification Criteria</h3>
            {!isReadOnly && (
              <ActionButton
                variant="outline"
                size="sm"
                onClick={handleAddPrimaryMetric}
                type="button"
              >
                <PlusCircle size={16} className="mr-1" /> Add Criteria
              </ActionButton>
            )}
          </div>
          
          <div className="space-y-4">
            {localMeasurementRules.primaryMetrics.map((metric, index) => (
              <PrimaryMetricSelector
                key={metric.id || index}
                metric={metric}
                metricIndex={index}
                dbFields={qualificationFields}
                kpiMetadata={kpiMetadata}
                onUpdateMetric={handleUpdateMetric}
                onRemoveMetric={handleRemoveMetric}
                isReadOnly={isReadOnly}
              />
            ))}
            
            {localMeasurementRules.primaryMetrics.length === 0 && (
              <div className="text-app-gray-500 italic">No qualification criteria defined</div>
            )}
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-app-gray-700 mb-2">
              Minimum Qualification Threshold ({currencySymbol})
            </label>
            {isReadOnly ? (
              <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                {currencySymbol}{localMeasurementRules.minQualification || 0}
              </div>
            ) : (
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-app-gray-500">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  value={localMeasurementRules.minQualification || 0}
                  onChange={handleMinQualificationChange}
                  className="pl-7"
                  disabled={isReadOnly}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Adjustments */}
        <AdjustmentsList
          adjustments={localMeasurementRules.adjustments}
          dbFields={adjustmentFields}
          kpiMetadata={kpiMetadata}
          onUpdateAdjustment={handleUpdateAdjustment}
          onRemoveAdjustment={handleRemoveAdjustment}
          onAddAdjustment={handleAddAdjustment}
          currencySymbol={currencySymbol}
          isReadOnly={isReadOnly}
        />
        
        {/* Exclusions */}
        <ExclusionsList
          exclusions={localMeasurementRules.exclusions}
          dbFields={exclusionFields}
          kpiMetadata={kpiMetadata}
          onUpdateExclusion={handleUpdateExclusion}
          onRemoveExclusion={handleRemoveExclusion}
          onAddExclusion={handleAddExclusion}
          currencySymbol={currencySymbol}
          isReadOnly={isReadOnly}
        />
      </div>
    </SectionPanel>
  );
};

export default MeasurementRules;
