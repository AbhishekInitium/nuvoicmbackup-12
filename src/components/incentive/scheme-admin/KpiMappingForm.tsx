
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { KpiField, SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { JsonPreview } from './JsonPreview';
import { saveSchemeAdmin } from '@/services/database/mongoDBService';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { ConfigurationForm } from './ConfigurationForm';
import { KpiSections } from './KpiSections';

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
  
  // Initialize the form with default values or values from initialConfig
  const form = useForm({
    defaultValues: {
      adminId: initialConfig.adminId || uuidv4(),
      adminName: initialConfig.adminName || "",
      calculationBase: initialConfig.calculationBase || "",
      baseDataSourceType: initialConfig.baseData?.source || "Excel",
      baseSourceField: initialConfig.baseField || ""
    }
  });

  // Set initial form values when component mounts or initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      console.log("Setting form values from initialConfig:", {
        adminName: initialConfig.adminName,
        calculationBase: initialConfig.calculationBase,
        baseDataSourceType: initialConfig.baseData?.source,
        baseSourceField: initialConfig.baseField,
        _id: initialConfig._id,
        isEditMode: isEditMode
      });
      
      // Reset the form with the new values
      form.reset({
        adminId: initialConfig.adminId || uuidv4(),
        adminName: initialConfig.adminName || "",
        calculationBase: initialConfig.calculationBase || "",
        baseDataSourceType: initialConfig.baseData?.source || "Excel",
        baseSourceField: initialConfig.baseField || ""
      });
      
      // Update KPI data state with the new values
      setKpiData({
        qualificationFields: initialConfig.qualificationFields || [],
        adjustmentFields: initialConfig.adjustmentFields || [],
        exclusionFields: initialConfig.exclusionFields || [],
        customRules: initialConfig.customRules || []
      });
    }
  }, [initialConfig, form, isEditMode]);

  const updateParentConfig = useCallback(() => {
    if (onConfigUpdate) {
      const formValues = form.getValues();
      
      const updatedConfig: Partial<SchemeAdminConfig> = {
        _id: initialConfig._id, // Keep the MongoDB ID for updates
        adminId: formValues.adminId,
        adminName: formValues.adminName,
        calculationBase: formValues.calculationBase,
        baseField: formValues.baseSourceField,
        baseData: {
          source: formValues.baseDataSourceType
        },
        qualificationFields: kpiData.qualificationFields,
        adjustmentFields: kpiData.adjustmentFields,
        exclusionFields: kpiData.exclusionFields,
        customRules: kpiData.customRules,
        createdAt: initialConfig.createdAt || new Date().toISOString()
      };
      
      onConfigUpdate(updatedConfig);
    }
  }, [kpiData, form, initialConfig, onConfigUpdate]);

  // This controls the form updates without causing infinite loops
  useEffect(() => {
    // Set up subscription to form changes
    const subscription = form.watch(() => {
      updateParentConfig();
    });
    
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [form, updateParentConfig]);

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
      baseField: formValues.baseSourceField, // Updated to use the new field
      baseData: {
        source: formValues.baseDataSourceType, // Use the new source type field
        connectionDetails: initialConfig.baseData?.connectionDetails || ""
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
          <ConfigurationForm form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <JsonPreview data={kpiData} title="KPI Configuration Preview" height="300px" />
            </div>
          </div>
          
          <KpiSections 
            kpiData={kpiData} 
            onAddKpi={handleAddKpi}
            onUpdateKpi={handleUpdateKpi}
            onRemoveKpi={handleRemoveKpi}
          />
          
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
