
import React, { useState, useEffect, useCallback } from 'react';
import { SchemeHeader } from './SchemeHeader';
import { KpiMappingForm } from './KpiMappingForm';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';
import { getSchemeAdminConfig } from '@/services/database/mongoDBService';
import ConfigurationSelector from './ConfigurationSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SchemeAdministratorScreenProps {
  onBack: () => void;
}

const SchemeAdministratorScreen: React.FC<SchemeAdministratorScreenProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [adminConfig, setAdminConfig] = useState<Partial<SchemeAdminConfig> | null>(null);
  const [selectedConfigId, setSelectedConfigId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewConfig, setIsNewConfig] = useState(true);
  const [formKey, setFormKey] = useState(Date.now()); // Add a key to force re-render
  
  const handleSaveSuccess = (id: string) => {
    toast({
      title: "Configuration Saved",
      description: `Successfully saved KPI configuration with ID: ${id.substring(0, 8)}...`,
    });
    
    // Update selected config ID after saving
    if (isNewConfig) {
      setSelectedConfigId(id);
      setIsNewConfig(false);
    }
  };
  
  const handleSelectConfig = async (config: SchemeAdminConfig | null) => {
    if (!config || !config._id) {
      setAdminConfig(null);
      setSelectedConfigId(undefined);
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch the complete configuration with all fields
      const fullConfig = await getSchemeAdminConfig(config._id);
      setAdminConfig(fullConfig);
      setSelectedConfigId(config._id);
      setIsNewConfig(false);
      setFormKey(Date.now()); // Force re-render of the form
    } catch (error) {
      toast({
        title: "Error Loading Configuration",
        description: "Failed to load the selected configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    // Create a new empty configuration with required initial values
    const newConfig: Partial<SchemeAdminConfig> = {
      adminId: uuidv4(),
      adminName: '',
      createdAt: new Date().toISOString(),
      calculationBase: '',
      baseField: '',
      baseData: {
        source: 'Excel'
      },
      qualificationFields: [],
      adjustmentFields: [],
      exclusionFields: [],
      customRules: []
    };
    
    setAdminConfig(newConfig);
    setSelectedConfigId(undefined);
    setIsNewConfig(true);
    setFormKey(Date.now()); // Force re-render of the form
  };
  
  const handleConfigUpdate = useCallback((config: Partial<SchemeAdminConfig>) => {
    setAdminConfig(prev => {
      // Only update if there are actual changes to avoid unnecessary re-renders
      if (JSON.stringify(prev) !== JSON.stringify(config)) {
        return config;
      }
      return prev;
    });
  }, []);

  // Initialize with an empty form when first loaded
  useEffect(() => {
    handleCreateNew();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <SchemeHeader 
        title="Scheme Administrator" 
        subtitle="Configure KPI definitions"
        onBack={onBack}
      />
      
      <ConfigurationSelector 
        onConfigSelect={handleSelectConfig}
        onCreateNew={handleCreateNew}
        selectedConfigId={selectedConfigId}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="ml-3 text-gray-500">Loading configuration...</p>
        </div>
      ) : (
        <Tabs defaultValue="kpi-mapping" className="mt-8">
          <TabsList>
            <TabsTrigger value="kpi-mapping">KPI Mapping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kpi-mapping">
            {adminConfig && (
              <KpiMappingForm 
                key={formKey} 
                onSaveSuccess={handleSaveSuccess} 
                initialConfig={adminConfig} 
                onConfigUpdate={handleConfigUpdate}
                isEditMode={!isNewConfig}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SchemeAdministratorScreen;
