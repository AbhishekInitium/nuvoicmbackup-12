
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * Custom hook for validating incentive plan data
 */
export const usePlanValidation = () => {
  /**
   * Validates incentive plan fields to ensure required data is present
   */
  const validatePlan = (plan: IncentivePlan): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!plan.name) errors.push("Plan Name is required");
    if (!plan.effectiveStart) errors.push("Start Date is required");
    if (!plan.effectiveEnd) errors.push("End Date is required");
    if (!plan.revenueBase) errors.push("Revenue Base is required");
    
    // Validate sales quota is a positive value
    if (typeof plan.salesQuota !== 'number' || plan.salesQuota <= 0) {
      errors.push("Sales Quota must be a positive value");
    }
    
    if (!plan.creditRules.levels || plan.creditRules.levels.length === 0) {
      errors.push("At least one Credit Level is required");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return { validatePlan };
};
