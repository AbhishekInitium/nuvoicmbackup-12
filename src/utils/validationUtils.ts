import { IncentivePlan, Tier } from '@/types/incentiveTypes';

/**
 * Validates all required fields in an incentive plan
 */
export const validatePlanFields = (plan: IncentivePlan): string[] => {
  const errors: string[] = [];
  
  // Basic information validation
  if (!plan.name || plan.name.trim() === '') {
    errors.push("Scheme Name is required");
  }
  
  if (!plan.effectiveStart) {
    errors.push("Start Date is required");
  }
  
  if (!plan.effectiveEnd) {
    errors.push("End Date is required");
  }
  
  // Validate scheme structure
  if (!plan.revenueBase) {
    errors.push("Revenue Base is required");
  }

  if (plan.salesQuota < 0) {
    errors.push("Sales Quota cannot be negative");
  }
  
  // Validate primary metrics (qualifying criteria)
  if (!plan.measurementRules.primaryMetrics || plan.measurementRules.primaryMetrics.length === 0) {
    errors.push("At least one qualifying criteria is required");
  } else {
    plan.measurementRules.primaryMetrics.forEach((metric, index) => {
      if (!metric.field || metric.field.trim() === '') {
        errors.push(`Qualifying criteria ${index + 1} must have a field`);
      }
      if (!metric.operator || metric.operator.trim() === '') {
        errors.push(`Qualifying criteria ${index + 1} must have an operator`);
      }
    });
  }
  
  // Validate credit distribution rules
  if (!plan.creditRules.levels || plan.creditRules.levels.length === 0) {
    errors.push("At least one credit role is required");
  } else {
    // Calculate total percentage
    const totalPercentage = plan.creditRules.levels.reduce((sum, level) => sum + level.percentage, 0);
    if (totalPercentage !== 100) {
      errors.push(`Credit distribution must total 100%. Current total: ${totalPercentage}%`);
    }
    
    // Validate individual credit rules
    plan.creditRules.levels.forEach((level, index) => {
      if (level.percentage <= 0) {
        errors.push(`Credit role ${index + 1} must have a positive percentage`);
      }
    });
  }
  
  // Validate commission tiers
  if (plan.commissionStructure.tiers && plan.commissionStructure.tiers.length > 0) {
    // Check for blank values
    plan.commissionStructure.tiers.forEach((tier, index) => {
      if (tier.rate <= 0) {
        errors.push(`Commission tier ${index + 1} must have a positive rate`);
      }
    });
    
    // Check for overlaps
    for (let i = 0; i < plan.commissionStructure.tiers.length; i++) {
      const currentTier = plan.commissionStructure.tiers[i];
      
      // Check if "from" is greater than or equal to "to"
      if (currentTier.from >= currentTier.to) {
        errors.push(`Commission tier ${i + 1}: "From" value must be less than "To" value`);
      }
      
      // Check for overlaps with other tiers
      for (let j = 0; j < plan.commissionStructure.tiers.length; j++) {
        if (i !== j) {
          const otherTier = plan.commissionStructure.tiers[j];
          if ((currentTier.from >= otherTier.from && currentTier.from < otherTier.to) ||
              (currentTier.to > otherTier.from && currentTier.to <= otherTier.to) ||
              (currentTier.from <= otherTier.from && currentTier.to >= otherTier.to)) {
            errors.push(`Commission tier ${i + 1} overlaps with tier ${j + 1}`);
            // Only report each overlap once
            break;
          }
        }
      }
    }
  }
  
  return errors;
};

/**
 * Check if commission tiers have any overlapping ranges
 */
export const hasOverlappingTiers = (tiers: Tier[]): boolean => {
  for (let i = 0; i < tiers.length; i++) {
    const currentTier = tiers[i];
    
    // Check if "from" is greater than or equal to "to"
    if (currentTier.from >= currentTier.to) {
      return true;
    }
    
    // Check for overlaps with other tiers
    for (let j = 0; j < tiers.length; j++) {
      if (i !== j) {
        const otherTier = tiers[j];
        if ((currentTier.from >= otherTier.from && currentTier.from < otherTier.to) ||
            (currentTier.to > otherTier.from && currentTier.to <= otherTier.to) ||
            (currentTier.from <= otherTier.from && currentTier.to >= otherTier.to)) {
          return true;
        }
      }
    }
  }
  
  return false;
};
