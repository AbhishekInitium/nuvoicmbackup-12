
import { useState, useEffect } from 'react';
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { useSchemeCopy } from './useSchemeCopy';
import { usePlanSave } from './usePlanSave';

/**
 * Main hook that coordinates incentive plan operations 
 * by composing smaller, focused hooks
 */
export const useIncentivePlan = (
  initialPlan: IncentivePlan | null = null,
  savePlanFunction?: (plan: Partial<IncentivePlanWithStatus>, options: any) => void,
  refetchPlans?: () => void
) => {
  const { plan: copyPlan, setPlan: setInternalPlan, createNewScheme: createNew, copyExistingScheme: copyScheme } = useSchemeCopy();
  const [plan, setPlan] = useState<IncentivePlan>(initialPlan || DEFAULT_PLAN);
  
  // Pass the current plan state to the save hook
  const { savePlanToS4 } = usePlanSave(plan, savePlanFunction, refetchPlans);

  useEffect(() => {
    if (initialPlan) {
      setPlan(initialPlan);
    }
  }, [initialPlan]);

  useEffect(() => {
    if (copyPlan) {
      setPlan(copyPlan);
    }
  }, [copyPlan]);

  /**
   * Updates a specific section of the plan
   */
  const updatePlan = (section: string, value: any) => {
    setPlan({
      ...plan,
      [section]: value
    });
  };

  /**
   * Creates a new empty incentive scheme
   */
  const createNewScheme = () => {
    const emptyPlan: IncentivePlan = {
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      // Ensure schemeId is included to satisfy the IncentivePlan type
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
    };
    
    setPlan(emptyPlan);
    createNew(emptyPlan);
  };

  /**
   * Copies an existing scheme to create a new one
   */
  const copyExistingScheme = (scheme: IncentivePlanWithStatus | IncentivePlan) => {
    copyScheme(scheme);
  };

  return {
    plan,
    updatePlan,
    createNewScheme,
    copyExistingScheme,
    savePlanToS4
  };
};
