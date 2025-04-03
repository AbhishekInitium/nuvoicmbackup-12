import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlan, MeasurementRules, PrimaryMetric } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus, IncentiveStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';

export const useIncentivePlan = (
  initialPlan: IncentivePlan | null = null,
  savePlanFunction?: (plan: Partial<IncentivePlanWithStatus>, options: any) => void,
  refetchPlans?: () => void
) => {
  const { toast } = useToast();
  const [plan, setPlan] = useState<IncentivePlan>(initialPlan || {
    ...DEFAULT_PLAN,
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

  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
    }
  }, [initialPlan]);

  const updatePlan = (section: string, value: any) => {
    setPlan({
      ...plan,
      [section]: value
    });
  };

  const createNewScheme = () => {
    setPlan({
      ...DEFAULT_PLAN,
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

  const validatePlan = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!plan.name) errors.push("Plan Name is required");
    if (!plan.effectiveStart) errors.push("Start Date is required");
    if (!plan.effectiveEnd) errors.push("End Date is required");
    
    if (!plan.revenueBase) errors.push("Revenue Base is required");
    
    if (!plan.participants || plan.participants.length === 0) {
      errors.push("At least one participant must be assigned");
    }
    
    if (!plan.creditRules.levels || plan.creditRules.levels.length === 0) {
      errors.push("At least one Credit Level is required");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const savePlanToS4 = () => {
    if (!savePlanFunction) return;
    
    const { isValid, errors } = validatePlan();
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive"
      });
      return;
    }
    
    const planWithStatus: Partial<IncentivePlanWithStatus> = {
      ...plan,
      status: 'DRAFT'
    };
    
    savePlanFunction(planWithStatus, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Plan saved successfully!",
          variant: "default"
        });
        if (refetchPlans) refetchPlans();
      },
      onError: (error: any) => {
        console.error('Error saving plan:', error);
        toast({
          title: "Error",
          description: "Failed to save plan. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return {
    plan,
    updatePlan,
    createNewScheme,
    copyExistingScheme,
    savePlanToS4
  };
};
