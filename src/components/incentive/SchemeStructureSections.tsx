
import React, { useState, useEffect } from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { IncentivePlan } from '@/types/incentiveTypes';
import RevenueBaseSelector from './RevenueBaseSelector';
import MeasurementRules from './MeasurementRules';
import CustomRules from './CustomRules';
import { getSchemeAdminConfigs, getSchemeAdminConfig } from '@/services/database/mongoDBService';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';

interface SchemeStructureSectionsProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
  isReadOnly?: boolean;
}

const SchemeStructureSections: React.FC<SchemeStructureSectionsProps> = ({ 
  plan, 
  updatePlan,
  isReadOnly = false
}) => {
  const [schemeConfigs, setSchemeConfigs] = useState<SchemeAdminConfig[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<SchemeAdminConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available scheme configurations on component mount
  useEffect(() => {
    const fetchSchemeConfigs = async () => {
      try {
        setIsLoading(true);
        const configs = await getSchemeAdminConfigs();
        setSchemeConfigs(configs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching scheme configurations:", error);
        toast({
          title: "Error",
          description: "Failed to load scheme configurations",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchSchemeConfigs();
  }, [toast]);

  // Load selectedScheme if plan already has one when editing
  useEffect(() => {
    const loadSelectedScheme = async () => {
      if (plan.selectedSchemeConfig?._id) {
        try {
          setIsLoading(true);
          const selectedConfig = await getSchemeAdminConfig(plan.selectedSchemeConfig._id);
          
          if (selectedConfig) {
            console.log("Loaded scheme configuration:", selectedConfig);
            setSelectedScheme(selectedConfig);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading scheme configuration:", error);
          setIsLoading(false);
        }
      }
    };
    
    loadSelectedScheme();
  }, [plan.selectedSchemeConfig]);

  // Handle scheme selection
  const handleSchemeSelection = async (schemeId: string) => {
    try {
      setIsLoading(true);
      const selectedConfig = await getSchemeAdminConfig(schemeId);
      
      if (selectedConfig) {
        setSelectedScheme(selectedConfig);
        
        // Update the revenue base with the selected scheme's calculation base
        updatePlan('revenueBase', selectedConfig.calculationBase);
        
        // Also store the selected scheme config in the plan for future reference
        updatePlan('selectedSchemeConfig', selectedConfig);
        
        toast({
          title: "Scheme Configuration Loaded",
          description: `Loaded configuration: ${selectedConfig.adminName}`,
          variant: "default",
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading scheme configuration:", error);
      toast({
        title: "Error",
        description: "Failed to load scheme configuration",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <SectionPanel title="Scheme Structure">
      <div className="space-y-8">
        {/* 1. Revenue base for Calculation */}
        <RevenueBaseSelector
          revenueBase={plan.revenueBase}
          updateRevenueBase={(value) => updatePlan('revenueBase', value)}
          schemeConfigs={schemeConfigs}
          onSchemeSelect={handleSchemeSelection}
          isLoading={isLoading}
          isReadOnly={isReadOnly}
          selectedSchemeId={plan.selectedSchemeConfig?._id}
        />
        
        {/* Measurement Rules */}
        <MeasurementRules 
          plan={plan}
          updatePlan={updatePlan}
          selectedScheme={selectedScheme}
          isReadOnly={isReadOnly}
        />
        
        {/* Custom Rules */}
        <CustomRules 
          customRules={plan.customRules}
          currency={plan.currency}
          updateCustomRules={(rules) => updatePlan('customRules', rules)}
          selectedScheme={selectedScheme}
          isReadOnly={isReadOnly}
        />
      </div>
    </SectionPanel>
  );
};

export default SchemeStructureSections;
