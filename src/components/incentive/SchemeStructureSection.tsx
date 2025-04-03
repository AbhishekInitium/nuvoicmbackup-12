
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SectionPanel from '../ui-custom/SectionPanel';
import { getSchemeAdminConfigs, getSchemeAdminConfig } from '@/services/database/mongoDBService';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { IncentivePlan } from '@/types/incentiveTypes';
import { Calculator, Loader2 } from 'lucide-react';
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
  const [configs, setConfigs] = useState<SchemeAdminConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<SchemeAdminConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationField, setCalculationField] = useState(plan.calculationField || "");
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    setIsLoading(true);
    try {
      const adminConfigs = await getSchemeAdminConfigs();
      setConfigs(adminConfigs);
      console.log("Fetched scheme configs:", adminConfigs);
      
      // If we have a revenue base set in the plan, find the matching config
      if (plan.revenueBase && adminConfigs.length > 0 && plan.selectedSchemeConfig) {
        const matchingConfig = adminConfigs.find(config => 
          config._id === plan.selectedSchemeConfig?._id
        );
        if (matchingConfig) {
          setSelectedConfig(matchingConfig);
          console.log("Found matching config based on ID:", matchingConfig);
          // Load the full config details to make sure we have all the KPIs
          loadFullConfig(matchingConfig._id || '');
        }
      }
    } catch (error) {
      console.error("Failed to fetch scheme configurations:", error);
      toast({
        title: "Error",
        description: "Failed to load scheme configurations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFullConfig = async (configId: string) => {
    try {
      setIsLoading(true);
      const fullConfig = await getSchemeAdminConfig(configId);
      console.log("Loaded full config details:", fullConfig);
      setSelectedConfig(fullConfig);
      
      // Update the parent plan with this scheme config
      updatePlan('selectedSchemeConfig', fullConfig);
      updatePlan('revenueBase', fullConfig.calculationBase);
    } catch (error) {
      console.error("Failed to load full scheme configuration:", error);
      toast({
        title: "Error",
        description: "Failed to load scheme configuration details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (configId: string) => {
    const config = configs.find(c => c._id === configId);
    if (config) {
      // Load the full config with all KPI details
      loadFullConfig(configId);
    }
  };

  const handleCalculationFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCalculationField(value);
    updatePlan('calculationField', value);
  };

  return (
    <SectionPanel title="2. Scheme Structure" defaultExpanded={true}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-app-gray-700 mb-2">
              Configuration
            </Label>
            <Select
              value={selectedConfig?._id}
              onValueChange={handleConfigChange}
              disabled={isReadOnly || isLoading}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder={isLoading ? "Loading..." : "Select a configuration"} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {isLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  configs.map(config => (
                    <SelectItem key={config._id} value={config._id || ''}>
                      {config.adminName} ({config.calculationBase})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-app-gray-500">
              Select the KPI configuration for this scheme
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-app-gray-700 mb-2">
              Calculation Base
            </Label>
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {selectedConfig ? selectedConfig.calculationBase : 'Not selected'}
            </div>
            <p className="mt-1 text-xs text-app-gray-500">
              Base for commission calculations (derived from configuration)
            </p>
          </div>
        </div>

        {/* Calculation Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-app-gray-700 mb-2 flex items-center">
              <Calculator className="w-4 h-4 mr-1" />
              Calculation Field
            </Label>
            {isReadOnly ? (
              <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                {calculationField || 'Not specified'}
              </div>
            ) : (
              <Input
                value={calculationField}
                onChange={handleCalculationFieldChange}
                placeholder="Enter calculation field"
                className="w-full"
                disabled={isReadOnly}
              />
            )}
            <p className="mt-1 text-xs text-app-gray-500">
              Specify the field used for calculations
            </p>
          </div>
        </div>
      </div>
    </SectionPanel>
  );
};

export default SchemeStructureSection;
