
import { S4_API_BASE_URL, s4Request } from '../base/s4BaseService';
import { IncentiveStatus } from './incentivePlanTypes';

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

/**
 * Simulate an incentive plan calculation based on real sales data
 */
export const simulateIncentivePlan = async (
  planId: string,
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<any> => {
  try {
    return s4Request<any>(
      'POST',
      `${S4_API_BASE_URL}/zincentivenovo/SimulateIncentive`,
      {
        PlanID: planId,
        EmployeeID: employeeId,
        StartDate: startDate,
        EndDate: endDate
      }
    );
  } catch (error) {
    console.error('Error simulating incentive plan:', error);
    throw error;
  }
};
