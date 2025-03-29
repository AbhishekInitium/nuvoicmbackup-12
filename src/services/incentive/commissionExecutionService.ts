
/**
 * Commission Execution Service
 * This is the main entry point for commission calculations
 * It coordinates the different execution modules
 */

// Re-export from execution modules
export * from './execution/dataSelectionModule';
export * from './execution/processingModule';
export * from './execution/loggingModule';

// Import the execution service functions
import { 
  executeCommissionCalculation,
  getExecutionResults,
  getExecutionResultById
} from './execution/executionService';

// Import the types with proper syntax for isolatedModules
import type {
  CommissionExecutionParams,
  CommissionExecutionResult,
  ParticipantCommissionResult,
  AdjustmentApplication,
  ExecutionMode
} from './execution/executionService';

// Re-export the execution service functions
export {
  executeCommissionCalculation,
  getExecutionResults,
  getExecutionResultById
};

// Re-export the types using 'export type' for isolatedModules compatibility
export type {
  CommissionExecutionParams,
  CommissionExecutionResult,
  ParticipantCommissionResult,
  AdjustmentApplication,
  ExecutionMode
};

// Note: We're not re-exporting getExecutionLog from executionService to avoid conflict
