
import { IncentivePlanWithStatus } from '../types/incentiveServiceTypes';

/**
 * Maps raw S/4 HANA API response to IncentivePlanWithStatus interface
 */
export const mapS4ResponseToPlan = (item: any): IncentivePlanWithStatus => {
  return {
    name: item.Name || 'Unnamed Plan',
    schemeId: item.SchemeId || '',
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
            id: adj.Id || '',
            description: adj.Description || '',
            impact: adj.Impact || 1,
            type: adj.Type || 'PERCENTAGE_BOOST',
            field: adj.Field || '',
            operator: adj.Operator || '=',
            value: adj.Value || ''
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
      : [],
    metadata: {
      createdAt: item.CreatedAt || new Date().toISOString(),
      updatedAt: item.UpdatedAt || new Date().toISOString(),
      version: item.Version || 1,
      status: item.Status || 'DRAFT'
    }
  };
};

/**
 * Maps IncentivePlanWithStatus to S/4 HANA API entity structure
 */
export const mapPlanToS4Entity = (plan: IncentivePlanWithStatus): any => {
  return {
    Name: plan.name,
    SchemeId: plan.schemeId,
    Description: plan.description,
    EffectiveStart: plan.effectiveStart,
    EffectiveEnd: plan.effectiveEnd,
    Currency: plan.currency,
    RevenueBase: plan.revenueBase,
    Participants: plan.participants.join(','),
    Status: plan.status || 'DRAFT',
    // Additional transformations would be done here based on your actual entity model
  };
};
