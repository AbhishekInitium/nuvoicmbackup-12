
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiMappingForm } from './KpiMappingForm';
import { DataSourceForm } from './DataSourceForm';
import { KpiTable } from './KpiTable';
import { SchemeHeader } from './SchemeHeader';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';

interface SchemeAdministratorScreenProps {
  onBack: () => void;
}

const SchemeAdministratorScreen: React.FC<SchemeAdministratorScreenProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("kpi-mapping");
  const [adminConfig, setAdminConfig] = useState<Partial<SchemeAdminConfig>>({});
  
  const handleSaveSuccess = (id: string) => {
    toast({
      title: "Configuration Saved",
      description: `Successfully saved KPI configuration with ID: ${id.substring(0, 8)}...`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <SchemeHeader 
        title="Scheme Administrator" 
        subtitle="Configure KPI definitions and data source mappings"
        onBack={onBack}
      />
      
      <Tabs 
        defaultValue="kpi-mapping" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mt-8"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="kpi-mapping">KPI Mapping</TabsTrigger>
          <TabsTrigger value="data-source">Data Source</TabsTrigger>
          <TabsTrigger value="kpi-list">KPI Catalog</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kpi-mapping" className="p-4 border rounded-md bg-white shadow-sm">
          <KpiMappingForm 
            onSaveSuccess={handleSaveSuccess} 
            initialConfig={adminConfig} 
            onConfigUpdate={setAdminConfig}
          />
        </TabsContent>
        
        <TabsContent value="data-source" className="p-4 border rounded-md bg-white shadow-sm">
          <DataSourceForm />
        </TabsContent>
        
        <TabsContent value="kpi-list" className="p-4 border rounded-md bg-white shadow-sm">
          <KpiTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemeAdministratorScreen;
