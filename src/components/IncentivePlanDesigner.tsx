
import React, { useState, useEffect } from 'react';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { IncentivePlan, PlanMetadata } from '@/types/incentiveTypes';
import { useIncentivePlan } from '@/hooks/useIncentivePlan';

// Import refactored components
import IncentiveDesignerHeader from './incentive/IncentiveDesignerHeader';
import DesignerActionButtons from './incentive/DesignerActionButtons';
import SectionPanel from './ui-custom/SectionPanel';
import BasicInformation from './incentive/BasicInformation';
import SchemeStructureSections from './incentive/SchemeStructureSections';
import PayoutStructureSection from './incentive/PayoutStructureSection';
import CreditDistributionSection from './incentive/CreditDistributionSection';
import SavePlanButton from './incentive/SavePlanButton';
import StorageNotice from './incentive/StorageNotice';
import { generateTimestampId } from '@/utils/idGenerators';
import { useSaveIncentivePlan } from '@/hooks/useSaveIncentivePlan';

interface IncentivePlanDesignerProps {
  initialPlan?: IncentivePlan | null;
  isEditMode?: boolean;
  onBack?: () => void;
}

const IncentivePlanDesigner: React.FC<IncentivePlanDesignerProps> = ({ 
  initialPlan = null,
  isEditMode = false,
  onBack
}) => {
  const { 
    incentivePlans, 
    loadingPlans, 
    refetchPlans
  } = useS4HanaData();
  
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schemeId, setSchemeId] = useState<string>('');
  const [versionNumber, setVersionNumber] = useState<number>(1);
  const [documentId, setDocumentId] = useState<string>('');
  
  useEffect(() => {
    if (initialPlan) {
      // Set the scheme ID from the initial plan
      setSchemeId(initialPlan.schemeId || generateTimestampId());
      
      // Set the version number for editing (current version + 1) or new (1)
      setVersionNumber(isEditMode ? (initialPlan.metadata?.version || 0) + 1 : 1);
      
      // Store the MongoDB document ID if available
      if (initialPlan._id) {
        setDocumentId(initialPlan._id);
      }
    } else {
      setSchemeId(generateTimestampId());
      setVersionNumber(1);
    }
  }, [initialPlan, isEditMode]);

  const {
    plan,
    updatePlan,
    createNewScheme,
    copyExistingScheme
  } = useIncentivePlan(initialPlan, undefined, refetchPlans);

  useEffect(() => {
    refetchPlans();
    
    if (!loadingPlans) {
      setIsLoading(false);
    }
  }, [loadingPlans, refetchPlans]);

  const {
    handleSave,
    isSaving,
    showStorageNotice,
    setShowStorageNotice
  } = useSaveIncentivePlan({
    plan,
    schemeId,
    versionNumber,
    isEditMode,
    onSaveSuccess: refetchPlans
  });

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
          <StorageNotice 
            schemeId={schemeId} 
            versionNumber={versionNumber} 
            isEditMode={isEditMode}
          />
        )}
        
        <SectionPanel title="1. Header Information" defaultExpanded={true}>
          <BasicInformation 
            plan={plan} 
            updatePlan={updatePlan}
            schemeId={schemeId}
            version={versionNumber}
            isEditMode={isEditMode}
          />
        </SectionPanel>
        
        <SchemeStructureSections 
          plan={plan}
          updatePlan={updatePlan}
        />
        
        <CreditDistributionSection 
          levels={plan.creditRules.levels}
          updateCreditRules={(levels) => updatePlan('creditRules', { levels })}
        />
        
        <PayoutStructureSection 
          tiers={plan.commissionStructure.tiers}
          currency={plan.currency}
          updateCommissionStructure={(tiers) => updatePlan('commissionStructure', { tiers })}
        />
        
        <div className="mt-10 flex justify-end space-x-4">
          <SavePlanButton 
            onClick={handleSave}
            isLoading={isSaving}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
