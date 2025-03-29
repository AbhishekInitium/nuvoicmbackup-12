
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';

import SchemeOptionsScreen from '@/components/incentive/SchemeOptionsScreen';
import DesignerNavigation from '@/components/incentive/DesignerNavigation';
import SchemeSelectionDialog from '@/components/incentive/SchemeSelectionDialog';

const IncentiveDesigner = () => {
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);

  const generateTimestampName = () => {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).substring(2);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `ICM_${day}${month}${year}_${hours}${minutes}${seconds}`;
  };

  const handleCreateNewScheme = () => {
    // Initialize with empty data - no prefilled fields
    setPlanTemplate({
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      name: generateTimestampName(),
      description: '',
      commissionStructure: {
        tiers: []
      },
      measurementRules: {
        primaryMetrics: [], // No prefilled metrics
        minQualification: 0,
        adjustments: [],
        exclusions: []
      },
      creditRules: {
        levels: []
      },
      customRules: []
    });
    setShowInitialOptions(false);
  };

  const handleCopyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Create a clean copy with no default values
    const planData: IncentivePlan = {
      name: generateTimestampName(),
      description: `Copy of ${scheme.name}`,
      effectiveStart: scheme.effectiveStart,
      effectiveEnd: scheme.effectiveEnd,
      currency: scheme.currency,
      revenueBase: scheme.revenueBase,
      participants: scheme.participants,
      commissionStructure: {
        tiers: Array.isArray(scheme.commissionStructure?.tiers) ? [...scheme.commissionStructure.tiers] : []
      },
      measurementRules: {
        primaryMetrics: Array.isArray(scheme.measurementRules?.primaryMetrics) ? [...scheme.measurementRules.primaryMetrics] : [],
        minQualification: scheme.measurementRules?.minQualification || 0,
        adjustments: Array.isArray(scheme.measurementRules?.adjustments) ? [...scheme.measurementRules.adjustments] : [],
        exclusions: Array.isArray(scheme.measurementRules?.exclusions) ? [...scheme.measurementRules.exclusions] : []
      },
      creditRules: {
        levels: Array.isArray(scheme.creditRules?.levels) ? [...scheme.creditRules.levels] : []
      },
      customRules: Array.isArray(scheme.customRules) ? [...scheme.customRules] : [],
      salesQuota: typeof scheme.salesQuota === 'string' ? parseInt(scheme.salesQuota) || 0 : scheme.salesQuota
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
