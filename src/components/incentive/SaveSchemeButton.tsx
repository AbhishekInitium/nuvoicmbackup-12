
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { IncentivePlan } from '@/types/incentiveTypes';
import { saveIncentiveScheme } from '@/services/database/mongoDBService';
import { validatePlanFields } from '@/utils/incentivePlanValidator';

interface SaveSchemeButtonProps {
  plan: IncentivePlan;
  schemeId: string;
  onSaveComplete: (success: boolean, message?: string) => void;
}

const SaveSchemeButton: React.FC<SaveSchemeButtonProps> = ({ 
  plan, 
  schemeId,
  onSaveComplete 
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!plan) {
      toast({
        title: "Validation Error",
        description: "Please provide scheme details before saving",
        variant: "destructive"
      });
      onSaveComplete(false, "Please provide scheme details before saving");
      return;
    }

    const validationErrors = validatePlanFields(plan);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      onSaveComplete(false, validationErrors.join(", "));
      return;
    }

    try {
      setIsSaving(true);
      
      const schemeToSave = {
        ...plan,
        schemeId: schemeId
      };
      
      const id = await saveIncentiveScheme(schemeToSave, 'DRAFT');
      
      toast({
        title: "Scheme Saved",
        description: `Scheme "${plan.name || 'Unnamed'}" saved with ID: ${id}`,
        variant: "default"
      });
      
      onSaveComplete(true);
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      onSaveComplete(false, errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="default"
      size="lg"
      onClick={handleSave}
      disabled={isSaving}
      className="flex items-center"
    >
      <Save size={18} className="mr-2" /> 
      {isSaving ? "Saving..." : "Save Scheme"}
    </Button>
  );
};

export default SaveSchemeButton;
