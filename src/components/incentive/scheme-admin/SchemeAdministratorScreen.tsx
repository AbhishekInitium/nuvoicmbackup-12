
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiMappingForm } from './KpiMappingForm';
import { SchemeHeader } from './SchemeHeader';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { useToast } from '@/hooks/use-toast';

interface SchemeAdministratorScreenProps {
  onBack: () => void;
}

const SchemeAdministratorScreen: React.FC<SchemeAdministratorScreenProps> = ({ onBack }) => {
  const { toast } = useToast();
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
        subtitle="Configure KPI definitions"
        onBack={onBack}
      />
      
      <div className="mt-8">
        <KpiMappingForm 
          onSaveSuccess={handleSaveSuccess} 
          initialConfig={adminConfig} 
          onConfigUpdate={setAdminConfig}
        />
      </div>
    </div>
  );
};

export default SchemeAdministratorScreen;
