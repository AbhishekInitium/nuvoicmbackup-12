
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
import { Database, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface IncentivePlanDesignerProps {
  initialPlan?: IncentivePlan | null;
  onBack?: () => void;
  onSaveToStorage?: (plan: IncentivePlan) => void;
  savingToStorage?: boolean;
}

const IncentivePlanDesigner: React.FC<IncentivePlanDesignerProps> = ({ 
  initialPlan = null,
  onBack,
  onSaveToStorage,
  savingToStorage = false
}) => {
  const { toast } = useToast();
  const { 
    incentivePlans, 
    loadingPlans, 
    savePlan, 
    isSaving,
    refetchPlans
  } = useS4HanaData();
  
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStorageNotice, setShowStorageNotice] = useState(false);

  // Use the custom hook to manage the plan state and logic
  const {
    plan,
    updatePlan,
    createNewScheme,
    copyExistingScheme,
    savePlanToS4
  } = useIncentivePlan(initialPlan, savePlan, refetchPlans);

  useEffect(() => {
    // Fetch plans when component mounts
    refetchPlans();
    
    if (!loadingPlans) {
      setIsLoading(false);
    }
  }, [loadingPlans, refetchPlans]);

  const handleSaveToStorage = () => {
    if (onSaveToStorage) {
      setShowStorageNotice(true);
      onSaveToStorage(plan);
      
      toast({
        title: "Storage Update",
        description: "Plan saved to local storage successfully",
        variant: "default"
      });
    }
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
              Your scheme has been saved to localStorage. In a production environment, 
              this would connect to MongoDB via a backend API.
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
        
        {/* Save buttons at the bottom */}
        <div className="mt-10 flex justify-end space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSaveToStorage}
            disabled={savingToStorage}
            className="flex items-center"
          >
            <Database size={18} className="mr-2" /> 
            {savingToStorage ? "Saving..." : "Save to Local Storage"}
          </Button>
          
          <DesignerActionButtons 
            onSave={savePlanToS4}
            isSaving={isSaving}
            showExistingSchemes={showExistingSchemes}
            setShowExistingSchemes={setShowExistingSchemes}
            copyExistingScheme={copyExistingScheme}
            hideSchemeButtons={true}
          />
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
