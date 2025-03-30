
import { IncentivePlanWithStatus } from '../types/incentiveServiceTypes';
import { MOCK_SCHEMES } from '@/constants/incentiveConstants';

/**
 * Helper function to generate mock incentive plans
 */
export const getMockIncentivePlans = (): IncentivePlanWithStatus[] => {
  console.log('Using mock incentive plans data');
  return MOCK_SCHEMES.map(mock => ({
    name: mock.name,
    schemeId: `MOCK_${Date.now().toString()}`,
    description: mock.description,
    status: 'APPROVED' as const,
    effectiveStart: '2023-01-01',
    effectiveEnd: '2023-12-31',
    currency: 'USD',
    revenueBase: 'salesOrders',
    participants: ['ALL'],
    salesQuota: 100000,
    commissionStructure: { 
      tiers: [
        { from: 0, to: 50000, rate: 0.01 },
        { from: 50001, to: 100000, rate: 0.02 },
        { from: 100001, to: -1, rate: 0.03 }
      ] 
    },
    measurementRules: { 
      primaryMetrics: [{ 
        field: 'TotalAmount', 
        operator: '>', 
        value: 0,
        description: 'Net Revenue' 
      }],
      minQualification: 0,
      adjustments: [{
        id: 'adj1',
        description: 'Default adjustment',
        impact: 1.1,
        type: 'PERCENTAGE_BOOST'
      }],
      exclusions: []
    },
    creditRules: { levels: [] },
    customRules: [],
    hasBeenExecuted: false,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      status: 'APPROVED'
    }
  }));
};
