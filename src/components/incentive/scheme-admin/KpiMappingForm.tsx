
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Kpi, SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';
import { saveSchemeAdmin } from '@/services/database/mongoDBService';
import KpiList from './KpiList';
import DataSourceList from './DataSourceList';
import { Loader2 } from 'lucide-react';

interface KpiMappingFormProps {
  onSaveSuccess: (id: string) => void;
  initialConfig?: Partial<SchemeAdminConfig>;
  onConfigUpdate: (config: Partial<SchemeAdminConfig>) => void;
  isLoading?: boolean;
}

export const KpiMappingForm: React.FC<KpiMappingFormProps> = ({ 
  onSaveSuccess, 
  initialConfig, 
  onConfigUpdate,
  isLoading = false 
}) => {
  const { toast } = useToast();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [configId, setConfigId] = useState<string>('');
  const [adminName, setAdminName] = useState<string>('');
  const [calculationBase, setCalculationBase] = useState<string>('');
  const [baseField, setBaseField] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize form with initialConfig values only once when the component mounts or initialConfig changes
  useEffect(() => {
    if (!initialized && initialConfig && Object.keys(initialConfig).length > 0) {
      console.log("Loading initial config:", initialConfig);
      
      // Initialize form state from initialConfig
      setName(initialConfig.name || '');
      setDescription(initialConfig.description || '');
      setKpis(initialConfig.kpis || []);
      setDataSources(initialConfig.dataSources || []);
      setAdminName(initialConfig.adminName || '');
      setCalculationBase(initialConfig.calculationBase || '');
      setBaseField(initialConfig.baseField || '');
      
      // Set edit mode if we have an ID
      if (initialConfig._id) {
        setIsEditMode(true);
        setConfigId(initialConfig._id);
      } else {
        setIsEditMode(false);
        setConfigId('');
      }
      
      setInitialized(true);
    } else if (!initialConfig || Object.keys(initialConfig).length === 0) {
      // Clear form for new configuration
      resetForm();
      setInitialized(true);
    }
  }, [initialConfig, initialized]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setKpis([]);
    setDataSources([]);
    setAdminName('');
    setCalculationBase('');
    setBaseField('');
    setIsEditMode(false);
    setConfigId('');
    setInitialized(false);
  };

  const handleSave = async () => {
    try {
      // Validate form - at minimum, name is required
      if (!name.trim()) {
        toast({
          title: "Validation Error",
          description: "Scheme name is required",
          variant: "destructive"
        });
        return;
      }
      
      setIsSaving(true);
      
      const configToSave: Partial<SchemeAdminConfig> = {
        name,
        description,
        kpis,
        dataSources,
        adminName,
        calculationBase,
        baseField,
        updatedAt: new Date().toISOString(),
        // Ensure an adminId is set even if it's just a placeholder
        adminId: initialConfig?.adminId || 'admin-user'
      };
      
      if (isEditMode && configId) {
        // Update existing config
        configToSave._id = configId;
      }
      
      console.log("Saving config:", configToSave);
      
      const savedConfigId = await saveSchemeAdmin(configToSave as SchemeAdminConfig);
      
      setIsSaving(false);
      if (onSaveSuccess) {
        onSaveSuccess(savedConfigId);
      }
      
      // Only reset if not editing
      if (!isEditMode) {
        resetForm();
      }
      
    } catch (error) {
      setIsSaving(false);
      toast({
        title: "Error Saving Configuration",
        description: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Update parent component with form data changes, but do it less frequently
  useEffect(() => {
    const updateTimeout = setTimeout(() => {
      onConfigUpdate({
        name,
        description,
        kpis,
        dataSources,
        adminName,
        calculationBase,
        baseField,
        _id: configId
      });
    }, 300); // Add a small delay to prevent too many updates
    
    return () => clearTimeout(updateTimeout);
  }, [name, description, kpis, dataSources, adminName, calculationBase, baseField, configId, onConfigUpdate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading configuration details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scheme Configuration</CardTitle>
          <CardDescription>Define the basic information for the incentive scheme.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Scheme Name</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder="Incentive Scheme Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adminName">Administrator Name</Label>
            <Input 
              type="text" 
              id="adminName" 
              placeholder="Administrator Name" 
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Scheme Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="calculationBase">Calculation Base</Label>
            <Input 
              type="text" 
              id="calculationBase" 
              placeholder="e.g., Revenue, Units, etc." 
              value={calculationBase}
              onChange={(e) => setCalculationBase(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="baseField">Base Field</Label>
            <Input 
              type="text" 
              id="baseField" 
              placeholder="Field in source system" 
              value={baseField}
              onChange={(e) => setBaseField(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KPI Definitions</CardTitle>
          <CardDescription>Define the Key Performance Indicators (KPIs) for this scheme.</CardDescription>
        </CardHeader>
        <CardContent>
          <KpiList kpis={kpis} setKpis={setKpis} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Manage the data sources used to calculate KPIs.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataSourceList dataSources={dataSources} setDataSources={setDataSources} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : isEditMode ? "Update Configuration" : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
};
