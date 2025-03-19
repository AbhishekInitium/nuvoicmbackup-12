
/**
 * S/4 HANA Service Exports
 * This file re-exports all S/4 HANA services to maintain backward compatibility
 */

// Re-export all services from their respective domain files
export * from './sales/salesService';
export * from './hr/employeeService';
export * from './incentive/incentivePlanService';
