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
  const [schemeId, setSchemeId] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
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
      setConnectionError(null);
      
      const schemeToSave = {
        ...plan,
        schemeId: schemeId
      };
      
      const id = await saveIncentiveScheme(schemeToSave, 'DRAFT');
      
      setShowStorageNotice(true);
      
      toast({
        title: "Scheme Saved",
        description: `Scheme "${plan.name || 'Unnamed'}" saved with ID: ${id}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('MongoDB') || errorMessage.includes('server') || errorMessage.includes('connect')) {
        setConnectionError(errorMessage);
      }
      
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const validatePlanFields = (plan: IncentivePlan): string[] => {
    const errors: string[] = [];
    
    // Mandatory fields validation
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
    
    // Sales quota validation
    if (plan.salesQuota <= 0) {
      errors.push("Sales Quota must be a positive value");
    }
    
    // Commission structure validation
    if (!plan.commissionStructure.tiers || plan.commissionStructure.tiers.length === 0) {
      errors.push("At least one commission tier is required");
    } else {
      plan.commissionStructure.tiers.forEach((tier, index) => {
        if (tier.rate <= 0) {
          errors.push(`Tier ${index + 1} must have a positive commission rate`);
        }
      });
    }
    
    // Qualifying criteria validation
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
    
    // Participants validation
    if (!plan.participants || plan.participants.length === 0) {
      errors.push("At least one sales organization must be assigned");
    }
    
    // Credit levels validation
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
              Your scheme has been saved in MongoDB with the ID: {schemeId}. 
              The scheme status is set to DRAFT.
            </AlertDescription>
          </Alert>
        )}
        
        {connectionError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <span className="font-semibold">MongoDB Connection Error:</span> {connectionError}
              <p className="mt-1">Make sure the incentiveServer.js is running with: <code>node server/incentiveServer.js</code></p>
            </AlertDescription>
          </Alert>
        )}
        
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
