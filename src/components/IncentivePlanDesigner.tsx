
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
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
import { Button } from './ui/button';
import { Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { saveIncentiveScheme, updateIncentiveScheme } from '@/services/database/mongoDBService';

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
      console.log("Saving plan, isEditMode:", isEditMode);
      
      // Create metadata with the correct version
      const metadata: PlanMetadata = {
        createdAt: plan.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: versionNumber,
        status: 'DRAFT'
      };
      
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
            // Refresh the plans to see the new version
            refetchPlans();
            
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
      }
      
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

  const validatePlanFields = (plan: IncentivePlan): string[] => {
    const errors: string[] = [];
    
    if (!plan.name || plan.name.trim() === '') {
      errors.push("Plan Name is required");
    }
    
    if (!plan.effectiveStart) {
      errors.push("Start Date is required");
    }
    
    if (!plan.effectiveEnd) {
      errors.push("End Date is required");
    }
    
    if (!plan.revenueBase) {
      errors.push("Revenue Base is required");
    }
    
    if (plan.salesQuota <= 0) {
      errors.push("Sales Quota must be a positive value");
    }
    
    if (!plan.commissionStructure.tiers || plan.commissionStructure.tiers.length === 0) {
      errors.push("At least one commission tier is required");
    } else {
      plan.commissionStructure.tiers.forEach((tier, index) => {
        if (tier.rate <= 0) {
          errors.push(`Tier ${index + 1} must have a positive commission rate`);
        }
      });
    }
    
    if (!plan.measurementRules.primaryMetrics || plan.measurementRules.primaryMetrics.length === 0) {
      errors.push("At least one qualifying criteria is required");
    } else {
      plan.measurementRules.primaryMetrics.forEach((metric, index) => {
        if (!metric.field || metric.field.trim() === '') {
          errors.push(`Qualifying criteria ${index + 1} must have a field`);
        }
        if (!metric.operator || metric.operator.trim() === '') {
          errors.push(`Qualifying criteria ${index + 1} must have an operator`);
        }
      });
    }
    
    if (!plan.participants || plan.participants.length === 0) {
      errors.push("At least one sales organization must be assigned");
    }
    
    if (!plan.creditRules.levels || plan.creditRules.levels.length === 0) {
      errors.push("At least one credit level is required");
    }
    
    return errors;
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
              Your scheme has been {isEditMode ? 'saved as a new version' : 'saved'} in MongoDB with the ID: {schemeId}. 
              The scheme is {isEditMode ? `now version ${versionNumber}` : 'set to DRAFT status'}.
            </AlertDescription>
          </Alert>
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
          <Button
            variant="default"
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center"
          >
            <Save size={18} className="mr-2" /> 
            {isSaving ? "Saving..." : isEditMode ? "Save New Version" : "Save Scheme"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
