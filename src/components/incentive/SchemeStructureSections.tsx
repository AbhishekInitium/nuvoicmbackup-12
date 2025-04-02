
import React, { useState, useEffect } from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { IncentivePlan } from '@/types/incentiveTypes';
import RevenueBaseSelector from './RevenueBaseSelector';
import ParticipantsSection from './ParticipantsSection';
import MeasurementRules from './MeasurementRules';
import CreditRules from './CreditRules';
import CustomRules from './CustomRules';
import { getSchemeAdminConfigs, getSchemeAdminConfig } from '@/services/database/mongoDBService';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';

interface SchemeStructureSectionsProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
}

const SchemeStructureSections: React.FC<SchemeStructureSectionsProps> = ({ 
  plan, 
  updatePlan 
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

  // Handle scheme selection
  const handleSchemeSelection = async (schemeId: string) => {
    try {
      setIsLoading(true);
      const selectedConfig = await getSchemeAdminConfig(schemeId);
      
      if (selectedConfig) {
        setSelectedScheme(selectedConfig);
        
        // Update the revenue base with the selected scheme's calculation base
        updatePlan('revenueBase', selectedConfig.calculationBase);
        
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
    <SectionPanel title="2. Scheme Structure">
      <div className="space-y-8">
        {/* 1. Revenue base for Calculation */}
        <RevenueBaseSelector
          revenueBase={plan.revenueBase}
          updateRevenueBase={(value) => updatePlan('revenueBase', value)}
          schemeConfigs={schemeConfigs}
          onSchemeSelect={handleSchemeSelection}
          isLoading={isLoading}
        />
        
        {/* Participants section remains before the main metrics */}
        <ParticipantsSection 
          participants={plan.participants} 
          updatePlan={updatePlan} 
        />
        
        {/* 2. Qualifying Criteria, 3. Adjustments + Exclusions */}
        <MeasurementRules 
          measurementRules={plan.measurementRules}
          revenueBase={plan.revenueBase}
          currency={plan.currency}
          updateMeasurementRules={(updatedRules) => updatePlan('measurementRules', updatedRules)}
          selectedScheme={selectedScheme}
        />
        
        {/* 4. Custom Rules */}
        <CustomRules 
          customRules={plan.customRules}
          currency={plan.currency}
          updateCustomRules={(rules) => updatePlan('customRules', rules)}
          selectedScheme={selectedScheme}
        />
      </div>
    </SectionPanel>
  );
};

export default SchemeStructureSections;
