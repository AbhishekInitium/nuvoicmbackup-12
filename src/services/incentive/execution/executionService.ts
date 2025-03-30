
import { v4 as uuidv4 } from 'uuid';
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus, markPlanAsExecuted } from '../incentivePlanService';
import { selectPrimaryData, applyQualifyingCriteria, DataSelectionParams } from './dataSelectionModule';
import { processData, ProcessedData } from './processingModule';
import { 
  createExecutionLog, 
  completeExecutionLog, 
  getExecutionLog as getLogFromLoggingModule, 
  addSystemLogEntry,
  LogEntry,
  addLogEntry,
  LogLevel
} from './loggingModule';

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
  salesOrderNumber?: string; // Added to filter by specific sales order
  salesRepId?: string;       // Added to filter by specific sales rep
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
  dataSelection?: {
    totalRecords: number;
    qualifiedRecords: number;
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
  logEntries?: LogEntry[]; // Added to store participant-specific log entries
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
    // SECTION 1: DATA SELECTION - Select primary data based on revenue base
    addSystemLogEntry(executionId, 'Execution Start', 'Starting execution with plan: ' + plan.name, 'INFO');
    addSystemLogEntry(executionId, 'Execution Parameters', JSON.stringify(params), 'INFO');
    
    addSystemLogEntry(executionId, 'Data Selection', 'Starting data selection phase', 'INFO');
    
    const dataSelectionParams: DataSelectionParams = {
      planId: plan.name,
      planStartDate: params.periodStart,
      processingDate: params.executionDate,
      salesOrgs: params.salesOrgs,
      participants: params.participants || plan.participants,
      salesOrderNumber: params.salesOrderNumber, // Add filter by sales order number
      salesRepId: params.salesRepId           // Add filter by sales rep ID
    };
    
    const selectedData = await selectPrimaryData(plan, dataSelectionParams);
    
    // Log data selection results
    addSystemLogEntry(
      executionId, 
      'Data Selection Results', 
      `Selected ${selectedData.records.length} records from ${plan.revenueBase} for processing`,
      'INFO',
      {
        source: plan.revenueBase,
        totalRecords: selectedData.records.length,
        dateRange: selectedData.metadata.filterApplied.dateRange,
        salesOrgs: selectedData.metadata.filterApplied.salesOrgs,
        participants: selectedData.metadata.filterApplied.participants
      }
    );
    
    // SECTION 2: Apply qualifying criteria up front
    addSystemLogEntry(executionId, 'Qualifying Criteria', 'Applying qualifying criteria', 'INFO');
    const qualifiedData = applyQualifyingCriteria(selectedData, plan, executionId);
    
    // Log qualifying criteria results
    const qualificationRate = selectedData.records.length > 0 
      ? Math.round((qualifiedData.records.length / selectedData.records.length) * 100) 
      : 0;
    
    addSystemLogEntry(
      executionId,
      'Qualification Results',
      `${qualifiedData.records.length} of ${selectedData.records.length} records qualified (${qualificationRate}%)`,
      'INFO',
      {
        totalRecords: selectedData.records.length,
        qualifiedRecords: qualifiedData.records.length,
        qualificationRate: `${qualificationRate}%`
      }
    );
    
    // SECTION 3: PROCESSING - Process the data per participant
    addSystemLogEntry(executionId, 'Data Processing', 'Starting data processing phase', 'INFO');
    const processedData = processData(qualifiedData, plan, executionId);
    
    // Log processing results
    addSystemLogEntry(
      executionId,
      'Processing Results',
      `Processed data for ${processedData.participantResults.length} participants with total commission: ${processedData.totalCommissionAmount}`,
      'INFO',
      {
        participantsProcessed: processedData.participantResults.length,
        totalSales: processedData.totalSalesAmount,
        totalCommission: processedData.totalCommissionAmount,
        processingTime: processedData.metadata.processedAt
      }
    );
    
    // SECTION 4: Convert processed data to result format
    const participantResults = processedData.participantResults.map(pr => ({
      participantId: pr.participantId,
      salesAmount: pr.salesAmount,
      commissionAmount: pr.commissionAmount,
      tier: pr.tier,
      appliedRate: pr.appliedRate,
      adjustments: pr.adjustments,
      customRulesApplied: pr.customRulesApplied,
      qualifiedRecords: pr.qualifiedRecords,
      disqualifiedRecords: pr.disqualifiedRecords,
      logEntries: pr.logEntries // Include log entries for this participant
    }));
    
    // SECTION 5: Create result object
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
      dataSelection: {
        totalRecords: selectedData.records.length,
        qualifiedRecords: qualifiedData.records.length
      },
      logSummary: {
        totalEntries: executionLog.entries.length,
        errors: executionLog.entries.filter(e => e.level === 'ERROR').length,
        warnings: executionLog.entries.filter(e => e.level === 'WARNING').length
      }
    };
    
    // SECTION 6: Complete execution log
    addSystemLogEntry(
      executionId,
      'Execution Summary',
      `Execution completed with ${participantResults.length} participants processed and total commission: ${processedData.totalCommissionAmount}`,
      'INFO'
    );
    
    completeExecutionLog(executionId, true, {
      totalRecordsProcessed: selectedData.records.length,
      participantsProcessed: participantResults.length,
      totalCommission: processedData.totalCommissionAmount
    });
    
    // SECTION 7: Save the execution result if this is a production run
    if (params.executionMode === 'PRODUCTION') {
      await saveExecutionResult(result);
      await markPlanAsExecuted(plan.name);
      
      addSystemLogEntry(
        executionId,
        'Production Run',
        `Production run completed and saved with ID: ${executionId}`,
        'INFO'
      );
    } else {
      addSystemLogEntry(
        executionId,
        'Simulation Run',
        `Simulation run completed with ID: ${executionId}`,
        'INFO'
      );
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
