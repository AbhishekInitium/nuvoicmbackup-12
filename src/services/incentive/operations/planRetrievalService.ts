
import { S4_API_BASE_URL, s4Request } from '../../base/s4BaseService';
import { IncentivePlanWithStatus, IncentiveStatus } from '../types/incentiveServiceTypes';
import { mapS4ResponseToPlan } from '../utils/incentiveMappers';
import { getMockIncentivePlans } from '../utils/mockIncentiveData';

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
      return response.value.map((item: any) => mapS4ResponseToPlan(item));
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
