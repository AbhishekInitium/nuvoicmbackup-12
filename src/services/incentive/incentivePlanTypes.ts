
import { IncentivePlan, Metadata } from '@/types/incentiveTypes';

export type IncentiveStatus = 'DRAFT' | 'APPROVED' | 'SIMULATION' | 'PRODUCTION';

export interface IncentivePlanWithStatus extends IncentivePlan {
  status: IncentiveStatus;
  lastExecutionDate?: string;
  hasBeenExecuted?: boolean;
  metadata: Metadata; // Make metadata required in this interface
}
