
import { S4_API_BASE_URL, s4Request } from '../base/s4BaseService';
import { IncentivePlanWithStatus, IncentiveStatus } from './incentivePlanTypes';
import { getMockIncentivePlans } from './mockIncentiveData';

/**
 * Get incentive plans from S/4 HANA or HANA Cloud
 */
export const getIncentivePlans = async (statusFilter?: IncentiveStatus): Promise<IncentivePlanWithStatus[]> => {
  try {
    // In production, this would call your custom OData service or CDS view
    console.log('Fetching incentive plans from S/4 HANA');
    const response = await s4Request<any>(
      'GET',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan`,
      undefined,
      { 
        '$expand': 'CommissionStructure,MeasurementRules,CreditRules,CustomRules',
        '$filter': statusFilter ? `Status eq '${statusFilter}'` : undefined
      }
    );
    
    console.log('Raw response from IncentivePlan API:', response);
    
    // Check if response is valid (has a value property that's an array)
    if (response && response.value && Array.isArray(response.value) && response.value.length > 0) {
      console.log('Valid response structure with', response.value.length, 'plans');
      
      // Transform response to match IncentivePlanWithStatus interface
      return response.value.map((item: any) => ({
        name: item.Name || 'Unnamed Plan',
        description: item.Description || '',
        effectiveStart: item.EffectiveStart || new Date().toISOString().split('T')[0],
        effectiveEnd: item.EffectiveEnd || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        currency: item.Currency || 'USD',
        revenueBase: item.RevenueBase || 'salesOrders',
        participants: item.Participants ? item.Participants.split(',') : ['ALL'],
        status: item.Status || 'DRAFT',
        lastExecutionDate: item.LastExecutionDate,
        hasBeenExecuted: item.HasBeenExecuted || false,
        salesQuota: item.SalesQuota || 100000,
        commissionStructure: {
          tiers: Array.isArray(item.CommissionStructure) 
            ? item.CommissionStructure.map((tier: any) => ({
                from: tier.FromAmount || 0,
                to: tier.ToAmount || 0,
                rate: tier.Rate || 0
              }))
            : []
        },
        measurementRules: {
          primaryMetrics: Array.isArray(item.MeasurementRules?.PrimaryMetrics) 
            ? item.MeasurementRules.PrimaryMetrics.map((metric: any) => ({
                field: metric.Field || 'TotalAmount',
                operator: metric.Operator || '>',
                value: metric.Value || 0, 
                description: metric.Description || 'Net Revenue'
              }))
            : [{ 
                field: 'TotalAmount', 
                operator: '>', 
                value: 0,
                description: item.MeasurementRules?.PrimaryMetric || 'Net Revenue' 
              }],
          minQualification: item.MeasurementRules?.MinQualification || 0,
          adjustments: Array.isArray(item.MeasurementRules?.Adjustments) 
            ? item.MeasurementRules.Adjustments.map((adj: any) => ({
                field: adj.Field || '',
                operator: adj.Operator || '=',
                value: adj.Value || '',
                factor: adj.Factor || 1,
                description: adj.Description || ''
              }))
            : [],
          exclusions: Array.isArray(item.MeasurementRules?.Exclusions)
            ? item.MeasurementRules.Exclusions.map((excl: any) => ({
                field: excl.Field || '',
                operator: excl.Operator || '=',
                value: excl.Value || '',
                description: excl.Description || ''
              }))
            : []
        },
        creditRules: {
          levels: Array.isArray(item.CreditRules)
            ? item.CreditRules.map((cr: any) => ({
                name: cr.Name || '',
                percentage: cr.Percentage || 0
              }))
            : []
        },
        customRules: Array.isArray(item.CustomRules)
          ? item.CustomRules.map((rule: any) => ({
              name: rule.Name || '',
              description: rule.Description || '',
              conditions: Array.isArray(rule.Conditions)
                ? rule.Conditions.map((cond: any) => ({
                    period: cond.Period || 'monthly',
                    metric: cond.Metric || 'sales',
                    operator: cond.Operator || '>',
                    value: cond.Value || 0
                  }))
                : [],
              action: rule.Action || '',
              active: rule.Active || false
            }))
          : []
      }));
    } else {
      // If we get a response but it doesn't have the expected structure
      console.warn('Invalid response structure from incentive plans API, falling back to mock data');
      return getMockIncentivePlans();
    }
  } catch (error) {
    console.error('Error fetching incentive plans:', error);
    return getMockIncentivePlans();
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
