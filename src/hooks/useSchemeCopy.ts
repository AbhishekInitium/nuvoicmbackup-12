
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlan, PrimaryMetric, MeasurementRules } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus, IncentiveStatus } from '@/services/incentive/types/incentiveServiceTypes';

/**
 * Custom hook for copying and creating incentive schemes
 */
export const useSchemeCopy = () => {
  const { toast } = useToast();
  const [plan, setPlan] = useState<IncentivePlan | null>(null);

  /**
   * Creates a new empty incentive scheme
   */
  const createNewScheme = (defaultPlan: IncentivePlan) => {
    setPlan({
      ...defaultPlan,
      participants: [],
      salesQuota: 0,
      schemeId: '',
      name: '',
      description: '',
      commissionStructure: {
        tiers: []
      },
      measurementRules: {
        primaryMetrics: [],
        minQualification: 0,
        adjustments: [],
        exclusions: []
      },
      creditRules: {
        levels: []
      },
      customRules: []
    });
    
    toast({
      title: "New Scheme",
      description: "Started a new incentive scheme",
      variant: "default"
    });
  };

  /**
   * Copies an existing scheme to create a new one
   */
  const copyExistingScheme = (scheme: IncentivePlanWithStatus | IncentivePlan) => {
    const {
      name,
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules,
      creditRules,
      customRules,
      salesQuota = 0
    } = scheme;
    
    const status = 'status' in scheme 
      ? scheme.status 
      : (scheme.metadata?.status || 'DRAFT') as IncentiveStatus;
    
    const defaultField = revenueBase === 'salesOrders' ? 'TotalAmount' : 'InvoiceAmount';
    const defaultMetrics: PrimaryMetric[] = [{ 
      field: defaultField, 
      operator: '>', 
      value: 0, 
      description: 'Qualifying Revenue' 
    }];
    
    const primaryMetrics = measurementRules?.primaryMetrics;
    
    const fixedMeasurementRules: MeasurementRules = {
      ...measurementRules,
      primaryMetrics: Array.isArray(primaryMetrics) && primaryMetrics.length > 0
        ? primaryMetrics.map(metric => ({
            field: metric.field || defaultField,
            operator: metric.operator || '>',
            value: metric.value || 0,
            description: metric.description || 'Qualifying criteria'
          }))
        : defaultMetrics
    };
    
    const planData: IncentivePlan = {
      name: `Copy of ${name}`,
      schemeId: '',
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules: fixedMeasurementRules,
      creditRules,
      customRules,
      salesQuota: typeof salesQuota === 'string' ? parseInt(salesQuota) || 0 : salesQuota
    };
    
    setPlan(planData);
    
    toast({
      title: "Plan Loaded",
      description: `Loaded plan: ${scheme.name}`,
      variant: "default"
    });
  };

  return {
    plan,
    setPlan,
    createNewScheme,
    copyExistingScheme
  };
};
