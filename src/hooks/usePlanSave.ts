
import { IncentivePlan } from '@/types/incentiveTypes';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { usePlanValidation } from './usePlanValidation';

/**
 * Custom hook for saving incentive plans
 */
export const usePlanSave = (
  plan: IncentivePlan | null,
  savePlanFunction?: (plan: Partial<IncentivePlanWithStatus>, options: any) => void,
  refetchPlans?: () => void
) => {
  const { toast } = useToast();
  const { validatePlan } = usePlanValidation();

  /**
   * Saves the current plan to S/4
   */
  const savePlanToS4 = () => {
    if (!savePlanFunction || !plan) return;
    
    const { isValid, errors } = validatePlan(plan);
    
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
    savePlanToS4
  };
};
