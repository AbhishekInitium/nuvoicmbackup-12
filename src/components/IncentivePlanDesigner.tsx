
import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, ArrowLeft } from 'lucide-react';
import SectionPanel from './ui-custom/SectionPanel';
import ActionButton from './ui-custom/ActionButton';
import { useToast } from "@/hooks/use-toast";
import { useS4HanaData } from '@/hooks/useS4HanaData';

// Import constants and types
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';

// Import components
import ExistingSchemeSelector from './incentive/ExistingSchemeSelector';
import BasicInformation from './incentive/BasicInformation';
import ParticipantsSection from './incentive/ParticipantsSection';
import CommissionStructure from './incentive/CommissionStructure';
import MeasurementRules from './incentive/MeasurementRules';
import CreditRules from './incentive/CreditRules';
import CustomRules from './incentive/CustomRules';
import RevenueBaseSelector from './incentive/RevenueBaseSelector';

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
  const [plan, setPlan] = useState<IncentivePlan>({
    ...DEFAULT_PLAN,
    participants: [], 
    salesQuota: 0,
    name: '', 
    description: '' 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch plans when component mounts
    refetchPlans();
    
    if (!loadingPlans) {
      setIsLoading(false);
    }
  }, [loadingPlans, refetchPlans]);

  useEffect(() => {
    // Initialize with the provided plan if available
    if (initialPlan) {
      setPlan(initialPlan);
    }
  }, [initialPlan]);

  const updatePlan = (section: string, value: any) => {
    setPlan({
      ...plan,
      [section]: value
    });
  };

  const createNewScheme = () => {
    setPlan({
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      name: '',
      description: ''
    });
    
    toast({
      title: "New Scheme",
      description: "Started a new incentive scheme",
      variant: "default"
    });
  };

  const copyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Extract only the IncentivePlan properties from the IncentivePlanWithStatus
    const {
      name,
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules,
      creditRules,
      customRules,
      salesQuota = 0
    } = scheme;
    
    const planData: IncentivePlan = {
      name,
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules,
      creditRules,
      customRules,
      salesQuota: typeof salesQuota === 'string' ? parseInt(salesQuota) || 0 : salesQuota
    };
    
    setPlan(planData);
    
    toast({
      title: "Plan Loaded",
      description: `Loaded plan: ${scheme.name}`,
      variant: "default"
    });
  };

  const savePlanToS4 = () => {
    // Validate required fields
    if (!plan.name || !plan.effectiveStart || !plan.effectiveEnd) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: Name, Start Date, and End Date",
        variant: "destructive"
      });
      return;
    }
    
    // Create a plan with status by combining the current plan with a DRAFT status
    const planWithStatus: Partial<IncentivePlanWithStatus> = {
      ...plan,
      status: 'DRAFT'
    };
    
    savePlan(planWithStatus, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Plan saved successfully!",
          variant: "default"
        });
        // Refetch plans to update the list
        refetchPlans();
      },
      onError: (error) => {
        console.error('Error saving plan:', error);
        toast({
          title: "Error",
          description: "Failed to save plan. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading plans...</div>;
  }

  return (
    <div className="py-12 sm:py-16 px-4 md:px-8 min-h-screen">
      <header className="mb-12 text-center">
        <div className="inline-block mb-2 chip-label">Design</div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-app-gray-900 tracking-tight mb-3">
          Incentive Plan Designer
        </h1>
        <p className="text-app-gray-500 max-w-2xl mx-auto">
          Create and customize your sales incentive structure with backend integration
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          {onBack && (
            <ActionButton 
              variant="outline"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Options
            </ActionButton>
          )}
          
          <div className="flex space-x-4">
            <ActionButton 
              variant="outline"
              size="sm"
              onClick={createNewScheme}
            >
              <PlusCircle size={16} className="mr-2" /> New Scheme
            </ActionButton>
            
            <ExistingSchemeSelector 
              open={showExistingSchemes}
              setOpen={setShowExistingSchemes}
              onSchemeCopy={copyExistingScheme}
            />
          </div>
        </div>

        {/* Section 1: Header Information */}
        <SectionPanel title="1. Header Information" defaultExpanded={true}>
          <BasicInformation 
            plan={plan} 
            updatePlan={updatePlan} 
          />
        </SectionPanel>
        
        {/* Section 2: Scheme Structure */}
        <SectionPanel title="2. Scheme Structure">
          <div className="space-y-8">
            <RevenueBaseSelector
              revenueBase={plan.revenueBase}
              updateRevenueBase={(value) => updatePlan('revenueBase', value)}
            />
            
            <ParticipantsSection 
              participants={plan.participants} 
              updatePlan={updatePlan} 
            />
            
            <MeasurementRules 
              measurementRules={plan.measurementRules}
              revenueBase={plan.revenueBase}
              currency={plan.currency}
              updateMeasurementRules={(updatedRules) => updatePlan('measurementRules', updatedRules)}
            />
            
            <CreditRules 
              levels={plan.creditRules.levels}
              updateCreditRules={(levels) => updatePlan('creditRules', { levels })}
            />
            
            <CustomRules 
              customRules={plan.customRules}
              currency={plan.currency}
              updateCustomRules={(rules) => updatePlan('customRules', rules)}
            />
          </div>
        </SectionPanel>
        
        {/* Section 3: Rates and Payout Structure */}
        <SectionPanel title="3. Rates and Payout Structure">
          <CommissionStructure 
            tiers={plan.commissionStructure.tiers} 
            currency={plan.currency}
            updateCommissionStructure={(tiers) => updatePlan('commissionStructure', { tiers })} 
          />
        </SectionPanel>
        
        <div className="mt-10 flex justify-end space-x-4">
          <ActionButton
            variant="primary" 
            size="lg"
            onClick={savePlanToS4}
            disabled={isSaving}
          >
            <Save size={18} className="mr-2" /> 
            {isSaving ? "Saving..." : "Save"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
