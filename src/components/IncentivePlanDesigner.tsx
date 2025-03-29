
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { IncentivePlan } from '@/types/incentiveTypes';
import { useIncentivePlan } from '@/hooks/useIncentivePlan';

// Import refactored components
import IncentiveDesignerHeader from './incentive/IncentiveDesignerHeader';
import DesignerActionButtons from './incentive/DesignerActionButtons';
import SectionPanel from './ui-custom/SectionPanel';
import BasicInformation from './incentive/BasicInformation';
import SchemeStructureSections from './incentive/SchemeStructureSections';
import PayoutStructureSection from './incentive/PayoutStructureSection';
import { Button } from './ui/button';
import { Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { saveIncentiveScheme } from '@/services/database/mongoDBService';

interface IncentivePlanDesignerProps {
  initialPlan?: IncentivePlan | null;
  onBack?: () => void;
}

const IncentivePlanDesigner: React.FC<IncentivePlanDesignerProps> = ({ 
  initialPlan = null,
  onBack
}) => {
  const { toast } = useToast();
  const { 
    incentivePlans, 
    loadingPlans, 
    refetchPlans
  } = useS4HanaData();
  
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStorageNotice, setShowStorageNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use the custom hook to manage the plan state and logic
  const {
    plan,
    updatePlan,
    createNewScheme,
    copyExistingScheme
  } = useIncentivePlan(initialPlan, undefined, refetchPlans);

  useEffect(() => {
    // Fetch plans when component mounts
    refetchPlans();
    
    if (!loadingPlans) {
      setIsLoading(false);
    }
  }, [loadingPlans, refetchPlans]);

  const handleSave = async () => {
    if (!plan) {
      toast({
        title: "Validation Error",
        description: "Please provide scheme details before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Use timestamp-based naming if no name is provided
      const schemeName = plan.name || generateTimestampName();
      const schemeToSave = {
        ...plan,
        name: schemeName
      };
      
      const id = await saveIncentiveScheme(schemeToSave, 'DRAFT');
      
      setShowStorageNotice(true);
      
      toast({
        title: "Scheme Saved",
        description: `Scheme "${schemeName}" saved with ID: ${id}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      
      toast({
        title: "Save Error",
        description: `Failed to save scheme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateTimestampName = () => {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).substring(2);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `ICM_${day}${month}${year}_${hours}${minutes}${seconds}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading plans...</div>;
  }

  return (
    <div className="py-12 sm:py-16 px-4 md:px-8 min-h-screen">
      <IncentiveDesignerHeader />

      <div className="max-w-4xl mx-auto">
        <div className="mt-10 mb-6">
          <DesignerActionButtons 
            onBack={onBack}
            showExistingSchemes={showExistingSchemes}
            setShowExistingSchemes={setShowExistingSchemes}
            copyExistingScheme={copyExistingScheme}
            hideSchemeButtons={true}
          />
        </div>

        {showStorageNotice && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              Your scheme has been saved in MongoDB with a timestamp-based name. 
              The scheme status is set to DRAFT.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Section 1: Header Information */}
        <SectionPanel title="1. Header Information" defaultExpanded={true}>
          <BasicInformation 
            plan={plan} 
            updatePlan={updatePlan} 
          />
        </SectionPanel>
        
        {/* Section 2: Scheme Structure */}
        <SchemeStructureSections 
          plan={plan}
          updatePlan={updatePlan}
        />
        
        {/* Section 3: Rates and Payout Structure */}
        <PayoutStructureSection 
          tiers={plan.commissionStructure.tiers}
          currency={plan.currency}
          updateCommissionStructure={(tiers) => updatePlan('commissionStructure', { tiers })}
        />
        
        {/* Save button at the bottom */}
        <div className="mt-10 flex justify-end space-x-4">
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
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
