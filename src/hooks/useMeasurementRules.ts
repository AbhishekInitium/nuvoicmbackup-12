
import { useState, useEffect } from 'react';
import { DB_FIELDS } from '@/constants/incentiveConstants';
import { MeasurementRules, Adjustment, Exclusion, PrimaryMetric } from '@/types/incentiveTypes';

export const useMeasurementRules = (
  initialRules: MeasurementRules,
  revenueBase: string,
  onUpdateRules: (rules: MeasurementRules) => void
) => {
  // Ensure initialRules.primaryMetrics is an array
  const normalizedInitialRules = {
    ...initialRules,
    primaryMetrics: Array.isArray(initialRules.primaryMetrics)
      ? initialRules.primaryMetrics
      : [{ name: 'revenue', description: 'Revenue-based metric' }]
  };

  const [rules, setRules] = useState<MeasurementRules>(normalizedInitialRules);

  // Update rules if initialRules changes
  useEffect(() => {
    const normalizedRules = {
      ...initialRules,
      primaryMetrics: Array.isArray(initialRules.primaryMetrics)
        ? initialRules.primaryMetrics
        : [{ name: 'revenue', description: 'Revenue-based metric' }]
    };
    
    setRules(normalizedRules);
  }, [initialRules]);

  // Helper function to get database fields based on revenue base
  const getDbFields = () => {
    return DB_FIELDS[revenueBase] || [];
  };

  // Primary Metric handlers
  const addPrimaryMetric = () => {
    const newMetric: PrimaryMetric = {
      name: 'revenue',
      description: 'Revenue-based metric'
    };
    
    const updatedRules = {
      ...rules,
      primaryMetrics: [...rules.primaryMetrics, newMetric]
    };
    
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  const updatePrimaryMetric = (index: number, field: keyof PrimaryMetric, value: string) => {
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
    // Don't remove if it's the last metric
    if (rules.primaryMetrics.length <= 1) {
      return;
    }
    
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
    const defaultField = DB_FIELDS[revenueBase][0];
    const newAdjustment = {
      field: defaultField,
      operator: '>',
      value: 0,
      factor: 1.0,
      description: 'New adjustment rule'
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
    const defaultField = DB_FIELDS[revenueBase][0];
    const newExclusion = {
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
