
import { useState, useEffect } from 'react';
import { DB_FIELDS } from '@/constants/incentiveConstants';
import { MeasurementRules, Adjustment, Exclusion, PrimaryMetric } from '@/types/incentiveTypes';
import { v4 as uuidv4 } from 'uuid';
import { KpiField } from '@/types/schemeAdminTypes';

export const useMeasurementRules = (
  initialRules: MeasurementRules | null | undefined,
  revenueBase: string,
  onUpdateRules: (rules: MeasurementRules) => void,
  selectedScheme?: any // Accept selected scheme data
) => {
  // Create a default rules object if initialRules is null or undefined
  const defaultRules: MeasurementRules = {
    primaryMetrics: [],
    minQualification: 0,
    adjustments: [],
    exclusions: []
  };
  
  // Use the provided initialRules if available, otherwise use default
  const safeInitialRules = initialRules || defaultRules;
  
  // Ensure all properties exist within the initialRules
  const normalizedInitialRules = {
    ...defaultRules,
    ...safeInitialRules,
    primaryMetrics: Array.isArray(safeInitialRules.primaryMetrics) ? safeInitialRules.primaryMetrics : [],
    adjustments: Array.isArray(safeInitialRules.adjustments) ? safeInitialRules.adjustments : [],
    exclusions: Array.isArray(safeInitialRules.exclusions) ? safeInitialRules.exclusions : []
  };

  const [rules, setRules] = useState<MeasurementRules>(normalizedInitialRules);

  // Update rules if initialRules changes
  useEffect(() => {
    // Re-normalize rules when initialRules changes
    if (initialRules === null || initialRules === undefined) {
      setRules(defaultRules);
      return;
    }
    
    const normalizedRules = {
      ...defaultRules,
      ...initialRules,
      primaryMetrics: Array.isArray(initialRules.primaryMetrics) ? initialRules.primaryMetrics : [],
      adjustments: Array.isArray(initialRules.adjustments) ? initialRules.adjustments : [],
      exclusions: Array.isArray(initialRules.exclusions) ? initialRules.exclusions : []
    };
    
    setRules(normalizedRules);
  }, [initialRules]);

  // Helper function to get KPI fields from selected scheme based on category
  const getKpiFieldsByCategory = (category: 'qualification' | 'adjustment' | 'exclusion' | 'custom'): string[] => {
    if (!selectedScheme) return [];
    
    let fields: KpiField[] = [];
    
    switch(category) {
      case 'qualification':
        fields = selectedScheme.qualificationFields || [];
        break;
      case 'adjustment':
        fields = selectedScheme.adjustmentFields || [];
        break;
      case 'exclusion':
        fields = selectedScheme.exclusionFields || [];
        break;
      case 'custom':
        fields = selectedScheme.customRules || [];
        break;
    }
    
    return fields.map(field => field.kpi);
  };

  // Helper function to get KPI metadata from selected scheme
  const getKpiMetadata = () => {
    if (!selectedScheme) return {};
    
    const metadata: Record<string, KpiField> = {};
    
    // Add all KPIs from all categories
    ['qualificationFields', 'adjustmentFields', 'exclusionFields', 'customRules'].forEach(categoryField => {
      const fields = selectedScheme[categoryField] || [];
      fields.forEach((field: KpiField) => {
        metadata[field.kpi] = field;
      });
    });
    
    return metadata;
  };

  // Helper function to get database fields based on revenue base or scheme configuration
  const getDbFields = (category?: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => {
    // If we have a selected scheme and category, use the appropriate fields from it
    if (selectedScheme && category) {
      const fields = getKpiFieldsByCategory(category);
      
      // Debug logs
      console.log(`Fields for ${category}:`, fields);
      console.log(`KPI Metadata:`, getKpiMetadata());
      
      return fields;
    }
    
    // Fallback to using constant DB fields
    const fields = DB_FIELDS[revenueBase as keyof typeof DB_FIELDS] || [];
    return fields.map(field => field.value);
  };

  // Primary Metric handlers
  const addPrimaryMetric = () => {
    const qualificationFields = getDbFields('qualification');
    const defaultField = qualificationFields.length > 0 ? qualificationFields[0] : '';
    
    const newMetric: PrimaryMetric = {
      field: defaultField,
      operator: '>',
      value: 0,
      description: 'New qualifying criteria'
    };
    
    const updatedRules = {
      ...rules,
      primaryMetrics: [...rules.primaryMetrics, newMetric]
    };
    
    setRules(updatedRules);
    
    if (typeof onUpdateRules === 'function') {
      onUpdateRules(updatedRules);
    } else {
      console.error("onUpdateRules is not a function", onUpdateRules);
    }
  };

  const updatePrimaryMetric = (index: number, field: keyof PrimaryMetric, value: string | number) => {
    const newMetrics = [...rules.primaryMetrics];
    newMetrics[index] = {
      ...newMetrics[index],
      [field]: value
    };
    
    const updatedRules = {
      ...rules,
      primaryMetrics: newMetrics
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const removePrimaryMetric = (index: number) => {
    // Allow removing even if it's the last one
    const newMetrics = [...rules.primaryMetrics];
    newMetrics.splice(index, 1);
    
    const updatedRules = {
      ...rules,
      primaryMetrics: newMetrics
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Update minimum qualification
  const updateMinQualification = (value: number) => {
    const updatedRules = {
      ...rules,
      minQualification: value
    };
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Adjustment handlers
  const addAdjustment = () => {
    const adjustmentFields = getDbFields('adjustment');
    const defaultField = adjustmentFields.length > 0 ? adjustmentFields[0] : '';
    
    const newAdjustment: Adjustment = {
      id: uuidv4(),
      description: 'New adjustment rule',
      impact: 1.0,
      type: 'PERCENTAGE_BOOST',
      field: defaultField,
      operator: '>',
      value: 0,
      factor: 1.0
    };
    
    const updatedRules = {
      ...rules,
      adjustments: [...rules.adjustments, newAdjustment]
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const updateAdjustment = (index: number, field: keyof Adjustment, value: string | number) => {
    const newAdjustments = [...rules.adjustments];
    newAdjustments[index] = {
      ...newAdjustments[index],
      [field]: value
    };
    
    const updatedRules = {
      ...rules,
      adjustments: newAdjustments
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const removeAdjustment = (index: number) => {
    const newAdjustments = [...rules.adjustments];
    newAdjustments.splice(index, 1);
    
    const updatedRules = {
      ...rules,
      adjustments: newAdjustments
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Exclusion handlers
  const addExclusion = () => {
    const exclusionFields = getDbFields('exclusion');
    const defaultField = exclusionFields.length > 0 ? exclusionFields[0] : '';
    
    const newExclusion: Exclusion = {
      field: defaultField,
      operator: '>',
      value: 0,
      description: 'New exclusion rule'
    };
    
    const updatedRules = {
      ...rules,
      exclusions: [...rules.exclusions, newExclusion]
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const updateExclusion = (index: number, field: keyof Exclusion, value: string | number) => {
    const newExclusions = [...rules.exclusions];
    newExclusions[index] = {
      ...newExclusions[index],
      [field]: value
    };
    
    const updatedRules = {
      ...rules,
      exclusions: newExclusions
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const removeExclusion = (index: number) => {
    const newExclusions = [...rules.exclusions];
    newExclusions.splice(index, 1);
    
    const updatedRules = {
      ...rules,
      exclusions: newExclusions
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  return {
    rules,
    getDbFields,
    getKpiMetadata,
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
  };
};
