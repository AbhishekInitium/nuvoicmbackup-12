
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
  const [showStorageNotice, setShowStorageNotice] = useState(false);

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
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log("Saving plan, isEditMode:", isEditMode, "versionNumber:", versionNumber);
      
      // Create metadata with the correct version, ensuring all required fields are present
      const metadata: PlanMetadata = {
        createdAt: plan.metadata?.createdAt || new Date().toISOString(), // Always ensure createdAt is present
        updatedAt: new Date().toISOString(),
        version: versionNumber,
        status: plan.metadata?.status || 'DRAFT'
      };
      
      console.log("Current plan metadata:", plan.metadata);
      console.log("New metadata to use:", metadata);
      
      const schemeToSave: IncentivePlan = {
        ...plan,
        schemeId: schemeId,
        metadata: metadata
      };
      
      let id: string | null = null;
      
      if (isEditMode) {
        // For updates, we create a new document with the same schemeId but increased version
        console.log("Creating new version for scheme:", schemeId, "with version:", versionNumber);
        try {
          console.log("About to call updateIncentiveScheme with:", {
            schemeId,
            version: versionNumber
          });
          
          const success = await updateIncentiveScheme(schemeId, schemeToSave);
          if (success) {
            // If successful, update the local version number
            console.log("Successfully created version:", versionNumber);
            
            toast({
              title: "New Version Created",
              description: `Scheme "${plan.name || 'Unnamed'}" saved as version ${versionNumber}`,
              variant: "default"
            });
            
            setShowStorageNotice(true);
            
            if (onSaveSuccess) {
              onSaveSuccess();
            }
            
            id = schemeId;
          } else {
            throw new Error('Failed to create new version');
          }
        } catch (error) {
          console.error('Error creating new version:', error);
          throw error;
        }
      } else {
        // For new schemes, simply save
        console.log("Saving new scheme");
        id = await saveIncentiveScheme(schemeToSave, 'DRAFT');
        
        toast({
          title: "Scheme Saved",
          description: `Scheme "${plan.name || 'Unnamed'}" saved with ID: ${id}`,
          variant: "default"
        });
        
        setShowStorageNotice(true);
        
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }
      
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      
      // Provide more detailed error message
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
    isSaving,
    showStorageNotice,
    setShowStorageNotice
  };
};
