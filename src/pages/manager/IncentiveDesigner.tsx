
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';

// Import the newly created components
import SchemeOptionsScreen from '@/components/incentive/SchemeOptionsScreen';
import DesignerNavigation from '@/components/incentive/DesignerNavigation';
import SchemeSelectionDialog from '@/components/incentive/SchemeSelectionDialog';

const IncentiveDesigner = () => {
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);

  const handleCreateNewScheme = () => {
    // Set default template with empty values
    setPlanTemplate({
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      name: '',
      description: ''
    });
    setShowInitialOptions(false);
  };

  const handleCopyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Extract necessary properties for the plan template
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
    
    // Ensure the measurementRules has primaryMetrics property (as an array)
    const fixedMeasurementRules = {
      ...measurementRules,
      primaryMetrics: Array.isArray(measurementRules.primaryMetrics) 
        ? measurementRules.primaryMetrics 
        : [{
            name: 'revenue',
            description: measurementRules.primaryMetric || 'Net Revenue'
          }]
    };
    
    const planData: IncentivePlan = {
      name: `Copy of ${name}`,
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules: fixedMeasurementRules,
      creditRules,
      customRules,
      salesQuota: typeof salesQuota === 'string' ? parseInt(salesQuota) || 0 : salesQuota
    };
    
    setPlanTemplate(planData);
    setShowExistingSchemes(false);
    setShowInitialOptions(false);
    
    toast({
      title: "Plan Loaded",
      description: `Loaded plan: ${scheme.name}`,
      variant: "default"
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <DesignerNavigation 
          onBack={!showInitialOptions ? () => setShowInitialOptions(true) : undefined}
          showBackToDashboard={showInitialOptions}
        />
        
        {showInitialOptions ? (
          <SchemeOptionsScreen 
            onCreateNewScheme={handleCreateNewScheme}
            onOpenExistingSchemes={() => setShowExistingSchemes(true)}
          />
        ) : (
          <IncentivePlanDesigner 
            initialPlan={planTemplate} 
            onBack={() => setShowInitialOptions(true)} 
          />
        )}
        
        <SchemeSelectionDialog 
          open={showExistingSchemes}
          setOpen={setShowExistingSchemes}
          onSchemeCopy={handleCopyExistingScheme}
        />
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
