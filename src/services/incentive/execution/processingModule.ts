import { IncentivePlan, CustomRule, Exclusion, CreditRule } from '@/types/incentiveTypes';
import { SelectedData } from './dataSelectionModule';
import { LogEntry, addLogEntry } from './loggingModule';

export interface ProcessedData {
  participantResults: ParticipantResult[];
  totalSalesAmount: number;
  totalCommissionAmount: number;
  metadata: {
    processedAt: string;
    inputRecords: number;
    outputParticipants: number;
  };
}

export interface ParticipantResult {
  participantId: string;
  salesAmount: number;
  groupedData: any[];
  commissionAmount: number;
  tier: string;
  appliedRate: number;
  adjustments: AdjustmentRecord[];
  customRulesApplied: string[];
  exclusionsApplied: string[];
  qualifiedRecords: number;
  disqualifiedRecords: number;
  logEntries: LogEntry[];
}

export interface AdjustmentRecord {
  adjustmentId: string;
  description: string;
  impact: number;
}

/**
 * Process data by grouping by participant and applying rules
 */
export const processData = (
  data: SelectedData, 
  plan: IncentivePlan,
  executionId: string
): ProcessedData => {
  console.log('Starting data processing');
  
  // Group data by participant (sales rep)
  const participantGroups = groupDataByParticipant(data.records);
  
  // Process each participant's data
  const participantResults = Object.entries(participantGroups).map(([participantId, groupedData]) => {
    console.log(`Processing data for participant: ${participantId}`);
    
    // Initialize participant result
    const participantResult: ParticipantResult = {
      participantId,
      salesAmount: 0,
      groupedData,
      commissionAmount: 0,
      tier: '',
      appliedRate: 0,
      adjustments: [],
      customRulesApplied: [],
      exclusionsApplied: [],
      qualifiedRecords: groupedData.length,
      disqualifiedRecords: 0,
      logEntries: []
    };
    
    // Add initial log entry
    addLogEntry(
      participantResult.logEntries,
      'Processing Start',
      `Started processing ${groupedData.length} records for ${participantId}`,
      'INFO',
      executionId
    );
    
    // 1. Apply exclusion rules first
    const afterExclusions = applyExclusionRules(groupedData, plan, participantResult, executionId);
    
    // 2. Apply custom rules
    const afterCustomRules = applyCustomRules(afterExclusions, plan, participantResult, executionId);
    
    // 3. Calculate sales amount after all rules applied
    const salesAmount = calculateTotalSalesAmount(afterCustomRules);
    participantResult.salesAmount = salesAmount;
    
    addLogEntry(
      participantResult.logEntries,
      'Total Sales Calculation',
      `Total qualifying sales amount: ${salesAmount}`,
      'INFO',
      executionId
    );
    
    // 4. Apply commission structure to determine rate and calculate commission
    applyCommissionStructure(participantResult, plan, executionId);
    
    return participantResult;
  });
  
  // Calculate total amounts
  const totalSalesAmount = participantResults.reduce((sum, p) => sum + p.salesAmount, 0);
  const totalCommissionAmount = participantResults.reduce((sum, p) => sum + p.commissionAmount, 0);
  
  return {
    participantResults,
    totalSalesAmount,
    totalCommissionAmount,
    metadata: {
      processedAt: new Date().toISOString(),
      inputRecords: data.records.length,
      outputParticipants: participantResults.length
    }
  };
};

/**
 * Group data by participant (using Sales Org as participant ID for now)
 * This can be extended based on the actual participant identification logic
 */
const groupDataByParticipant = (records: any[]): Record<string, any[]> => {
  const groups: Record<string, any[]> = {};
  
  records.forEach(record => {
    // Use SalesOrganization as participant ID for now
    // This should be replaced with the actual participant field once defined
    const participantId = record.SalesOrganization || 'UNKNOWN';
    
    if (!groups[participantId]) {
      groups[participantId] = [];
    }
    
    groups[participantId].push(record);
  });
  
  return groups;
};

/**
 * Apply exclusion rules to participant data
 */
const applyExclusionRules = (
  data: any[], 
  plan: IncentivePlan, 
  participantResult: ParticipantResult,
  executionId: string
): any[] => {
  if (!plan.measurementRules || !plan.measurementRules.exclusions || plan.measurementRules.exclusions.length === 0) {
    addLogEntry(
      participantResult.logEntries,
      'Exclusions',
      'No exclusion rules defined',
      'INFO',
      executionId
    );
    return data;
  }
  
  const initialCount = data.length;
  
  // Apply each exclusion rule
  const filteredData = data.filter(item => {
    let shouldKeep = true;
    
    for (const exclusion of plan.measurementRules.exclusions) {
      // Use the field from the condition
      const fieldValue = item[exclusion.condition.field];
      const ruleValue = exclusion.condition.value;
      
      // Skip if field doesn't exist in the item
      if (fieldValue === undefined) continue;
      
      // Check if exclusion applies
      let exclusionApplies = false;
      
      switch (exclusion.condition.operator) {
        case '=':
        case '==':
          exclusionApplies = (fieldValue === ruleValue);
          break;
        case '!=':
          exclusionApplies = (fieldValue !== ruleValue);
          break;
        case '>':
          exclusionApplies = (fieldValue > ruleValue);
          break;
        case '>=':
          exclusionApplies = (fieldValue >= ruleValue);
          break;
        case '<':
          exclusionApplies = (fieldValue < ruleValue);
          break;
        case '<=':
          exclusionApplies = (fieldValue <= ruleValue);
          break;
      }
      
      if (exclusionApplies) {
        // Record the exclusion in participant result
        if (!participantResult.exclusionsApplied.includes(exclusion.description || '')) {
          participantResult.exclusionsApplied.push(exclusion.description || '');
        }
        
        shouldKeep = false;
        break;
      }
    }
    
    return shouldKeep;
  });
  
  const excludedCount = initialCount - filteredData.length;
  participantResult.disqualifiedRecords += excludedCount;
  participantResult.qualifiedRecords = filteredData.length;
  
  addLogEntry(
    participantResult.logEntries,
    'Exclusions Applied',
    `${excludedCount} records excluded, ${filteredData.length} records remaining`,
    'INFO',
    executionId
  );
  
  if (participantResult.exclusionsApplied.length > 0) {
    addLogEntry(
      participantResult.logEntries,
      'Exclusion Rules',
      `Applied exclusions: ${participantResult.exclusionsApplied.join(', ')}`,
      'INFO',
      executionId
    );
  }
  
  return filteredData;
};

/**
 * Apply custom rules to participant data
 */
const applyCustomRules = (
  data: any[], 
  plan: IncentivePlan, 
  participantResult: ParticipantResult,
  executionId: string
): any[] => {
  if (!plan.customRules || plan.customRules.length === 0) {
    addLogEntry(
      participantResult.logEntries,
      'Custom Rules',
      'No custom rules defined',
      'INFO',
      executionId
    );
    return data;
  }
  
  // Process each record through the custom rules
  const processedData = data.map(record => {
    const modifiedRecord = { ...record };
    
    // Apply each active custom rule
    for (const rule of plan.customRules) {
      if (rule.active === false) continue; // Skip inactive rules
      
      // Check if the condition is met
      const condition = rule.condition;
      
      // For rule conditions, use the field as field name
      const fieldName = condition.field;
      const metricValue = record[fieldName] || 0;
      
      let conditionMet = false;
      
      switch (condition.operator) {
        case '=':
        case '==':
          conditionMet = metricValue === condition.value;
          break;
        case '!=':
          conditionMet = metricValue !== condition.value;
          break;
        case '>':
          conditionMet = metricValue > condition.value;
          break;
        case '>=':
          conditionMet = metricValue >= condition.value;
          break;
        case '<':
          conditionMet = metricValue < condition.value;
          break;
        case '<=':
          conditionMet = metricValue <= condition.value;
          break;
        default:
          conditionMet = false;
      }
      
      if (conditionMet) {
        // Record the rule application
        if (!participantResult.customRulesApplied.includes(rule.name || '')) {
          participantResult.customRulesApplied.push(rule.name || '');
          
          addLogEntry(
            participantResult.logEntries,
            'Custom Rule Applied',
            `Applied rule: ${rule.name || ''} (${rule.action || ''})`,
            'INFO',
            executionId
          );
        }
        
        // Apply the rule action
        switch (rule.action) {
          case 'qualify':
            modifiedRecord._qualified = true;
            break;
          case 'disqualify':
            modifiedRecord._qualified = false;
            // If disqualified, we'll handle this in the next step
            break;
          case 'boost':
            // Apply a boost to the amount
            if (modifiedRecord.TotalNetAmount !== undefined) {
              const originalAmount = modifiedRecord.TotalNetAmount;
              // Use rule.factor or default to 1.5 if not defined
              const boostFactor = rule.factor || 1.5; // Default boost of 50%
              modifiedRecord.TotalNetAmount = originalAmount * boostFactor;
              
              // Record the adjustment
              const impact = modifiedRecord.TotalNetAmount - originalAmount;
              participantResult.adjustments.push({
                adjustmentId: rule.name || '',
                description: `Boost: ${rule.name || ''}`,
                impact
              });
              
              addLogEntry(
                participantResult.logEntries,
                'Boost Applied',
                `Boosted amount from ${originalAmount} to ${modifiedRecord.TotalNetAmount}`,
                'INFO',
                executionId
              );
            }
            break;
          case 'cap':
            // Apply a cap to the amount
            if (modifiedRecord.TotalNetAmount !== undefined) {
              const originalAmount = modifiedRecord.TotalNetAmount;
              // Use rule.condition.value from condition or default to 10000 if not defined
              const capAmount = rule.condition.value || 10000; // Default cap of 10K
              
              if (originalAmount > capAmount) {
                modifiedRecord.TotalNetAmount = Number(capAmount);
                
                // Record the adjustment
                const impact = modifiedRecord.TotalNetAmount - originalAmount;
                participantResult.adjustments.push({
                  adjustmentId: rule.name || '',
                  description: `Cap: ${rule.name || ''}`,
                  impact
                });
                
                addLogEntry(
                  participantResult.logEntries,
                  'Cap Applied',
                  `Capped amount from ${originalAmount} to ${modifiedRecord.TotalNetAmount}`,
                  'INFO',
                  executionId
                );
              }
            }
            break;
        }
      }
    }
    
    return modifiedRecord;
  });
  
  // Filter out any records that were disqualified by custom rules
  const finalData = processedData.filter(record => record._qualified !== false);
  
  const disqualifiedCount = processedData.length - finalData.length;
  if (disqualifiedCount > 0) {
    participantResult.disqualifiedRecords += disqualifiedCount;
    participantResult.qualifiedRecords = finalData.length;
    
    addLogEntry(
      participantResult.logEntries,
      'Custom Rules Disqualification',
      `${disqualifiedCount} records disqualified by custom rules, ${finalData.length} records remaining`,
      'INFO',
      executionId
    );
  }
  
  if (participantResult.customRulesApplied.length > 0) {
    addLogEntry(
      participantResult.logEntries,
      'Custom Rules Summary',
      `Applied ${participantResult.customRulesApplied.length} custom rules: ${participantResult.customRulesApplied.join(', ')}`,
      'INFO',
      executionId
    );
  }
  
  return finalData;
};

/**
 * Calculate total sales amount from processed records
 */
const calculateTotalSalesAmount = (records: any[]): number => {
  return records.reduce((total, record) => {
    // Use appropriate field based on the record type
    const amount = record.TotalNetAmount || record.InvoiceAmount || 0;
    return total + amount;
  }, 0);
};

/**
 * Apply commission structure to calculate commission
 */
const applyCommissionStructure = (
  participantResult: ParticipantResult, 
  plan: IncentivePlan,
  executionId: string
): void => {
  // Make sure we have tiers defined
  if (!plan.commissionStructure || !plan.commissionStructure.tiers || plan.commissionStructure.tiers.length === 0) {
    addLogEntry(
      participantResult.logEntries,
      'Commission Calculation',
      'No commission tiers defined',
      'ERROR',
      executionId
    );
    return;
  }
  
  // Find the applicable tier based on sales amount
  const tier = findApplicableTier(participantResult.salesAmount, plan.commissionStructure.tiers);
  
  // Update participant result with tier info
  participantResult.tier = `${tier.from} - ${tier.to}`;
  participantResult.appliedRate = tier.rate;
  
  addLogEntry(
    participantResult.logEntries,
    'Commission Tier',
    `Applied tier: ${tier.from}-${tier.to} with rate ${tier.rate}%`,
    'INFO',
    executionId
  );
  
  // Calculate base commission
  let commission = participantResult.salesAmount * (tier.rate / 100);
  
  addLogEntry(
    participantResult.logEntries,
    'Base Commission',
    `Base commission: ${commission.toFixed(2)} (${tier.rate}% of ${participantResult.salesAmount})`,
    'INFO',
    executionId
  );
  
  // Apply credit rules if available
  if (plan.creditRules && plan.creditRules.levels && plan.creditRules.levels.length > 0) {
    // For now, we assume the credit rules are applied to all participants equally
    // This should be expanded to match participants to specific credit levels
    const creditLevel = plan.creditRules.levels[0] as CreditRule;
    
    if (creditLevel && creditLevel.percent !== 100) {
      const originalCommission = commission;
      commission = commission * (creditLevel.percent / 100);
      
      addLogEntry(
        participantResult.logEntries,
        'Credit Rules',
        `Applied credit level "${creditLevel.role || ''}" with ${creditLevel.percent}%: ${originalCommission.toFixed(2)} → ${commission.toFixed(2)}`,
        'INFO',
        executionId
      );
    }
  }
  
  // Set the final commission amount
  participantResult.commissionAmount = commission;
  
  addLogEntry(
    participantResult.logEntries,
    'Final Commission',
    `Final commission amount: ${commission.toFixed(2)}`,
    'INFO',
    executionId
  );
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
