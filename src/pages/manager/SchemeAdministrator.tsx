
import React from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { useKpiMappings } from '@/hooks/useKpiMappings';
import SchemeAdministratorHeader from '@/components/scheme-administrator/SchemeAdministratorHeader';
import KpiMappingCard from '@/components/scheme-administrator/KpiMappingCard';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DatabaseIcon } from 'lucide-react';

const SchemeAdministrator: React.FC = () => {
  const { toast } = useToast();
  
  const {
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
    refetchMappings,
    isUsingInMemoryStorage
  } = useKpiMappings();

  React.useEffect(() => {
    // Make sure data is refreshed when component mounts
    refetchMappings();
  }, [refetchMappings]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <SchemeAdministratorHeader />

        {isUsingInMemoryStorage && (
          <Alert variant="destructive" className="max-w-6xl mx-auto mb-4">
            <DatabaseIcon className="h-5 w-5" />
            <AlertTitle>Database Connection Warning</AlertTitle>
            <AlertDescription>
              Currently using in-memory storage. Data will be lost when the server restarts.
              Please check your MongoDB connection settings.
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-6xl mx-auto pb-12">
          <KpiMappingCard 
            kpiMappings={kpiMappings}
            isLoadingMappings={isLoadingMappings}
            createKpiMapping={createKpiMapping}
            updateKpiMapping={updateKpiMapping}
            deleteKpiMapping={deleteKpiMapping}
            editingKpi={editingKpi}
            startEditingKpi={startEditingKpi}
            cancelEditingKpi={cancelEditingKpi}
            isCreatingKpi={isCreatingKpi}
            isUpdatingKpi={isUpdatingKpi}
            isUsingInMemoryStorage={isUsingInMemoryStorage}
          />
        </div>
      </Container>
      <Toaster />
    </div>
  );
};

export default SchemeAdministrator;
