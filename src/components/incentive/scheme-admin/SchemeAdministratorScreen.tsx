
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiMappingForm } from './KpiMappingForm';
import { SchemeHeader } from './SchemeHeader';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { getSchemeAdminConfigs, getSchemeAdminConfig } from '@/services/database/mongoDBService';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../../ui-custom/ActionButton';

interface SchemeAdministratorScreenProps {
  onBack: () => void;
}

const SchemeAdministratorScreen: React.FC<SchemeAdministratorScreenProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [adminConfig, setAdminConfig] = useState<Partial<SchemeAdminConfig>>({});
  const [schemeConfigs, setSchemeConfigs] = useState<SchemeAdminConfig[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    loadSchemeConfigs();
  }, []);
  
  const loadSchemeConfigs = async () => {
    try {
      setLoading(true);
      const configs = await getSchemeAdminConfigs();
      console.log("Loaded configs:", configs);
      setSchemeConfigs(configs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading scheme configurations:', error);
      toast({
        title: "Error Loading Configurations",
        description: "Failed to load existing scheme configurations.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const handleSaveSuccess = (id: string) => {
    toast({
      title: "Configuration Saved",
      description: `Successfully saved KPI configuration with ID: ${id.substring(0, 8)}...`,
    });
    
    // Reload the configs after saving
    loadSchemeConfigs();
    
    // Clear the selected scheme to show the changes are applied
    setSelectedSchemeId('');
    setAdminConfig({});
  };
  
  const handleSchemeChange = async (configId: string) => {
    setSelectedSchemeId(configId);
    
    if (configId) {
      setLoading(true);
      try {
        // Fetch the detailed configuration by ID
        const selectedConfig = await getSchemeAdminConfig(configId);
        console.log("Selected config details:", selectedConfig);
        
        if (selectedConfig) {
          setAdminConfig(selectedConfig);
        } else {
          toast({
            title: "Error",
            description: "Could not find the selected configuration details.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching config details:", error);
        toast({
          title: "Error",
          description: "Failed to load configuration details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // New scheme
      setAdminConfig({});
    }
  };
  
  const handleCreateNew = () => {
    setSelectedSchemeId('');
    setAdminConfig({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <SchemeHeader 
        title="Scheme Administrator" 
        subtitle="Configure KPI definitions"
        onBack={onBack}
      />
      
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Select Configuration</h2>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={handleCreateNew}
          >
            <PlusCircle size={16} className="mr-1" /> Create New
          </ActionButton>
        </div>
        
        <div className="mt-3 max-w-md">
          <Select
            value={selectedSchemeId}
            onValueChange={handleSchemeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a configuration or create new" />
            </SelectTrigger>
            <SelectContent>
              {schemeConfigs.map(config => (
                <SelectItem key={config._id} value={config._id || ''}>
                  {config.name || `Configuration ${config._id?.substring(0, 8)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground mt-2">
            {selectedSchemeId ? 'Editing existing configuration' : 'Creating new configuration'}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <KpiMappingForm 
          onSaveSuccess={handleSaveSuccess} 
          initialConfig={adminConfig} 
          onConfigUpdate={setAdminConfig}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default SchemeAdministratorScreen;
