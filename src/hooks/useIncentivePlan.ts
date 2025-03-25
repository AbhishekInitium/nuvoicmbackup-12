
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';

export const useIncentivePlan = (
  initialPlan: IncentivePlan | null = null,
  savePlanFunction?: (plan: Partial<IncentivePlanWithStatus>, options: any) => void,
  refetchPlans?: () => void
) => {
  const { toast } = useToast();
  const [plan, setPlan] = useState<IncentivePlan>({
    ...DEFAULT_PLAN,
    participants: [],
    salesQuota: 0,
    name: '',
    description: ''
  });

  useEffect(() => {
    // Initialize with the provided plan if available
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
      name: '',
      description: ''
    });
    
    toast({
      title: "New Scheme",
      description: "Started a new incentive scheme",
      variant: "default"
    });
  };

  const copyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Extract only the IncentivePlan properties from the IncentivePlanWithStatus
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
    
    const planData: IncentivePlan = {
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
      salesQuota: typeof salesQuota === 'string' ? parseInt(salesQuota) || 0 : salesQuota
    };
    
    setPlan(planData);
    
    toast({
      title: "Plan Loaded",
      description: `Loaded plan: ${scheme.name}`,
      variant: "default"
    });
  };

  const savePlanToS4 = () => {
    if (!savePlanFunction) return;
    
    // Validate required fields
    if (!plan.name || !plan.effectiveStart || !plan.effectiveEnd) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: Name, Start Date, and End Date",
        variant: "destructive"
      });
      return;
    }
    
    // Create a plan with status by combining the current plan with a DRAFT status
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
        // Refetch plans to update the list
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
