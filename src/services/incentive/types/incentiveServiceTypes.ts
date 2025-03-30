
import { IncentivePlan, PlanMetadata } from '@/types/incentiveTypes';

/**
 * Service-specific type definitions for incentive plans
 */

export type IncentiveStatus = 'DRAFT' | 'APPROVED' | 'SIMULATION' | 'PRODUCTION';

export interface IncentivePlanWithStatus extends IncentivePlan {
  status: IncentiveStatus;
  lastExecutionDate?: string;
  hasBeenExecuted?: boolean;
  metadata: PlanMetadata; // Make metadata required in this interface
}
