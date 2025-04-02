
import React, { useState, useEffect, useCallback } from 'react';
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
import { PlusCircle, Loader2 } from 'lucide-react';
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
  
  // Load configurations only once on component mount
  useEffect(() => {
    loadSchemeConfigs();
  }, []);
  
  // Load scheme configurations
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
  
  // Handle successful save with memoized callback to prevent unnecessary re-renders
  const handleSaveSuccess = useCallback((id: string) => {
    toast({
      title: "Configuration Saved",
      description: `Successfully saved KPI configuration with ID: ${id.substring(0, 8)}...`,
    });
    
    // Reload the configs after saving
    loadSchemeConfigs();
    
    // Clear the selected scheme to show the changes are applied
    setSelectedSchemeId('');
    setAdminConfig({});
  }, [toast]);
  
  // Handle scheme selection change
  const handleSchemeChange = async (configId: string) => {
    if (configId === selectedSchemeId) return; // Avoid unnecessary fetches
    
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
  
  // Handle creating a new scheme
  const handleCreateNew = () => {
    setSelectedSchemeId('');
    setAdminConfig({});
  };
  
  // Memoized config update handler to prevent unnecessary re-renders
  const handleConfigUpdate = useCallback((config: Partial<SchemeAdminConfig>) => {
    setAdminConfig(prevConfig => {
      // Only update if there are actual changes
      if (JSON.stringify(prevConfig) !== JSON.stringify(config)) {
        return config;
      }
      return prevConfig;
    });
  }, []);

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
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loading ? "Loading..." : "Select a configuration or create new"} />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading configurations...
                </div>
              ) : schemeConfigs.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No configurations available
                </div>
              ) : (
                schemeConfigs.map((config) => (
                  <SelectItem key={config._id} value={config._id || ''}>
                    {config.name || config.adminName || `Configuration ${config._id?.substring(0, 8)}`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground mt-2">
            {selectedSchemeId ? 'Editing existing configuration' : 'Creating new configuration'}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-8 border rounded-md bg-background">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading configuration details...</span>
          </div>
        ) : (
          <KpiMappingForm 
            key={selectedSchemeId || 'new-config'} // Add key to force remount when changing schemes
            onSaveSuccess={handleSaveSuccess} 
            initialConfig={adminConfig} 
            onConfigUpdate={handleConfigUpdate}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default SchemeAdministratorScreen;
