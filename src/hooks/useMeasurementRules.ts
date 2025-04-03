
import { useState, useEffect } from 'react';
import { MeasurementRules, Adjustment, Exclusion, PrimaryMetric, RuleCondition } from '@/types/incentiveTypes';

export const useMeasurementRules = (
  initialRules: MeasurementRules,
  revenueBase: string,
  onUpdateRules: (rules: MeasurementRules) => void
) => {
  // Ensure initialRules.primaryMetrics is an array but don't add default values
  const normalizedInitialRules = {
    ...initialRules,
    primaryMetrics: Array.isArray(initialRules.primaryMetrics) ? initialRules.primaryMetrics : [],
    adjustments: Array.isArray(initialRules.adjustments) ? initialRules.adjustments : [],
    exclusions: Array.isArray(initialRules.exclusions) ? initialRules.exclusions : []
  };

  const [rules, setRules] = useState<MeasurementRules>(normalizedInitialRules);

  // Update rules if initialRules changes
  useEffect(() => {
    const normalizedRules = {
      ...initialRules,
      primaryMetrics: Array.isArray(initialRules.primaryMetrics) ? initialRules.primaryMetrics : [],
      adjustments: Array.isArray(initialRules.adjustments) ? initialRules.adjustments : [],
      exclusions: Array.isArray(initialRules.exclusions) ? initialRules.exclusions : []
    };
    
    setRules(normalizedRules);
  }, [initialRules]);

  // Helper function to get database fields based on revenue base
  const getDbFields = () => {
    // Return empty array initially - fields will come from configurations
    if (!revenueBase) return [];
    
    // Basic default set of fields based on revenue base
    const baseFields = ['sales', 'quantity', 'margin', 'revenue'];
    return baseFields;
  };

  // Primary Metric handlers
  const addPrimaryMetric = () => {
    const newMetric: PrimaryMetric = {
      field: '', // Empty field, will be populated when user selects a value
      operator: '', // Empty operator initially
      value: '', // Empty value initially
      description: 'New qualifying criteria'
    };
    
    const updatedRules = {
      ...rules,
      primaryMetrics: [...rules.primaryMetrics, newMetric]
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
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
    const defaultCondition: RuleCondition = {
      field: '', // Empty field initially
      operator: '', // Empty operator initially
      value: '' // Empty value initially
    };
    
    const newAdjustment: Adjustment = {
      type: 'percentage',
      value: 10,
      description: 'New adjustment rule',
      condition: defaultCondition
    };
    
    const updatedRules = {
      ...rules,
      adjustments: [...rules.adjustments, newAdjustment]
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const updateAdjustment = (index: number, field: keyof Adjustment, value: any) => {
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
    const defaultCondition: RuleCondition = {
      field: '', // Empty field initially
      operator: '', // Empty operator initially 
      value: '' // Empty value initially
    };
    
    const newExclusion: Exclusion = {
      description: 'New exclusion rule',
      condition: defaultCondition
    };
    
    const updatedRules = {
      ...rules,
      exclusions: [...rules.exclusions, newExclusion]
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const updateExclusion = (index: number, field: keyof Exclusion, value: any) => {
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
