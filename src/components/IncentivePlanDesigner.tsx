
import React, { useState, useEffect } from 'react';
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
import IncentiveNotifications from './incentive/IncentiveNotifications';
import SaveSchemeButton from './incentive/SaveSchemeButton';

interface IncentivePlanDesignerProps {
  initialPlan?: IncentivePlan | null;
  onBack?: () => void;
}

const IncentivePlanDesigner: React.FC<IncentivePlanDesignerProps> = ({ 
  initialPlan = null,
  onBack
}) => {
  const { 
    incentivePlans, 
    loadingPlans, 
    refetchPlans
  } = useS4HanaData();
  
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStorageNotice, setShowStorageNotice] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [schemeId, setSchemeId] = useState<string>('');
  
  useEffect(() => {
    setSchemeId(generateTimestampId());
  }, []);

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

  const generateTimestampId = () => {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).substring(2);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `ICM_${day}${month}${year}_${hours}${minutes}${seconds}`;
  };

  const handleSaveComplete = (success: boolean, errorMessage?: string) => {
    if (success) {
      setShowStorageNotice(true);
      setConnectionError(null);
    } else if (errorMessage) {
      if (errorMessage.includes('MongoDB') || 
          errorMessage.includes('server') || 
          errorMessage.includes('connect')) {
        setConnectionError(errorMessage);
      }
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

        <IncentiveNotifications 
          showStorageNotice={showStorageNotice}
          connectionError={connectionError}
          schemeId={schemeId}
        />
        
        <SectionPanel title="1. Header Information" defaultExpanded={true}>
          <BasicInformation 
            plan={plan} 
            updatePlan={updatePlan}
            schemeId={schemeId}
          />
        </SectionPanel>
        
        <SchemeStructureSections 
          plan={plan}
          updatePlan={updatePlan}
        />
        
        <PayoutStructureSection 
          tiers={plan.commissionStructure.tiers}
          currency={plan.currency}
          updateCommissionStructure={(tiers) => updatePlan('commissionStructure', { tiers })}
        />
        
        <div className="mt-10 flex justify-end space-x-4">
          <SaveSchemeButton 
            plan={plan}
            schemeId={schemeId}
            onSaveComplete={handleSaveComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
