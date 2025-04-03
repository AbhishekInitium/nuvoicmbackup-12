
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { getSchemeAdminConfigs } from '@/services/database/mongoDBService';
import { useToast } from "@/hooks/use-toast";

interface ConfigurationSelectorProps {
  onConfigSelect: (config: SchemeAdminConfig | null) => void;
  onCreateNew: () => void;
  selectedConfigId?: string;
}

const ConfigurationSelector: React.FC<ConfigurationSelectorProps> = ({ 
  onConfigSelect,
  onCreateNew,
  selectedConfigId 
}) => {
  const [configs, setConfigs] = useState<SchemeAdminConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchemeAdminConfigs();
      setConfigs(data);
    } catch (err) {
      setError('Failed to load configurations');
      toast({
        title: "Error",
        description: "Failed to load configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const handleConfigSelect = (configId: string) => {
    if (configId === 'new') {
      onCreateNew();
      return;
    }
    
    const selectedConfig = configs.find(config => config._id === configId);
    if (selectedConfig) {
      onConfigSelect(selectedConfig);
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex-1">
        <Select 
          onValueChange={handleConfigSelect}
          value={selectedConfigId || ""}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a configuration" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {configs.map((config) => (
              <SelectItem key={config._id} value={config._id || "default-config-id"}>
                {config.adminName || "Unnamed Configuration"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={loadConfigurations}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>
      
      <Button 
        onClick={onCreateNew}
        className="whitespace-nowrap"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> New Configuration
      </Button>
    </div>
  );
};

export default ConfigurationSelector;
