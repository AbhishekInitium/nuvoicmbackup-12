
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, X, Database, Download, RefreshCw, Save } from 'lucide-react';
import { KPIFieldMapping, SchemeAdminConfig } from '@/services/database/types/kpiTypes';
import KpiMappingForm from '@/components/scheme-administrator/KpiMappingForm';
import KpiMappingList from '@/components/scheme-administrator/KpiMappingList';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchemeHeader from '@/components/scheme-administrator/SchemeHeader';
import { saveSchemeAdminConfig } from '@/services/database/kpiMappingService';

interface KpiMappingCardProps {
  kpiMappings: KPIFieldMapping[];
  isLoadingMappings: boolean;
  createKpiMapping: (kpiMapping: KPIFieldMapping) => Promise<boolean>;
  updateKpiMapping: (id: string, kpiMapping: KPIFieldMapping) => Promise<boolean>;
  deleteKpiMapping: (id: string) => Promise<boolean>;
  editingKpi: KPIFieldMapping | null;
  startEditingKpi: (kpi: KPIFieldMapping) => void;
  cancelEditingKpi: () => void;
  isCreatingKpi: boolean;
  isUpdatingKpi: boolean;
  isUsingInMemoryStorage?: boolean;
  onKpiOperationComplete?: () => void;
}

const KpiMappingCard: React.FC<KpiMappingCardProps> = ({
  kpiMappings,
  isLoadingMappings,
  createKpiMapping,
  updateKpiMapping,
  deleteKpiMapping,
  editingKpi,
  startEditingKpi,
  cancelEditingKpi,
  isCreatingKpi,
  isUpdatingKpi,
  isUsingInMemoryStorage = false,
  onKpiOperationComplete
}) => {
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'list' | 'json'>('list');
  const { toast } = useToast();
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [localKpiMappings, setLocalKpiMappings] = useState<KPIFieldMapping[]>([]);
  
  const [calculationBase, setCalculationBase] = useState({
    adminId: "scheme-" + new Date().getTime(),
    adminName: "New Scheme Administrator",
    calculationBase: "Sales Orders",
    createdAt: new Date().toISOString()
  });

  // Update local state whenever kpiMappings changes
  useEffect(() => {
    console.log("KpiMappingCard: Received KPI mappings update:", kpiMappings);
    if (Array.isArray(kpiMappings)) {
      setLocalKpiMappings([...kpiMappings]);
    }
  }, [kpiMappings]);

  const handleKpiSubmit = async (kpiMapping: KPIFieldMapping) => {
    console.log("KpiMappingCard: Handling KPI submit:", kpiMapping);
    let success = false;
    
    if (editingKpi && editingKpi._id) {
      success = await updateKpiMapping(editingKpi._id, kpiMapping);
      if (success) {
        toast({
          title: "KPI mapping updated",
          description: "The KPI mapping has been updated successfully",
        });
      }
    } else {
      success = await createKpiMapping(kpiMapping);
      if (success) {
        toast({
          title: "KPI mapping created",
          description: "The new KPI mapping has been created successfully",
        });
      }
    }
    
    if (success && onKpiOperationComplete) {
      console.log("KpiMappingCard: Operation successful, triggering refresh");
      onKpiOperationComplete();
    }
    
    setShowForm(false);
  };

  const handleDeleteKpi = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this KPI mapping?')) {
      const success = await deleteKpiMapping(id);
      
      if (success) {
        toast({
          title: "KPI mapping deleted",
          description: "The KPI mapping has been deleted successfully",
        });
        
        if (editingKpi && editingKpi._id === id) {
          cancelEditingKpi();
          setShowForm(false);
        }
        
        if (onKpiOperationComplete) {
          console.log("KpiMappingCard: Delete successful, triggering refresh");
          onKpiOperationComplete();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the KPI mapping",
          variant: "destructive"
        });
      }
    }
  };

  const handleEditKpi = (kpi: KPIFieldMapping) => {
    startEditingKpi(kpi);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    cancelEditingKpi();
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      cancelEditingKpi();
    }
  };

  const handleCalcBaseChange = (newValues: Partial<typeof calculationBase>) => {
    setCalculationBase(prev => ({ ...prev, ...newValues }));
  };

  // Computed property to generate JSON view based on current mappings
  const groupedJson = {
    adminId: calculationBase.adminId,
    adminName: calculationBase.adminName,
    calculationBase: calculationBase.calculationBase,
    createdAt: calculationBase.createdAt,
    qualificationFields: localKpiMappings
      .filter(m => m.section === 'QUAL_CRI')
      .map(mapping => ({
        kpi: mapping.kpiName,
        description: mapping.description,
        sourceType: mapping.sourceType,
        sourceField: mapping.sourceField,
        dataType: mapping.dataType,
        api: mapping.api || ""
      })),
    adjustmentFields: localKpiMappings
      .filter(m => m.section === 'ADJ_CRI')
      .map(mapping => ({
        kpi: mapping.kpiName,
        description: mapping.description,
        sourceType: mapping.sourceType,
        sourceField: mapping.sourceField,
        dataType: mapping.dataType,
        api: mapping.api || ""
      })),
    exclusionFields: localKpiMappings
      .filter(m => m.section === 'EX_CRI')
      .map(mapping => ({
        kpi: mapping.kpiName,
        description: mapping.description,
        sourceType: mapping.sourceType,
        sourceField: mapping.sourceField,
        dataType: mapping.dataType,
        api: mapping.api || ""
      })),
    customRules: localKpiMappings
      .filter(m => m.section === 'CUSTOM_RULES')
      .map(mapping => ({
        kpi: mapping.kpiName,
        description: mapping.description,
        sourceType: mapping.sourceType,
        sourceField: mapping.sourceField,
        dataType: mapping.dataType,
        api: mapping.api || ""
      }))
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(groupedJson, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `scheme_configuration_${calculationBase.adminId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "JSON Downloaded",
      description: "Scheme configuration has been downloaded as JSON",
    });
  };

  const handleRefresh = () => {
    if (onKpiOperationComplete) {
      console.log("KpiMappingCard: Manual refresh triggered");
      onKpiOperationComplete();
      toast({
        title: "Refreshing Data",
        description: "Fetching the latest KPI mappings...",
      });
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      setIsSavingConfig(true);
      
      const config: SchemeAdminConfig = {
        adminId: calculationBase.adminId,
        adminName: calculationBase.adminName,
        calculationBase: calculationBase.calculationBase,
        createdAt: calculationBase.createdAt,
        updatedAt: new Date().toISOString(),
        qualificationFields: groupedJson.qualificationFields,
        adjustmentFields: groupedJson.adjustmentFields,
        exclusionFields: groupedJson.exclusionFields,
        customRules: groupedJson.customRules
      };
      
      const result = await saveSchemeAdminConfig(config);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Scheme configuration saved to database with ID: ${result.id}`,
        });
      }
    } catch (error) {
      console.error('Error saving scheme configuration to database:', error);
      toast({
        title: "Error",
        description: `Failed to save scheme configuration: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Auto-close form when operations complete
  useEffect(() => {
    if (!isCreatingKpi && !isUpdatingKpi && (showForm && !editingKpi)) {
      console.log("KpiMappingCard: Operation completed, auto-refreshing");
      setShowForm(false);
      if (onKpiOperationComplete) {
        onKpiOperationComplete();
      }
    }
  }, [isCreatingKpi, isUpdatingKpi, showForm, editingKpi, onKpiOperationComplete]);

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <div>
            <CardTitle>KPI Mapping Configuration</CardTitle>
            <CardDescription>
              Define KPI fields that will be available to scheme designers
            </CardDescription>
          </div>
          {isUsingInMemoryStorage && (
            <Badge variant="destructive" className="ml-2 flex items-center">
              <Database size={14} className="mr-1" /> In-Memory
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={downloadJson}
            className="flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export JSON
          </Button>
          <Button 
            variant="secondary"
            size="sm"
            onClick={handleSaveToDatabase}
            disabled={isSavingConfig}
            className="flex items-center"
          >
            <Save size={16} className="mr-2" />
            {isSavingConfig ? "Saving..." : "Save to Database"}
          </Button>
          <Button 
            onClick={toggleForm} 
            className="flex items-center"
            variant={showForm ? "secondary" : "default"}
          >
            {showForm ? (
              <>
                <X size={16} className="mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add New KPI
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SchemeHeader 
          calculationBase={calculationBase}
          onChange={handleCalcBaseChange}
        />
        
        {showForm && (
          <div className="mb-8 mt-6">
            <h3 className="text-lg font-medium mb-4">
              {editingKpi ? `Edit KPI: ${editingKpi.kpiName}` : 'New KPI Mapping'}
            </h3>
            <KpiMappingForm 
              onSubmit={handleKpiSubmit}
              initialData={editingKpi}
              isSaving={isCreatingKpi || isUpdatingKpi}
              onCancel={handleCancelEdit}
              mode={editingKpi ? 'edit' : 'create'}
            />
          </div>
        )}
        
        <Tabs defaultValue="list" value={view} onValueChange={(v) => setView(v as 'list' | 'json')} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="json">JSON Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <KpiMappingList 
              mappings={localKpiMappings}
              isLoading={isLoadingMappings}
              onDelete={handleDeleteKpi}
              onEdit={handleEditKpi}
              isUsingInMemoryStorage={isUsingInMemoryStorage}
            />
          </TabsContent>
          
          <TabsContent value="json">
            <div className="border rounded bg-gray-50 p-4 overflow-auto max-h-[600px]">
              <pre className="text-xs">
                {JSON.stringify(groupedJson, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KpiMappingCard;
