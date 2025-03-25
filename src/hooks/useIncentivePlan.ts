
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

  const validatePlan = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Validate required basic fields
    if (!plan.name) errors.push("Plan Name is required");
    if (!plan.effectiveStart) errors.push("Start Date is required");
    if (!plan.effectiveEnd) errors.push("End Date is required");
    
    // Validate Revenue Base
    if (!plan.revenueBase) errors.push("Revenue Base is required");
    
    // Validate Participants
    if (!plan.participants || plan.participants.length === 0) {
      errors.push("At least one participant must be assigned");
    }
    
    // Validate Credit Levels
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
    
    // Validate the plan
    const { isValid, errors } = validatePlan();
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
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
