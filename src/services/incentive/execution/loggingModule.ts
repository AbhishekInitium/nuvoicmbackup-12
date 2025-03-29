
import { v4 as uuidv4 } from 'uuid';

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  category: string;
  message: string;
  level: LogLevel;
  executionId: string;
  details?: any;
}

export interface ExecutionLog {
  executionId: string;
  startTime: string;
  endTime?: string;
  status: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  mode: 'SIMULATE' | 'PRODUCTION';
  entries: LogEntry[];
  summary?: {
    totalRecordsProcessed: number;
    participantsProcessed: number;
    totalCommission: number;
    errors: number;
    warnings: number;
  };
}

// In-memory store for execution logs
// This would be replaced by a database in a production environment
const executionLogs: Map<string, ExecutionLog> = new Map();

/**
 * Create a new execution log
 */
export const createExecutionLog = (
  executionId: string, 
  mode: 'SIMULATE' | 'PRODUCTION'
): ExecutionLog => {
  const log: ExecutionLog = {
    executionId,
    startTime: new Date().toISOString(),
    status: 'STARTED',
    mode,
    entries: []
  };
  
  // Store the log
  executionLogs.set(executionId, log);
  
  // Add initial entry
  addSystemLogEntry(executionId, 'Execution', `Started ${mode} execution`, 'INFO');
  
  return log;
};

/**
 * Add a log entry to the system log
 */
export const addSystemLogEntry = (
  executionId: string, 
  category: string, 
  message: string, 
  level: LogLevel = 'INFO', 
  details?: any
): LogEntry => {
  const log = executionLogs.get(executionId);
  
  if (!log) {
    console.error(`Execution log not found for ID: ${executionId}`);
    return null;
  }
  
  const entry: LogEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    category,
    message,
    level,
    executionId,
    details
  };
  
  log.entries.push(entry);
  
  // Update log status for errors
  if (level === 'ERROR' && log.status !== 'FAILED') {
    log.status = 'FAILED';
  } else if (log.status === 'STARTED') {
    log.status = 'IN_PROGRESS';
  }
  
  return entry;
};

/**
 * Add a log entry to a participant's log array
 */
export const addLogEntry = (
  logEntries: LogEntry[], 
  category: string, 
  message: string, 
  level: LogLevel = 'INFO', 
  executionId: string,
  details?: any
): LogEntry => {
  const entry: LogEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    category,
    message,
    level,
    executionId,
    details
  };
  
  logEntries.push(entry);
  
  // Also add to the system log for completeness
  addSystemLogEntry(executionId, category, message, level, details);
  
  return entry;
};

/**
 * Complete an execution log
 */
export const completeExecutionLog = (
  executionId: string, 
  success: boolean, 
  summary?: {
    totalRecordsProcessed: number;
    participantsProcessed: number;
    totalCommission: number;
  }
): void => {
  const log = executionLogs.get(executionId);
  
  if (!log) {
    console.error(`Execution log not found for ID: ${executionId}`);
    return;
  }
  
  log.endTime = new Date().toISOString();
  log.status = success ? 'COMPLETED' : 'FAILED';
  
  if (summary) {
    // Count errors and warnings
    const errors = log.entries.filter(e => e.level === 'ERROR').length;
    const warnings = log.entries.filter(e => e.level === 'WARNING').length;
    
    log.summary = {
      ...summary,
      errors,
      warnings
    };
  }
  
  // Add final log entry
  addSystemLogEntry(
    executionId, 
    'Execution', 
    `${log.mode} execution ${success ? 'completed successfully' : 'failed'}`,
    success ? 'INFO' : 'ERROR'
  );
};

/**
 * Get a specific execution log
 */
export const getExecutionLog = (executionId: string): ExecutionLog | undefined => {
  return executionLogs.get(executionId);
};

/**
 * Get all execution logs
 */
export const getAllExecutionLogs = (): ExecutionLog[] => {
  return Array.from(executionLogs.values());
};

/**
 * Save execution logs to a persistent store
 * This is a placeholder for integration with a database
 */
export const persistExecutionLogs = async (): Promise<void> => {
  // Placeholder for database integration
  console.log(`Persisting ${executionLogs.size} execution logs`);
};

/**
 * Load execution logs from a persistent store
 * This is a placeholder for integration with a database
 */
export const loadExecutionLogs = async (): Promise<void> => {
  // Placeholder for database integration
  console.log('Loading execution logs from persistent store');
};
