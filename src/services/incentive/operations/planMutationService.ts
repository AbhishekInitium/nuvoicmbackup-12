
import { S4_API_BASE_URL, s4Request } from '../../base/s4BaseService';
import { IncentivePlanWithStatus, IncentiveStatus } from '../types/incentiveServiceTypes';
import { mapPlanToS4Entity } from '../utils/incentiveMappers';

/**
 * Save an incentive plan to S/4 HANA or HANA Cloud
 */
export const saveIncentivePlan = async (plan: IncentivePlanWithStatus): Promise<any> => {
  try {
    // Transform plan to match S/4 HANA entity structure
    const transformedPlan = mapPlanToS4Entity(plan);
    
    // Create or update the plan
    const response = await s4Request<any>(
      'POST',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan`,
      transformedPlan
    );
    
    return response;
  } catch (error) {
    console.error('Error saving incentive plan:', error);
    throw error;
  }
};

/**
 * Update the status of an incentive plan
 */
export const updateIncentiveStatus = async (
  planId: string, 
  status: IncentiveStatus
): Promise<any> => {
  try {
    return s4Request<any>(
      'PATCH',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan(${planId})`,
      {
        Status: status
      }
    );
  } catch (error) {
    console.error('Error updating incentive plan status:', error);
    throw error;
  }
};

/**
 * Mark a plan as executed
 */
export const markPlanAsExecuted = async (planId: string): Promise<any> => {
  try {
    return s4Request<any>(
      'PATCH',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan(${planId})`,
      {
        HasBeenExecuted: true,
        LastExecutionDate: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Error marking plan as executed:', error);
    throw error;
  }
};
