import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { KpiField, SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { KpiMappingCard } from './KpiMappingCard';
import { JsonPreview } from './JsonPreview';
import { saveSchemeAdmin } from '@/services/database/mongoDBService';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface KpiMappingFormProps {
  onSaveSuccess: (id: string) => void;
  initialConfig?: Partial<SchemeAdminConfig>;
  onConfigUpdate?: (config: Partial<SchemeAdminConfig>) => void;
  isEditMode?: boolean;
}

export const KpiMappingForm: React.FC<KpiMappingFormProps> = ({ 
  onSaveSuccess,
  initialConfig = {},
  onConfigUpdate,
  isEditMode = false
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [kpiData, setKpiData] = useState<{
    qualificationFields: KpiField[];
    adjustmentFields: KpiField[];
    exclusionFields: KpiField[];
    customRules: KpiField[];
  }>({
    qualificationFields: initialConfig.qualificationFields || [],
    adjustmentFields: initialConfig.adjustmentFields || [],
    exclusionFields: initialConfig.exclusionFields || [],
    customRules: initialConfig.customRules || []
  });
  
  const form = useForm({
    defaultValues: {
      adminId: initialConfig.adminId || uuidv4(),
      adminName: initialConfig.adminName || "",
      calculationBase: initialConfig.calculationBase || ""
    }
  });

  // Update form when initialConfig changes (for loading existing configs)
  useEffect(() => {
    if (initialConfig) {
      form.reset({
        adminId: initialConfig.adminId || uuidv4(),
        adminName: initialConfig.adminName || "",
        calculationBase: initialConfig.calculationBase || ""
      });
      
      setKpiData({
        qualificationFields: initialConfig.qualificationFields || [],
        adjustmentFields: initialConfig.adjustmentFields || [],
        exclusionFields: initialConfig.exclusionFields || [],
        customRules: initialConfig.customRules || []
      });
    }
  }, [initialConfig, form]);

  const updateParentConfig = useCallback(() => {
    if (onConfigUpdate) {
      const updatedConfig: Partial<SchemeAdminConfig> = {
        adminId: form.getValues().adminId,
        adminName: form.getValues().adminName,
        calculationBase: form.getValues().calculationBase,
        qualificationFields: kpiData.qualificationFields,
        adjustmentFields: kpiData.adjustmentFields,
        exclusionFields: kpiData.exclusionFields,
        customRules: kpiData.customRules,
        createdAt: initialConfig.createdAt || new Date().toISOString(),
        _id: initialConfig._id
      };
      
      onConfigUpdate(updatedConfig);
    }
  }, [kpiData, form, initialConfig, onConfigUpdate]);

  // This was causing the infinite update loop - we'll use a more controlled approach
  const debouncedUpdateConfig = useCallback(() => {
    // Only update parent config when form changes, not on every render
    const subscription = form.watch(() => {
      updateParentConfig();
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateParentConfig]);

  useEffect(() => {
    debouncedUpdateConfig();
  }, [debouncedUpdateConfig]);

  // Also update parent when kpiData changes
  useEffect(() => {
    updateParentConfig();
  }, [kpiData, updateParentConfig]);

  const handleAddKpi = (category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => {
    const newKpi: KpiField = {
      id: uuidv4(),
      kpi: "",
      description: "",
      dataType: "Char10",
      sourceField: "",
      sourceType: "Excel",
      category
    };

    setKpiData(prev => {
      const newData = { ...prev };
      
      switch(category) {
        case 'qualification':
          newData.qualificationFields = [...prev.qualificationFields, newKpi];
          break;
        case 'adjustment':
          newData.adjustmentFields = [...prev.adjustmentFields, newKpi];
          break;
        case 'exclusion':
          newData.exclusionFields = [...prev.exclusionFields, newKpi];
          break;
        case 'custom':
          newData.customRules = [...prev.customRules, newKpi];
          break;
      }
      
      return newData;
    });
  };

  const handleUpdateKpi = (updatedKpi: KpiField) => {
    setKpiData(prev => {
      const newData = { ...prev };
      
      switch(updatedKpi.category) {
        case 'qualification':
          newData.qualificationFields = prev.qualificationFields.map(k => 
            k.id === updatedKpi.id ? updatedKpi : k
          );
          break;
        case 'adjustment':
          newData.adjustmentFields = prev.adjustmentFields.map(k => 
            k.id === updatedKpi.id ? updatedKpi : k
          );
          break;
        case 'exclusion':
          newData.exclusionFields = prev.exclusionFields.map(k => 
            k.id === updatedKpi.id ? updatedKpi : k
          );
          break;
        case 'custom':
          newData.customRules = prev.customRules.map(k => 
            k.id === updatedKpi.id ? updatedKpi : k
          );
          break;
      }
      
      return newData;
    });
  };

  const handleRemoveKpi = (id: string, category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => {
    setKpiData(prev => {
      const newData = { ...prev };
      
      switch(category) {
        case 'qualification':
          newData.qualificationFields = prev.qualificationFields.filter(k => k.id !== id);
          break;
        case 'adjustment':
          newData.adjustmentFields = prev.adjustmentFields.filter(k => k.id !== id);
          break;
        case 'exclusion':
          newData.exclusionFields = prev.exclusionFields.filter(k => k.id !== id);
          break;
        case 'custom':
          newData.customRules = prev.customRules.filter(k => k.id !== id);
          break;
      }
      
      return newData;
    });
  };

  const handleSaveConfig = async (formValues: any) => {
    // Create the complete config object with all required fields
    const adminConfig: SchemeAdminConfig = {
      _id: initialConfig._id, // Include _id if editing existing config
      adminId: formValues.adminId,
      adminName: formValues.adminName,
      createdAt: initialConfig.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      calculationBase: formValues.calculationBase,
      baseField: initialConfig.baseField || "",
      baseData: initialConfig.baseData || {
        source: "Excel" 
      },
      qualificationFields: kpiData.qualificationFields,
      adjustmentFields: kpiData.adjustmentFields,
      exclusionFields: kpiData.exclusionFields,
      customRules: kpiData.customRules
    };
    
    try {
      setIsSaving(true);
      console.log(`${isEditMode ? "Updating" : "Saving"} admin config to MongoDB:`, adminConfig);
      const id = await saveSchemeAdmin(adminConfig);
      
      toast({
        title: isEditMode ? "Configuration Updated" : "Configuration Saved",
        description: `Scheme configuration "${formValues.adminName}" ${isEditMode ? "updated" : "saved"} successfully`,
        variant: "default"
      });
      
      onSaveSuccess(id);
    } catch (error) {
      console.error("Error saving admin config:", error);
      
      toast({
        title: "Save Error",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">
        {isEditMode ? "Edit KPI Configuration" : "Create KPI Configuration"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Scheme Configuration</h3>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., NorthAmerica_Orders_2024" />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this scheme configuration
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="calculationBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calculation Base</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sales Orders" />
                    </FormControl>
                    <FormDescription>
                      The primary metric used for calculations
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <JsonPreview data={kpiData} title="KPI Configuration Preview" height="300px" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Qualification KPIs</h3>
                <Button 
                  type="button"
                  onClick={() => handleAddKpi('qualification')}
                  size="sm"
                  variant="outline"
                >
                  Add Qualification KPI
                </Button>
              </div>
              
              <div className="space-y-4">
                {kpiData.qualificationFields.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    No qualification KPIs defined yet. Click the button above to add one.
                  </p>
                ) : (
                  kpiData.qualificationFields.map(kpi => (
                    <KpiMappingCard 
                      key={kpi.id} 
                      kpi={kpi} 
                      onUpdate={handleUpdateKpi} 
                      onRemove={handleRemoveKpi} 
                    />
                  ))
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Adjustment KPIs</h3>
                <Button 
                  type="button"
                  onClick={() => handleAddKpi('adjustment')}
                  size="sm"
                  variant="outline"
                >
                  Add Adjustment KPI
                </Button>
              </div>
              
              <div className="space-y-4">
                {kpiData.adjustmentFields.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    No adjustment KPIs defined yet. Click the button above to add one.
                  </p>
                ) : (
                  kpiData.adjustmentFields.map(kpi => (
                    <KpiMappingCard 
                      key={kpi.id} 
                      kpi={kpi} 
                      onUpdate={handleUpdateKpi} 
                      onRemove={handleRemoveKpi} 
                    />
                  ))
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Exclusion KPIs</h3>
                <Button 
                  type="button"
                  onClick={() => handleAddKpi('exclusion')}
                  size="sm"
                  variant="outline"
                >
                  Add Exclusion KPI
                </Button>
              </div>
              
              <div className="space-y-4">
                {kpiData.exclusionFields.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    No exclusion KPIs defined yet. Click the button above to add one.
                  </p>
                ) : (
                  kpiData.exclusionFields.map(kpi => (
                    <KpiMappingCard 
                      key={kpi.id} 
                      kpi={kpi} 
                      onUpdate={handleUpdateKpi} 
                      onRemove={handleRemoveKpi} 
                    />
                  ))
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Custom Rule KPIs</h3>
                <Button 
                  type="button"
                  onClick={() => handleAddKpi('custom')}
                  size="sm"
                  variant="outline"
                >
                  Add Custom KPI
                </Button>
              </div>
              
              <div className="space-y-4">
                {kpiData.customRules.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    No custom KPIs defined yet. Click the button above to add one.
                  </p>
                ) : (
                  kpiData.customRules.map(kpi => (
                    <KpiMappingCard 
                      key={kpi.id} 
                      kpi={kpi} 
                      onUpdate={handleUpdateKpi} 
                      onRemove={handleRemoveKpi} 
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" className="w-40" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditMode ? "Update Configuration" : "Save Configuration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
