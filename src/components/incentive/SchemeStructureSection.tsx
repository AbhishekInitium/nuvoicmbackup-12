
import React, { useState, useEffect } from 'react';
import { IncentivePlan } from '@/types/incentiveTypes';
import RevenueBaseSelector from './RevenueBaseSelector';
import { getSchemeAdminConfigs } from '@/services/database/mongoDBService';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionPanel from '../ui-custom/SectionPanel';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';

interface SchemeStructureSectionProps {
  plan: IncentivePlan;
  updatePlan: (field: string, value: any) => void;
  isReadOnly?: boolean;
}

const SchemeStructureSection: React.FC<SchemeStructureSectionProps> = ({ 
  plan,
  updatePlan,
  isReadOnly = false
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [configOptions, setConfigOptions] = useState<SchemeAdminConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<SchemeAdminConfig | null>(null);

  useEffect(() => {
    loadConfigOptions();
  }, []);

  useEffect(() => {
    if (plan.selectedSchemeConfig) {
      setSelectedConfig(plan.selectedSchemeConfig);
    }
  }, [plan.selectedSchemeConfig]);

  const loadConfigOptions = async () => {
    try {
      setIsLoading(true);
      const configs = await getSchemeAdminConfigs();
      setConfigOptions(configs);
      
      // If we have a selected config ID, find it in the loaded configs
      if (plan.selectedSchemeConfig) {
        const foundConfig = configs.find(cfg => cfg._id === plan.selectedSchemeConfig?._id);
        if (foundConfig) {
          setSelectedConfig(foundConfig);
          // Update the plan with the complete config object
          updatePlan('selectedSchemeConfig', foundConfig);
        }
      }
    } catch (error) {
      console.error('Error loading scheme configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load scheme configurations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (configId: string) => {
    const selectedConfig = configOptions.find(config => config._id === configId);
    
    if (selectedConfig) {
      setSelectedConfig(selectedConfig);
      updatePlan('selectedSchemeConfig', selectedConfig);
      
      // Also update the revenue base to match the config
      updatePlan('revenueBase', selectedConfig.calculationBase);
      updatePlan('baseField', selectedConfig.baseField);
    }
  };

  return (
    <SectionPanel title="2. Scheme Structure">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="configSelect" className="text-sm font-medium text-app-gray-700 mb-2">
              Configuration <span className="text-red-500">*</span>
            </Label>
            {isReadOnly ? (
              <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                {selectedConfig?.adminName || 'No configuration selected'}
              </div>
            ) : (
              <Select 
                value={selectedConfig?._id || ""} 
                onValueChange={handleConfigChange}
                disabled={isLoading}
              >
                <SelectTrigger id="configSelect">
                  <SelectValue placeholder="Select scheme configuration" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {configOptions.map(config => (
                    <SelectItem key={config._id} value={config._id || ""}>
                      {config.adminName} - {config.calculationBase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="mt-1 text-xs text-app-gray-500">
              Select a pre-defined scheme configuration created by an administrator
            </p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-app-gray-700 mb-2">
              Calculation Base
            </Label>
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {selectedConfig?.calculationBase || plan.revenueBase || 'Not selected'}
            </div>
            <p className="mt-1 text-xs text-app-gray-500">
              The base field used for calculations (defined by the selected configuration)
            </p>
          </div>
        </div>
        
        {!selectedConfig && !isReadOnly && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
            <p className="text-sm text-yellow-700">
              You must select a scheme configuration to define the available metrics, adjustments, and calculation rules.
            </p>
          </div>
        )}
      </div>
    </SectionPanel>
  );
};

export default SchemeStructureSection;
