
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan, PrimaryMetric } from '@/types/incentiveTypes';
import { saveIncentiveScheme } from '@/services/database/mongoDBService';

import SchemeOptionsScreen from '@/components/incentive/SchemeOptionsScreen';
import DesignerNavigation from '@/components/incentive/DesignerNavigation';
import SchemeSelectionDialog from '@/components/incentive/SchemeSelectionDialog';

const IncentiveDesigner = () => {
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);
  const [savingToStorage, setSavingToStorage] = useState(false);

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
    setPlanTemplate({
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      name: generateTimestampName(),
      description: ''
    });
    setShowInitialOptions(false);
  };

  const handleCopyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Default field to use if none are found
    const defaultField = scheme.revenueBase === 'salesOrders' ? 'TotalAmount' : 'InvoiceAmount';
    const defaultMetrics: PrimaryMetric[] = [{ 
      field: defaultField, 
      operator: '>', 
      value: 0, 
      description: 'Qualifying Revenue' 
    }];
    
    const fixedMeasurementRules = {
      ...scheme.measurementRules,
      primaryMetrics: Array.isArray(scheme.measurementRules?.primaryMetrics) && 
                     scheme.measurementRules.primaryMetrics.length > 0
        ? scheme.measurementRules.primaryMetrics.map(metric => ({
            field: metric.field || defaultField,
            operator: metric.operator || '>',
            value: metric.value || 0,
            description: metric.description || 'Qualifying criteria'
          }))
        : defaultMetrics
    };
    
    const planData: IncentivePlan = {
      name: generateTimestampName(),
      description: `Copy of ${scheme.name}`,
      effectiveStart: scheme.effectiveStart,
      effectiveEnd: scheme.effectiveEnd,
      currency: scheme.currency,
      revenueBase: scheme.revenueBase,
      participants: scheme.participants,
      commissionStructure: scheme.commissionStructure,
      measurementRules: fixedMeasurementRules,
      creditRules: scheme.creditRules,
      customRules: scheme.customRules,
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

  const handleSaveToStorage = async (plan: IncentivePlan) => {
    if (!plan) {
      toast({
        title: "Validation Error",
        description: "Please provide scheme details before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      setSavingToStorage(true);
      
      // Use timestamp-based naming if no name is provided
      const schemeName = plan.name || generateTimestampName();
      const schemeToSave = {
        ...plan,
        name: schemeName
      };
      
      const id = await saveIncentiveScheme(schemeToSave, 'DRAFT');
      
      toast({
        title: "Scheme Saved",
        description: `Scheme "${schemeName}" saved with ID: ${id}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      
      toast({
        title: "Save Error",
        description: `Failed to save scheme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setSavingToStorage(false);
    }
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
            onSaveToStorage={handleSaveToStorage}
            savingToStorage={savingToStorage}
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
