import React, { useState, useEffect } from 'react';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { IncentivePlan, PlanMetadata, CreditLevel } from '@/types/incentiveTypes';
import { useIncentivePlan } from '@/hooks/useIncentivePlan';
import { IncentiveStatus } from '@/services/incentive/types/incentiveServiceTypes';

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
import SchemeVersionHistory from './incentive/SchemeVersionHistory';
import { generateTimestampId } from '@/utils/idGenerators';
import { useSaveIncentivePlan } from '@/hooks/useSaveIncentivePlan';
import { Button } from './ui/button';
import { History } from 'lucide-react';

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
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  useEffect(() => {
    if (initialPlan) {
      setSchemeId(initialPlan.schemeId || generateTimestampId());
      setVersionNumber(isEditMode ? (initialPlan.metadata?.version || 0) + 1 : 1);
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

  const handleEditVersion = (selectedVersion: IncentivePlan) => {
    setSchemeId(selectedVersion.schemeId);
    setVersionNumber((selectedVersion.metadata?.version || 0) + 1);
    
    const status = (selectedVersion.metadata?.status || 'DRAFT') as IncentiveStatus;
    
    copyExistingScheme({
      ...selectedVersion,
      name: selectedVersion.name,
      status: status,
      metadata: {
        createdAt: selectedVersion.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: (selectedVersion.metadata?.version || 0) + 1,
        status: selectedVersion.metadata?.status || 'DRAFT'
      }
    });
    
    setShowVersionHistory(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading plans...</div>;
  }

  if (showVersionHistory && schemeId) {
    return (
      <div className="py-12 sm:py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <IncentiveDesignerHeader />
        <SchemeVersionHistory 
          schemeId={schemeId}
          onBack={() => setShowVersionHistory(false)}
          onEditVersion={handleEditVersion}
        />
      </div>
    );
  }

  const creditLevels: CreditLevel[] = plan.creditRules.levels.map(rule => ({
    name: rule.role || rule.name || `Level ${rule.level}`,
    percentage: rule.percent
  }));

  const fixedTiers = plan.commissionStructure.tiers.map(tier => ({
    from: tier.from,
    to: tier.to !== undefined ? tier.to : Number.MAX_SAFE_INTEGER,
    rate: tier.rate,
    description: `${tier.from}-${tier.to || 'max'}`
  }));

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
          
          {isEditMode && schemeId && (
            <Button 
              variant="outline" 
              onClick={() => setShowVersionHistory(true)} 
              className="ml-auto flex items-center"
            >
              <History size={16} className="mr-2" />
              View Version History
            </Button>
          )}
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
          levels={creditLevels}
          updateCreditRules={(updatedLevels) => {
            const creditRules = updatedLevels.map((level, idx) => ({
              level: idx + 1,
              role: level.name,
              percent: level.percentage,
              name: level.name
            }));
            updatePlan('creditRules', { levels: creditRules });
          }}
        />
        
        <PayoutStructureSection 
          tiers={fixedTiers}
          currency={plan.currency}
          updateCommissionStructure={(updatedTiers) => {
            const commissionTiers = updatedTiers.map((tier, idx) => ({
              id: `tier_${idx}`,
              from: tier.from,
              to: tier.to === Number.MAX_SAFE_INTEGER ? undefined : tier.to,
              rate: tier.rate
            }));
            updatePlan('commissionStructure', { tiers: commissionTiers });
          }}
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
