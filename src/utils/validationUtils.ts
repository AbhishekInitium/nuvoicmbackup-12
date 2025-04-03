
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * Validates all required fields in an incentive plan
 */
export const validatePlanFields = (plan: IncentivePlan): string[] => {
  const errors: string[] = [];
  
  if (!plan.name || plan.name.trim() === '') {
    errors.push("Plan Name is required");
  }
  
  if (!plan.effectiveStart) {
    errors.push("Start Date is required");
  }
  
  if (!plan.effectiveEnd) {
    errors.push("End Date is required");
  }
  
  if (!plan.revenueBase) {
    errors.push("Revenue Base is required");
  }
  
  if (plan.salesQuota <= 0) {
    errors.push("Sales Quota must be a positive value");
  }
  
  if (!plan.commissionStructure.tiers || plan.commissionStructure.tiers.length === 0) {
    errors.push("At least one commission tier is required");
  } else {
    // Validate tier values only during save
    plan.commissionStructure.tiers.forEach((tier, index) => {
      if (tier.rate <= 0) {
        errors.push(`Tier ${index + 1} must have a positive commission rate`);
      }
      
      if (tier.from < 0) {
        errors.push(`Tier ${index + 1} must have a non-negative starting value`);
      }
      
      if (tier.to <= tier.from) {
        errors.push(`Tier ${index + 1} must have an ending value greater than its starting value`);
      }
      
      // Check for overlaps with previous tiers
      if (index > 0) {
        const prevTier = plan.commissionStructure.tiers[index - 1];
        if (tier.from < prevTier.to) {
          errors.push(`Tier ${index + 1} overlaps with Tier ${index}. Please adjust the ranges.`);
        }
      }
    });
  }
  
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
  
  // Removed validation for participants (sales organizations)
  
  if (!plan.creditRules.levels || plan.creditRules.levels.length === 0) {
    errors.push("At least one credit level is required");
  }
  
  return errors;
};
