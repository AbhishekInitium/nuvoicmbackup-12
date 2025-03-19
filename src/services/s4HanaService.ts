
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG, API_ENDPOINTS } from '@/config/sapConfig';
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * S/4 HANA Service
 * Service for interacting with SAP S/4 HANA APIs
 */

// Base URL for S/4 HANA API - would be configured based on your environment
const S4_API_BASE_URL = process.env.S4_API_BASE_URL || 'https://s4hana.example.com';

/**
 * Create full API URL for S/4 HANA endpoints
 */
const getS4Url = (service: string, entity: string): string => {
  return `${S4_API_BASE_URL}${SAP_CONFIG.s4hana.apiBasePath}/${service}/${entity}`;
};

/**
 * Generic API request function for S/4 HANA
 */
const s4Request = async <T>(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = await createAuthenticatedRequest({
      method,
      url,
      data,
      params
    });
    
    const response = await axios(config);
    return response.data as T;
  } catch (error) {
    console.error(`S/4 HANA API Error (${url}):`, error);
    throw error;
  }
};

/**
 * Get sales data from S/4 HANA
 */
export const getSalesData = async (
  employeeId?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: any = {};
  
  if (employeeId) params['$filter'] = `EmployeeID eq '${employeeId}'`;
  if (startDate) params['$filter'] = (params['$filter'] ? `${params['$filter']} and ` : '') + `CreationDate ge datetime'${startDate}'`;
  if (endDate) params['$filter'] = (params['$filter'] ? `${params['$filter']} and ` : '') + `CreationDate le datetime'${endDate}'`;
  
  return s4Request<any>(
    'GET',
    getS4Url(SAP_CONFIG.s4hana.services.salesOrders, 'A_SalesOrder'),
    undefined,
    {
      ...params,
      '$select': 'SalesOrder,SalesOrganization,TotalNetAmount,SalesOrderType,CreationDate,SoldToParty',
      '$expand': 'to_Item'
    }
  );
};

/**
 * Get employee data from S/4 HANA
 */
export const getEmployeeData = async (employeeId?: string) => {
  const params: any = {
    '$select': 'PersonWorkAgreement,PersonExternalID,FirstName,LastName,OrganizationalUnit'
  };
  
  if (employeeId) {
    params['$filter'] = `PersonExternalID eq '${employeeId}'`;
  }
  
  return s4Request<any>(
    'GET',
    getS4Url(SAP_CONFIG.s4hana.services.employees, 'A_WorkforcePersonAssignment'),
    undefined,
    params
  );
};

/**
 * Get incentive plans from S/4 HANA or HANA Cloud
 */
export const getIncentivePlans = async (): Promise<IncentivePlan[]> => {
  try {
    // In production, this would call your custom OData service or CDS view
    // For now, we'll simulate a response based on the default plan structure
    const response = await s4Request<any>(
      'GET',
      `${S4_API_BASE_URL}/zincentivenovo/IncentivePlan`,
      undefined,
      { '$expand': 'CommissionStructure,MeasurementRules,CreditRules,CustomRules' }
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
export const saveIncentivePlan = async (plan: IncentivePlan): Promise<any> => {
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
