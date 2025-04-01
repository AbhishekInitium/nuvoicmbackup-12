
import React, { useEffect, useCallback } from 'react';
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
    isUsingInMemoryStorage,
    fileHeaders,
    uploadExcel,
    isUploadingExcel
  } = useKpiMappings();

  // Ensure data is refreshed when component mounts
  useEffect(() => {
    console.log('SchemeAdministrator: Fetching KPI mappings on mount...');
    refetchMappings();
  }, [refetchMappings]);

  // Add a callback for successful KPI operations to ensure UI updates
  const handleKpiOperation = useCallback((operation: string, success: boolean) => {
    if (success) {
      console.log(`${operation} operation successful, refreshing data...`);
      // Add a small delay to allow the database operation to complete
      setTimeout(() => {
        refetchMappings();
      }, 300);
    }
  }, [refetchMappings]);

  // Create a wrapper for createKpiMapping to ensure we refresh after
  const handleCreateKpiMapping = useCallback(async (kpi: any) => {
    try {
      await createKpiMapping(kpi);
      handleKpiOperation('Create', true);
      return true;
    } catch (error) {
      console.error("Error creating KPI mapping:", error);
      return false;
    }
  }, [createKpiMapping, handleKpiOperation]);

  // Create a wrapper for updateKpiMapping to ensure we refresh after
  const handleUpdateKpiMapping = useCallback(async (id: string, kpi: any) => {
    try {
      await updateKpiMapping(id, kpi);
      handleKpiOperation('Update', true);
      return true;
    } catch (error) {
      console.error("Error updating KPI mapping:", error);
      return false;
    }
  }, [updateKpiMapping, handleKpiOperation]);

  // Create a wrapper for deleteKpiMapping to ensure we refresh after
  const handleDeleteKpiMapping = useCallback(async (id: string) => {
    try {
      await deleteKpiMapping(id);
      handleKpiOperation('Delete', true);
      return true;
    } catch (error) {
      console.error("Error deleting KPI mapping:", error);
      return false;
    }
  }, [deleteKpiMapping, handleKpiOperation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
            createKpiMapping={handleCreateKpiMapping}
            updateKpiMapping={handleUpdateKpiMapping}
            deleteKpiMapping={handleDeleteKpiMapping}
            editingKpi={editingKpi}
            startEditingKpi={startEditingKpi}
            cancelEditingKpi={cancelEditingKpi}
            isCreatingKpi={isCreatingKpi}
            isUpdatingKpi={isUpdatingKpi}
            isUsingInMemoryStorage={isUsingInMemoryStorage}
            onKpiOperationComplete={refetchMappings}
          />
        </div>
      </Container>
      <Toaster />
    </div>
  );
};

export default SchemeAdministrator;
