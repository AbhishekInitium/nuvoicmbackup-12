
import { useState, useEffect } from 'react';
import { DB_FIELDS } from '@/constants/incentiveConstants';
import { MeasurementRules, Adjustment, Exclusion, PrimaryMetric } from '@/types/incentiveTypes';
import { v4 as uuidv4 } from 'uuid';

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
    const fields = DB_FIELDS[revenueBase as keyof typeof DB_FIELDS] || [];
    return fields.map(field => field.value);
  };

  // Primary Metric handlers
  const addPrimaryMetric = () => {
    const defaultField = getDbFields()[0] || '';
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
    const defaultField = getDbFields()[0] || '';
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
    const defaultField = getDbFields()[0] || '';
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
