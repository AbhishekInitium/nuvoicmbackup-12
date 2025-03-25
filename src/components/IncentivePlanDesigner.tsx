
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
    savePlan, 
    isSaving,
    refetchPlans
  } = useS4HanaData();
  
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading plans...</div>;
  }

  return (
    <div className="py-12 sm:py-16 px-4 md:px-8 min-h-screen">
      <IncentiveDesignerHeader />

      <div className="max-w-4xl mx-auto">
        <DesignerActionButtons 
          onBack={onBack}
          onSave={savePlanToS4}
          createNewScheme={createNewScheme}
          isSaving={isSaving}
          showExistingSchemes={showExistingSchemes}
          setShowExistingSchemes={setShowExistingSchemes}
          copyExistingScheme={copyExistingScheme}
        />

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
        
        {/* Render the save button again for better UX */}
        <DesignerActionButtons 
          onSave={savePlanToS4}
          createNewScheme={createNewScheme}
          isSaving={isSaving}
          showExistingSchemes={showExistingSchemes}
          setShowExistingSchemes={setShowExistingSchemes}
          copyExistingScheme={copyExistingScheme}
        />
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
