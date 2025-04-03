
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlan, PlanMetadata } from '@/types/incentiveTypes';
import { saveIncentiveScheme, updateIncentiveScheme } from '@/services/database/mongoDBService';
import { validatePlanFields } from '@/utils/validationUtils';

interface UseSaveIncentivePlanProps {
  plan: IncentivePlan;
  schemeId: string;
  versionNumber: number;
  isEditMode: boolean;
  onSaveSuccess?: () => void;
}

export const useSaveIncentivePlan = ({ 
  plan, 
  schemeId, 
  versionNumber, 
  isEditMode,
  onSaveSuccess
}: UseSaveIncentivePlanProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!plan) {
      toast({
        title: "Validation Error",
        description: "Please provide scheme details before saving",
        variant: "destructive"
      });
      return;
    }

    const validationErrors = validatePlanFields(plan);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Create metadata with the correct version, ensuring all required fields are present
      const metadata: PlanMetadata = {
        createdAt: plan.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: versionNumber,
        status: plan.metadata?.status || 'DRAFT'
      };
      
      // Ensure the selectedSchemeConfig is properly included in the plan to save
      const schemeToSave: IncentivePlan = {
        ...plan,
        schemeId: schemeId,
        metadata: metadata,
        // Explicitly include the selectedSchemeConfig to ensure it gets saved
        selectedSchemeConfig: plan.selectedSchemeConfig || null
      };
      
      console.log("Saving scheme with configuration:", schemeToSave.selectedSchemeConfig);
      
      let id: string | null = null;
      
      if (isEditMode) {
        // For updates, we create a new document with the same schemeId but increased version
        try {
          const success = await updateIncentiveScheme(schemeId, schemeToSave);
          if (success) {
            toast({
              title: "Success",
              description: `Scheme "${plan.name}" updated successfully (Version ${versionNumber})`,
              variant: "default"
            });
            
            if (onSaveSuccess) {
              onSaveSuccess();
            }
            
            id = schemeId;
          } else {
            throw new Error('Failed to create new version');
          }
        } catch (error) {
          throw error;
        }
      } else {
        // For new schemes, simply save
        id = await saveIncentiveScheme(schemeToSave, 'DRAFT');
        
        toast({
          title: "Success",
          description: `New scheme "${plan.name}" created successfully`,
          variant: "default"
        });
        
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }
      
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';
        
      toast({
        title: "Save Error",
        description: `Failed to save scheme: ${errorMessage}. Make sure the server is running.`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSave,
    isSaving
  };
};
