
import { s4Request, S4_API_BASE_URL } from '../base/s4BaseService';
import { IncentivePlan } from '@/types/incentiveTypes';
import { getSalesData } from '../sales/salesService';
import { getSalesOrganizations } from '../sales/salesOrgService';

/**
 * Commission Execution Service
 * Handles the execution of commission calculations in both simulation and production modes
 */

export type ExecutionMode = 'SIMULATE' | 'PRODUCTION';

export interface CommissionExecutionParams {
  planId: string;
  executionMode: ExecutionMode;
  executionDate: string;
  periodStart: string;
  periodEnd: string;
  salesOrgs?: string[];
  participants?: string[];
  description?: string;
}

export interface CommissionExecutionResult {
  executionId: string;
  planId: string;
  executionMode: ExecutionMode;
  executionDate: string;
  periodStart: string;
  periodEnd: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  results?: any;
  timestamp: string;
  totalCommission: number;
  participantResults: ParticipantCommissionResult[];
}

export interface ParticipantCommissionResult {
  participantId: string;
  salesAmount: number;
  commissionAmount: number;
  tier: string;
  appliedRate: number;
  adjustments: AdjustmentApplication[];
  customRulesApplied: string[];
}

export interface AdjustmentApplication {
  adjustmentId: string;
  description: string;
  impact: number;
}

/**
 * Execute an incentive plan calculation (simulation or production run)
 */
export const executeCommissionCalculation = async (
  plan: IncentivePlan,
  params: CommissionExecutionParams
): Promise<CommissionExecutionResult> => {
  console.log(`Starting commission execution for plan: ${plan.name} in ${params.executionMode} mode`);
  
  try {
    // Step 1: Get the base data based on the revenue base type
    const baseData = await getBaseData(plan, params);
    console.log(`Retrieved ${baseData.length} records for base data`);
    
    // Step 2: Apply participant filters
    const filteredData = filterForParticipants(baseData, params.participants || plan.participants);
    console.log(`Filtered to ${filteredData.length} records for selected participants`);
    
    // Step 3: Apply measurement rules, adjustment factors and exclusions
    const adjustedData = applyMeasurementRules(filteredData, plan.measurementRules);
    console.log('Applied measurement rules to base data');
    
    // Step 4: Apply custom rules
    const finalData = applyCustomRules(adjustedData, plan.customRules);
    console.log('Applied custom rules to adjusted data');
    
    // Step 5: Calculate commissions based on commission structure tiers
    const commissionResults = calculateCommissions(finalData, plan);
    console.log('Calculated commission amounts based on tiers');
    
    // Generate the execution ID (timestamp-based for now)
    const executionId = `EXEC-${Date.now()}`;
    
    // Generate the result structure
    const result: CommissionExecutionResult = {
      executionId,
      planId: plan.name,
      executionMode: params.executionMode,
      executionDate: params.executionDate,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      totalCommission: commissionResults.totalCommission,
      participantResults: commissionResults.participantResults
    };
    
    // Save the execution result if this is a production run
    if (params.executionMode === 'PRODUCTION') {
      await saveExecutionResult(result);
      console.log('Saved production execution result to backend');
    }
    
    return result;
  } catch (error) {
    console.error('Error executing commission calculation:', error);
    throw error;
  }
};

/**
 * Get base data for the calculation based on the revenue base type
 */
const getBaseData = async (
  plan: IncentivePlan,
  params: CommissionExecutionParams
): Promise<any[]> => {
  console.log(`Getting base data for revenue base: ${plan.revenueBase}`);
  
  // Extract the date range from params
  const { periodStart, periodEnd } = params;
  
  switch (plan.revenueBase) {
    case 'salesOrders':
      return getSalesData(undefined, periodStart, periodEnd);
    case 'invoices':
      // Will implement the actual API calls once we have them defined
      return Promise.resolve([]);
    case 'paidInvoices':
      // Will implement the actual API calls once we have them defined
      return Promise.resolve([]);
    default:
      console.warn(`Unknown revenue base type: ${plan.revenueBase}, falling back to sales orders`);
      return getSalesData(undefined, periodStart, periodEnd);
  }
};

/**
 * Filter data for specific participants
 */
const filterForParticipants = (data: any[], participants: string[]): any[] => {
  if (!participants || participants.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    // For now assuming participants are sales orgs, will need to adapt based on actual data structure
    return participants.includes(item.SalesOrganization);
  });
};

/**
 * Apply measurement rules, adjustment factors and exclusions
 */
const applyMeasurementRules = (data: any[], rules: any): any[] => {
  // Apply exclusions first
  let filteredData = applyExclusions(data, rules.exclusions);
  
  // Then apply adjustments
  return applyAdjustments(filteredData, rules.adjustments);
};

/**
 * Apply exclusions to filter out records
 */
const applyExclusions = (data: any[], exclusions: any[]): any[] => {
  if (!exclusions || exclusions.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    // Default to including the item
    let includeItem = true;
    
    // Check each exclusion
    for (const exclusion of exclusions) {
      const fieldValue = item[exclusion.field];
      const ruleValue = exclusion.value;
      
      // Skip if field doesn't exist in the item
      if (fieldValue === undefined) continue;
      
      // Apply the operator
      switch (exclusion.operator) {
        case '=':
        case '==':
          if (fieldValue === ruleValue) includeItem = false;
          break;
        case '!=':
          if (fieldValue !== ruleValue) includeItem = false;
          break;
        case '>':
          if (fieldValue > ruleValue) includeItem = false;
          break;
        case '>=':
          if (fieldValue >= ruleValue) includeItem = false;
          break;
        case '<':
          if (fieldValue < ruleValue) includeItem = false;
          break;
        case '<=':
          if (fieldValue <= ruleValue) includeItem = false;
          break;
      }
      
      // If any exclusion applies, we can stop checking
      if (!includeItem) break;
    }
    
    return includeItem;
  });
};

/**
 * Apply adjustment factors to records
 */
const applyAdjustments = (data: any[], adjustments: any[]): any[] => {
  if (!adjustments || adjustments.length === 0) {
    return data;
  }
  
  return data.map(item => {
    // Create a copy of the item to modify
    const adjustedItem = { ...item };
    
    // Track applied adjustments
    adjustedItem._appliedAdjustments = [];
    
    // Apply each adjustment
    for (const adjustment of adjustments) {
      const fieldValue = item[adjustment.field];
      const ruleValue = adjustment.value;
      
      // Skip if field doesn't exist in the item
      if (fieldValue === undefined) continue;
      
      // Check if adjustment should be applied
      let shouldApply = false;
      
      switch (adjustment.operator) {
        case '=':
        case '==':
          shouldApply = (fieldValue === ruleValue);
          break;
        case '!=':
          shouldApply = (fieldValue !== ruleValue);
          break;
        case '>':
          shouldApply = (fieldValue > ruleValue);
          break;
        case '>=':
          shouldApply = (fieldValue >= ruleValue);
          break;
        case '<':
          shouldApply = (fieldValue < ruleValue);
          break;
        case '<=':
          shouldApply = (fieldValue <= ruleValue);
          break;
      }
      
      // If the adjustment should be applied
      if (shouldApply) {
        // Apply the factor to the TotalNetAmount
        if (adjustedItem.TotalNetAmount !== undefined) {
          const originalAmount = adjustedItem.TotalNetAmount;
          adjustedItem.TotalNetAmount = originalAmount * adjustment.factor;
          
          // Record the adjustment application
          adjustedItem._appliedAdjustments.push({
            adjustmentId: adjustment.field,
            description: adjustment.description,
            impact: adjustedItem.TotalNetAmount - originalAmount
          });
        }
      }
    }
    
    return adjustedItem;
  });
};

/**
 * Apply custom rules to the data
 */
const applyCustomRules = (data: any[], customRules: any[]): any[] => {
  if (!customRules || customRules.length === 0) {
    return data;
  }
  
  return data.map(item => {
    // Create a copy of the item to modify
    const modifiedItem = { ...item };
    
    // Track applied custom rules
    modifiedItem._appliedCustomRules = [];
    
    // Apply each active custom rule
    for (const rule of customRules) {
      // Skip inactive rules
      if (!rule.active) continue;
      
      // Check if all conditions are met
      const allConditionsMet = rule.conditions.every(condition => {
        // Get the metric value from the item
        // This is simplified and would need to adapt to actual data structure
        const metricValue = item.TotalNetAmount; // Using TotalNetAmount as a placeholder
        
        // Apply the operator
        switch (condition.operator) {
          case '=':
          case '==':
            return metricValue === condition.value;
          case '!=':
            return metricValue !== condition.value;
          case '>':
            return metricValue > condition.value;
          case '>=':
            return metricValue >= condition.value;
          case '<':
            return metricValue < condition.value;
          case '<=':
            return metricValue <= condition.value;
          default:
            return false;
        }
      });
      
      // If all conditions are met, apply the rule
      if (allConditionsMet) {
        // Record the rule application
        modifiedItem._appliedCustomRules.push(rule.name);
        
        // Apply the action
        switch (rule.action) {
          case 'qualify':
            modifiedItem._qualified = true;
            break;
          case 'disqualify':
            modifiedItem._qualified = false;
            break;
          case 'boost':
            // Apply a boost multiplier (placeholder)
            if (modifiedItem.TotalNetAmount !== undefined) {
              modifiedItem.TotalNetAmount = modifiedItem.TotalNetAmount * 1.5;
            }
            break;
          case 'cap':
            // Apply a cap (placeholder)
            if (modifiedItem.TotalNetAmount !== undefined) {
              modifiedItem.TotalNetAmount = Math.min(modifiedItem.TotalNetAmount, 10000);
            }
            break;
        }
      }
    }
    
    return modifiedItem;
  });
};

/**
 * Calculate commissions based on tiers
 */
const calculateCommissions = (data: any[], plan: IncentivePlan): {
  totalCommission: number;
  participantResults: ParticipantCommissionResult[];
} => {
  // Group by participant
  const participantMap = new Map();
  
  // Process each sales record
  for (const item of data) {
    const participantId = item.SalesOrganization || 'UNKNOWN';
    
    if (!participantMap.has(participantId)) {
      participantMap.set(participantId, {
        participantId,
        salesAmount: 0,
        commissionAmount: 0,
        tier: '',
        appliedRate: 0,
        adjustments: [],
        customRulesApplied: []
      });
    }
    
    const participant = participantMap.get(participantId);
    
    // Add sales amount
    participant.salesAmount += (item.TotalNetAmount || 0);
    
    // Record adjustments
    if (item._appliedAdjustments) {
      participant.adjustments.push(...item._appliedAdjustments);
    }
    
    // Record custom rules
    if (item._appliedCustomRules) {
      for (const rule of item._appliedCustomRules) {
        if (!participant.customRulesApplied.includes(rule)) {
          participant.customRulesApplied.push(rule);
        }
      }
    }
  }
  
  // Calculate commission for each participant
  let totalCommission = 0;
  const participantResults: ParticipantCommissionResult[] = [];
  
  for (const [_, participant] of participantMap.entries()) {
    // Find the applicable tier
    const tier = findApplicableTier(participant.salesAmount, plan.commissionStructure.tiers);
    
    // Calculate commission
    const commissionAmount = participant.salesAmount * (tier.rate / 100);
    
    // Update participant result
    participant.commissionAmount = commissionAmount;
    participant.tier = `${tier.from} - ${tier.to}`;
    participant.appliedRate = tier.rate;
    
    // Add to total
    totalCommission += commissionAmount;
    
    // Add to results array
    participantResults.push(participant);
  }
  
  return {
    totalCommission,
    participantResults
  };
};

/**
 * Find the applicable tier for a given amount
 */
const findApplicableTier = (amount: number, tiers: any[]): any => {
  // Default to the first tier
  let applicableTier = tiers[0];
  
  for (const tier of tiers) {
    if (amount >= tier.from && amount <= tier.to) {
      applicableTier = tier;
      break;
    }
  }
  
  return applicableTier;
};

/**
 * Save the execution result (for production runs)
 */
const saveExecutionResult = async (result: CommissionExecutionResult): Promise<void> => {
  // This would be implemented to save the result to the backend
  // For now, just log it
  console.log('Saving execution result:', result);
  
  // Placeholder for the actual API call
  return Promise.resolve();
};

/**
 * Get all execution results for a given plan
 */
export const getExecutionResults = async (planId: string): Promise<CommissionExecutionResult[]> => {
  // This would be implemented to get results from the backend
  // For now, return an empty array
  console.log(`Getting execution results for plan: ${planId}`);
  
  // Placeholder for the actual API call
  return Promise.resolve([]);
};

/**
 * Get a specific execution result by ID
 */
export const getExecutionResultById = async (executionId: string): Promise<CommissionExecutionResult | null> => {
  // This would be implemented to get a specific result from the backend
  // For now, return null
  console.log(`Getting execution result for ID: ${executionId}`);
  
  // Placeholder for the actual API call
  return Promise.resolve(null);
};
