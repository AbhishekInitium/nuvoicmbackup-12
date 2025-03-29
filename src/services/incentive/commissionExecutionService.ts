
/**
 * Commission Execution Service
 * This is the main entry point for commission calculations
 * It coordinates the different execution modules
 */

// Re-export from execution modules
export * from './execution/executionService';
export * from './execution/dataSelectionModule';
export * from './execution/processingModule';
export * from './execution/loggingModule';

// Import and re-export the execution types and interfaces for backwards compatibility
import { 
  ExecutionMode,
  CommissionExecutionParams,
  CommissionExecutionResult,
  ParticipantCommissionResult,
  AdjustmentApplication,
  executeCommissionCalculation,
  getExecutionResults,
  getExecutionResultById
} from './execution/executionService';

export {
  ExecutionMode,
  CommissionExecutionParams,
  CommissionExecutionResult,
  ParticipantCommissionResult,
  AdjustmentApplication,
  executeCommissionCalculation,
  getExecutionResults,
  getExecutionResultById
};
