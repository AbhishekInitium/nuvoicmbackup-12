
import { v4 as uuidv4 } from 'uuid';
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus, markPlanAsExecuted } from '../incentivePlanService';
import { selectPrimaryData, applyQualifyingCriteria, DataSelectionParams } from './dataSelectionModule';
import { processData, ProcessedData } from './processingModule';
import { createExecutionLog, completeExecutionLog, getExecutionLog as getLogFromLoggingModule, addSystemLogEntry } from './loggingModule';

// Define ExecutionMode as a type
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
  timestamp: string;
  totalCommission: number;
  participantResults: ParticipantCommissionResult[];
  logSummary?: {
    totalEntries: number;
    errors: number;
    warnings: number;
  };
}

export interface ParticipantCommissionResult {
  participantId: string;
  salesAmount: number;
  commissionAmount: number;
  tier: string;
  appliedRate: number;
  adjustments: AdjustmentApplication[];
  customRulesApplied: string[];
  qualifiedRecords: number;
  disqualifiedRecords: number;
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
  // Generate the execution ID
  const executionId = `EXEC-${uuidv4()}`;
  
  console.log(`Starting commission execution ${executionId} for plan: ${plan.name} in ${params.executionMode} mode`);
  
  // Create execution log
  const executionLog = createExecutionLog(executionId, params.executionMode);
  
  try {
    // STEP 1: DATA SELECTION - Select primary data based on revenue base
    const dataSelectionParams: DataSelectionParams = {
      planId: plan.name,
      planStartDate: params.periodStart,
      processingDate: params.executionDate,
      salesOrgs: params.salesOrgs,
      participants: params.participants || plan.participants
    };
    
    addSystemLogEntry(executionId, 'Data Selection', 'Starting data selection phase');
    const selectedData = await selectPrimaryData(plan, dataSelectionParams);
    
    // STEP 2: Apply qualifying criteria up front
    addSystemLogEntry(executionId, 'Qualifying Criteria', 'Applying qualifying criteria');
    const qualifiedData = applyQualifyingCriteria(selectedData, plan);
    
    // STEP 3: PROCESSING - Process the data per participant
    addSystemLogEntry(executionId, 'Data Processing', 'Starting data processing phase');
    const processedData = processData(qualifiedData, plan, executionId);
    
    // STEP 4: Convert processed data to result format
    const participantResults = processedData.participantResults.map(pr => ({
      participantId: pr.participantId,
      salesAmount: pr.salesAmount,
      commissionAmount: pr.commissionAmount,
      tier: pr.tier,
      appliedRate: pr.appliedRate,
      adjustments: pr.adjustments,
      customRulesApplied: pr.customRulesApplied,
      qualifiedRecords: pr.qualifiedRecords,
      disqualifiedRecords: pr.disqualifiedRecords
    }));
    
    // STEP 5: Create result object
    const result: CommissionExecutionResult = {
      executionId,
      planId: plan.name,
      executionMode: params.executionMode,
      executionDate: params.executionDate,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      totalCommission: processedData.totalCommissionAmount,
      participantResults,
      logSummary: {
        totalEntries: executionLog.entries.length,
        errors: executionLog.entries.filter(e => e.level === 'ERROR').length,
        warnings: executionLog.entries.filter(e => e.level === 'WARNING').length
      }
    };
    
    // Complete execution log
    completeExecutionLog(executionId, true, {
      totalRecordsProcessed: selectedData.records.length,
      participantsProcessed: participantResults.length,
      totalCommission: processedData.totalCommissionAmount
    });
    
    // STEP 6: Save the execution result if this is a production run
    if (params.executionMode === 'PRODUCTION') {
      await saveExecutionResult(result);
      await markPlanAsExecuted(plan.name);
    }
    
    return result;
  } catch (error) {
    console.error('Error executing commission calculation:', error);
    
    addSystemLogEntry(
      executionId, 
      'Execution Error', 
      `Error: ${error.message || 'Unknown error'}`,
      'ERROR',
      { stack: error.stack }
    );
    
    completeExecutionLog(executionId, false);
    
    // Return a failed result
    return {
      executionId,
      planId: plan.name,
      executionMode: params.executionMode,
      executionDate: params.executionDate,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      status: 'FAILED',
      timestamp: new Date().toISOString(),
      totalCommission: 0,
      participantResults: [],
      logSummary: {
        totalEntries: executionLog.entries.length,
        errors: executionLog.entries.filter(e => e.level === 'ERROR').length,
        warnings: executionLog.entries.filter(e => e.level === 'WARNING').length
      }
    };
  }
};

/**
 * Save the execution result (for production runs)
 */
const saveExecutionResult = async (result: CommissionExecutionResult): Promise<void> => {
  // This would be implemented to save the result to the backend
  console.log('Saving execution result:', result.executionId);
  
  // Placeholder for the actual API call
  return Promise.resolve();
};

/**
 * Get all execution results for a given plan
 */
export const getExecutionResults = async (planId: string): Promise<CommissionExecutionResult[]> => {
  // This would be implemented to get results from the backend
  console.log(`Getting execution results for plan: ${planId}`);
  
  // Placeholder for the actual API call
  return Promise.resolve([]);
};

/**
 * Get a specific execution result by ID
 */
export const getExecutionResultById = async (executionId: string): Promise<CommissionExecutionResult | null> => {
  console.log(`Getting execution result for ID: ${executionId}`);
  
  // Try to get from execution logs first
  const log = getLogFromLoggingModule(executionId);
  
  if (log) {
    // Convert log to execution result
    return {
      executionId: log.executionId,
      planId: 'Unknown', // We don't store this in the log directly
      executionMode: log.mode,
      executionDate: log.startTime,
      periodStart: 'Unknown', // We don't store this in the log directly
      periodEnd: 'Unknown', // We don't store this in the log directly
      status: log.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
      timestamp: log.startTime,
      totalCommission: log.summary?.totalCommission || 0,
      participantResults: [], // We would need to extract this from the logs
      logSummary: {
        totalEntries: log.entries.length,
        errors: log.summary?.errors || 0,
        warnings: log.summary?.warnings || 0
      }
    };
  }
  
  // If not in memory, we would try to fetch from database
  return Promise.resolve(null);
};

/**
 * Get detailed execution log for a specific execution
 */
export const getExecutionLog = (executionId: string) => {
  return getLogFromLoggingModule(executionId);
};
