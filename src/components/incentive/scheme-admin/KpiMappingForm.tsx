
import React, { useState, useEffect } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ActionButton from '../../ui-custom/ActionButton';
import { Kpi, SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';
import { saveSchemeAdmin } from '@/services/database/mongoDBService';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Scheme name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  kpis: z.array(
    z.object({
      name: z.string().min(2, {
        message: "KPI name must be at least 2 characters.",
      }),
      description: z.string().optional(),
      dataSource: z.string().min(2, {
        message: "Data source must be selected.",
      }),
      calculation: z.string().optional(),
    })
  ).optional(),
  dataSources: z.array(
    z.object({
      name: z.string().min(2, {
        message: "Data source name must be at least 2 characters.",
      }),
      description: z.string().optional(),
      connectionDetails: z.string().optional(),
    })
  ).optional(),
});

interface KpiMappingFormProps {
  onSaveSuccess: (id: string) => void;
  initialConfig?: Partial<SchemeAdminConfig>;
  onConfigUpdate: (config: Partial<SchemeAdminConfig>) => void;
}

export const KpiMappingForm: React.FC<KpiMappingFormProps> = ({ onSaveSuccess, initialConfig, onConfigUpdate }) => {
  const { toast } = useToast();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [configId, setConfigId] = useState<string>('');

  useEffect(() => {
    if (initialConfig && Object.keys(initialConfig).length > 0) {
      console.log("Loading initial config:", initialConfig);
      // Initialize form state from initialConfig
      setName(initialConfig.name || '');
      setDescription(initialConfig.description || '');
      setKpis(initialConfig.kpis || []);
      setDataSources(initialConfig.dataSources || []);
      
      // Set edit mode if we have an ID
      if (initialConfig._id) {
        setIsEditMode(true);
        setConfigId(initialConfig._id);
      } else {
        setIsEditMode(false);
        setConfigId('');
      }
    } else {
      // Clear form for new configuration
      setName('');
      setDescription('');
      setKpis([]);
      setDataSources([]);
      setIsEditMode(false);
      setConfigId('');
    }
  }, [initialConfig]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setKpis([]);
    setDataSources([]);
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
        updatedAt: new Date().toISOString()
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

  // Update parent component with form data changes
  useEffect(() => {
    onConfigUpdate({
      name,
      description,
      kpis,
      dataSources,
      _id: configId
    });
  }, [name, description, kpis, dataSources, configId, onConfigUpdate]);

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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Scheme Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <KPIList kpis={kpis} setKpis={setKpis} />
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

interface KPIListProps {
  kpis: Kpi[];
  setKpis: (kpis: Kpi[]) => void;
}

const KPIList: React.FC<KPIListProps> = ({ kpis, setKpis }) => {
  const addKPI = () => {
    setKpis([...kpis, { name: '', description: '', dataSource: '', calculation: '' }]);
  };

  const updateKPI = (index: number, field: string, value: string) => {
    const updatedKPIs = [...kpis];
    updatedKPIs[index][field] = value;
    setKpis(updatedKPIs);
  };

  const removeKPI = (index: number) => {
    const updatedKPIs = [...kpis];
    updatedKPIs.splice(index, 1);
    setKpis(updatedKPIs);
  };

  return (
    <div className="space-y-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>KPI {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-name`}>Name</Label>
              <Input
                type="text"
                id={`kpi-${index}-name`}
                placeholder="KPI Name"
                value={kpi.name}
                onChange={(e) => updateKPI(index, 'name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-description`}>Description</Label>
              <Textarea
                id={`kpi-${index}-description`}
                placeholder="KPI Description"
                value={kpi.description}
                onChange={(e) => updateKPI(index, 'description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-dataSource`}>Data Source</Label>
              <Input
                type="text"
                id={`kpi-${index}-dataSource`}
                placeholder="Data Source"
                value={kpi.dataSource}
                onChange={(e) => updateKPI(index, 'dataSource', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-calculation`}>Calculation</Label>
              <Textarea
                id={`kpi-${index}-calculation`}
                placeholder="Calculation"
                value={kpi.calculation}
                onChange={(e) => updateKPI(index, 'calculation', e.target.value)}
              />
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeKPI(index)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addKPI}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add KPI
      </Button>
    </div>
  );
};

interface DataSourceListProps {
  dataSources: any[];
  setDataSources: (dataSources: any[]) => void;
}

const DataSourceList: React.FC<DataSourceListProps> = ({ dataSources, setDataSources }) => {
  const addDataSource = () => {
    setDataSources([...dataSources, { name: '', description: '', connectionDetails: '' }]);
  };

  const updateDataSource = (index: number, field: string, value: string) => {
    const updatedDataSources = [...dataSources];
    updatedDataSources[index][field] = value;
    setDataSources(updatedDataSources);
  };

  const removeDataSource = (index: number) => {
    const updatedDataSources = [...dataSources];
    updatedDataSources.splice(index, 1);
    setDataSources(updatedDataSources);
  };

  return (
    <div className="space-y-4">
      {dataSources.map((dataSource, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Data Source {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`dataSource-${index}-name`}>Name</Label>
              <Input
                type="text"
                id={`dataSource-${index}-name`}
                placeholder="Data Source Name"
                value={dataSource.name}
                onChange={(e) => updateDataSource(index, 'name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dataSource-${index}-description`}>Description</Label>
              <Textarea
                id={`dataSource-${index}-description`}
                placeholder="Data Source Description"
                value={dataSource.description}
                onChange={(e) => updateDataSource(index, 'description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dataSource-${index}-connectionDetails`}>Connection Details</Label>
              <Textarea
                id={`dataSource-${index}-connectionDetails`}
                placeholder="Connection Details"
                value={dataSource.connectionDetails}
                onChange={(e) => updateDataSource(index, 'connectionDetails', e.target.value)}
              />
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeDataSource(index)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addDataSource}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Data Source
      </Button>
    </div>
  );
};
