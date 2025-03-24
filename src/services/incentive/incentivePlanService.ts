
import { S4_API_BASE_URL, s4Request } from '../base/s4BaseService';
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * S/4 HANA Incentive Plan Service
 * Service for interacting with incentive plan data from S/4 HANA
 */

export type IncentiveStatus = 'DRAFT' | 'APPROVED';

export interface IncentivePlanWithStatus extends IncentivePlan {
  status: IncentiveStatus;
  lastExecutionDate?: string;
  hasBeenExecuted?: boolean;
}

/**
 * Get incentive plans from S/4 HANA or HANA Cloud
 */
export const getIncentivePlans = async (statusFilter?: IncentiveStatus): Promise<IncentivePlanWithStatus[]> => {
  try {
    // In production, this would call your custom OData service or CDS view
    // For now, we'll simulate a response based on the default plan structure
    const response = await s4Request<any>(
      'GET',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan`,
      undefined,
      { 
        '$expand': 'CommissionStructure,MeasurementRules,CreditRules,CustomRules',
        '$filter': statusFilter ? `Status eq '${statusFilter}'` : undefined
      }
    );
    
    // Transform response to match IncentivePlan interface
    return response.value.map((item: any) => ({
      name: item.Name,
      description: item.Description,
      effectiveStart: item.EffectiveStart,
      effectiveEnd: item.EffectiveEnd,
      currency: item.Currency,
      revenueBase: item.RevenueBase,
      participants: item.Participants.split(','),
      status: item.Status || 'DRAFT',
      lastExecutionDate: item.LastExecutionDate,
      hasBeenExecuted: item.HasBeenExecuted || false,
      commissionStructure: {
        tiers: item.CommissionStructure.map((tier: any) => ({
          from: tier.FromAmount,
          to: tier.ToAmount,
          rate: tier.Rate
        }))
      },
      measurementRules: {
        primaryMetric: item.MeasurementRules.PrimaryMetric,
        minQualification: item.MeasurementRules.MinQualification,
        adjustments: item.MeasurementRules.Adjustments.map((adj: any) => ({
          field: adj.Field,
          operator: adj.Operator,
          value: adj.Value,
          factor: adj.Factor,
          description: adj.Description
        })),
        exclusions: item.MeasurementRules.Exclusions.map((excl: any) => ({
          field: excl.Field,
          operator: excl.Operator,
          value: excl.Value,
          description: excl.Description
        }))
      },
      creditRules: {
        levels: item.CreditRules.map((cr: any) => ({
          name: cr.Name,
          percentage: cr.Percentage
        }))
      },
      customRules: item.CustomRules.map((rule: any) => ({
        name: rule.Name,
        description: rule.Description,
        conditions: rule.Conditions.map((cond: any) => ({
          period: cond.Period,
          metric: cond.Metric,
          operator: cond.Operator,
          value: cond.Value
        })),
        action: rule.Action,
        active: rule.Active
      }))
    }));
  } catch (error) {
    console.error('Error fetching incentive plans:', error);
    throw error;
  }
};

/**
 * Save an incentive plan to S/4 HANA or HANA Cloud
 */
export const saveIncentivePlan = async (plan: IncentivePlanWithStatus): Promise<any> => {
  try {
    // Transform plan to match S/4 HANA entity structure
    const transformedPlan = {
      Name: plan.name,
      Description: plan.description,
      EffectiveStart: plan.effectiveStart,
      EffectiveEnd: plan.effectiveEnd,
      Currency: plan.currency,
      RevenueBase: plan.revenueBase,
      Participants: plan.participants.join(','),
      Status: plan.status || 'DRAFT',
      // Additional transformations would be done here based on your actual entity model
    };
    
    // Create or update the plan
    return s4Request<any>(
      'POST',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan`,
      transformedPlan
    );
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
