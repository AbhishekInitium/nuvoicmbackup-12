
/**
 * Commission Execution Service
 * This is the main entry point for commission calculations
 * It coordinates the different execution modules
 */

// Re-export from execution modules
export * from './execution/dataSelectionModule';
export * from './execution/processingModule';
export * from './execution/loggingModule';

// Import and re-export the execution service functions
import { 
  ExecutionMode,
  executeCommissionCalculation,
  getExecutionResults,
  getExecutionResultById
} from './execution/executionService';

// Import and re-export the types with proper syntax for isolatedModules
import type {
  CommissionExecutionParams,
  CommissionExecutionResult,
  ParticipantCommissionResult,
  AdjustmentApplication
} from './execution/executionService';

// Re-export the execution service functions
export {
  ExecutionMode,
  executeCommissionCalculation,
  getExecutionResults,
  getExecutionResultById
};

// Re-export the types with proper syntax
export type {
  CommissionExecutionParams,
  CommissionExecutionResult,
  ParticipantCommissionResult,
  AdjustmentApplication
};

// We're not re-exporting getExecutionLog from executionService to avoid conflict
