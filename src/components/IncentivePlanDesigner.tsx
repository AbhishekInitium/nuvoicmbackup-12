
import React, { useState, useEffect } from 'react';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { IncentivePlan, PlanMetadata } from '@/types/incentiveTypes';
import { useIncentivePlan } from '@/hooks/useIncentivePlan';
import { IncentiveStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Import refactored components
import SectionPanel from './ui-custom/SectionPanel';
import BasicInformation from './incentive/BasicInformation';
import SchemeStructureSection from './incentive/SchemeStructureSection';
import MeasurementRules from './incentive/MeasurementRules';
import PayoutStructureSection from './incentive/PayoutStructureSection';
import CreditDistributionSection from './incentive/CreditDistributionSection';
import SavePlanButton from './incentive/SavePlanButton';
import SchemeVersionHistory from './incentive/SchemeVersionHistory';
import { generateTimestampId } from '@/utils/idGenerators';
import { useSaveIncentivePlan } from '@/hooks/useSaveIncentivePlan';
import { Button } from './ui/button';
import { History } from 'lucide-react';
import { validatePlanFields } from '@/utils/validationUtils';

interface IncentivePlanDesignerProps {
  initialPlan?: IncentivePlan | null;
  isEditMode?: boolean;
  isReadOnly?: boolean;
  onBack?: () => void;
}

const IncentivePlanDesigner: React.FC<IncentivePlanDesignerProps> = ({ 
  initialPlan = null,
  isEditMode = false,
  isReadOnly = false,
  onBack
}) => {
  const { 
    incentivePlans, 
    loadingPlans, 
    refetchPlans
  } = useS4HanaData();
  
  const [isLoading, setIsLoading] = useState(true);
  const [schemeId, setSchemeId] = useState<string>('');
  const [versionNumber, setVersionNumber] = useState<number>(1);
  const [documentId, setDocumentId] = useState<string>('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedSchemeConfig, setSelectedSchemeConfig] = useState<SchemeAdminConfig | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  useEffect(() => {
    if (initialPlan) {
      setSchemeId(initialPlan.schemeId || generateTimestampId());
      setVersionNumber(isEditMode ? (initialPlan.metadata?.version || 0) + 1 : 1);
      if (initialPlan._id) {
        setDocumentId(initialPlan._id);
      }
      if (initialPlan.selectedSchemeConfig) {
        setSelectedSchemeConfig(initialPlan.selectedSchemeConfig);
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
    if (plan?.selectedSchemeConfig) {
      setSelectedSchemeConfig(plan.selectedSchemeConfig);
    }
  }, [plan]);

  useEffect(() => {
    // Validate plan when it changes
    if (plan && !isReadOnly) {
      const errors = validatePlanFields(plan);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  }, [plan, isReadOnly]);

  const handleUpdatePlan = (field: string, value: any) => {
    if (field === 'selectedSchemeConfig') {
      setSelectedSchemeConfig(value);
    }
    updatePlan(field, value);
  };

  useEffect(() => {
    refetchPlans();
    
    if (!loadingPlans) {
      setIsLoading(false);
    }
  }, [loadingPlans, refetchPlans]);

  const {
    handleSave,
    isSaving
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
    if (selectedVersion.selectedSchemeConfig) {
      setSelectedSchemeConfig(selectedVersion.selectedSchemeConfig);
    }
    setShowVersionHistory(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading plans...</div>;
  }

  if (showVersionHistory && schemeId) {
    return (
      <div className="py-12 sm:py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <SchemeVersionHistory 
          schemeId={schemeId}
          onBack={() => setShowVersionHistory(false)}
          onEditVersion={handleEditVersion}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Version History Button */}
        <div className="flex justify-end mb-4">
          {isEditMode && schemeId && !isReadOnly && (
            <Button 
              variant="outline" 
              onClick={() => setShowVersionHistory(true)} 
              className="flex items-center"
            >
              <History size={16} className="mr-2" />
              View Version History
            </Button>
          )}
        </div>
        
        {/* Validation Errors */}
        {validationErrors.length > 0 && !isReadOnly && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              <div className="font-semibold">Please fix the following issues:</div>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Scheme Panels */}
        <div className="space-y-6">
          <SectionPanel title="1. Header Information" defaultExpanded={true}>
            <BasicInformation 
              plan={plan} 
              updatePlan={updatePlan}
              schemeId={schemeId}
              version={versionNumber}
              isEditMode={isEditMode}
              isReadOnly={isReadOnly}
            />
          </SectionPanel>
          
          <SchemeStructureSection 
            plan={plan}
            updatePlan={handleUpdatePlan}
            isReadOnly={isReadOnly}
          />
          
          <SectionPanel title="3. Rule Definition">
            <MeasurementRules
              plan={plan}
              updatePlan={updatePlan}
              isReadOnly={isReadOnly}
              selectedScheme={selectedSchemeConfig}
            />
          </SectionPanel>
          
          <SectionPanel title="4. Credit Distribution">
            <CreditDistributionSection 
              levels={plan.creditRules.levels}
              updateCreditRules={(levels) => updatePlan('creditRules', { levels })}
              isReadOnly={isReadOnly}
            />
          </SectionPanel>
          
          <PayoutStructureSection 
            tiers={plan.commissionStructure.tiers}
            currency={plan.currency}
            updateCommissionStructure={(tiers) => updatePlan('commissionStructure', { tiers })}
            isReadOnly={isReadOnly}
          />
        </div>
        
        {/* Save Button */}
        {!isReadOnly && (
          <div className="mt-10 flex justify-end space-x-4">
            <SavePlanButton 
              onClick={handleSave}
              isLoading={isSaving}
              isEditMode={isEditMode}
              isDisabled={validationErrors.length > 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
