
import { useDbConnectionStatus } from './useDbConnectionStatus';
import { useKpiMappingOperations } from './useKpiMappingOperations';
import { useExcelOperations } from './useExcelOperations';
import { useSchemeMasterOperations } from './useSchemeMasterOperations';

export const useKpiMappings = () => {
  // Combine all the specialized hooks
  const connectionStatus = useDbConnectionStatus();
  const kpiOperations = useKpiMappingOperations();
  const excelOperations = useExcelOperations();
  const schemeOperations = useSchemeMasterOperations();

  // Return a combined object with all the hooks' properties
  return {
    // Database connection status
    isUsingInMemoryStorage: connectionStatus.isUsingInMemoryStorage,

    // KPI mapping operations
    kpiMappings: kpiOperations.kpiMappings,
    isLoadingMappings: kpiOperations.isLoadingMappings,
    mappingsError: kpiOperations.mappingsError,
    refetchMappings: kpiOperations.refetchMappings,

    availableKpis: kpiOperations.availableKpis,
    isLoadingAvailableKpis: kpiOperations.isLoadingAvailableKpis,
    availableKpisError: kpiOperations.availableKpisError,
    refetchAvailableKpis: kpiOperations.refetchAvailableKpis,

    createKpiMapping: kpiOperations.createKpiMapping,
    updateKpiMapping: kpiOperations.updateKpiMapping,
    isCreatingKpi: kpiOperations.isCreatingKpi,
    isUpdatingKpi: kpiOperations.isUpdatingKpi,

    editingKpi: kpiOperations.editingKpi,
    startEditingKpi: kpiOperations.startEditingKpi,
    cancelEditingKpi: kpiOperations.cancelEditingKpi,

    deleteKpiMapping: kpiOperations.deleteKpiMapping,
    isDeletingKpi: kpiOperations.isDeletingKpi,

    // Excel operations
    fileHeaders: excelOperations.fileHeaders,
    uploadExcel: excelOperations.uploadExcel,
    isUploadingExcel: excelOperations.isUploadingExcel,

    // Scheme master operations
    assignKpisToScheme: schemeOperations.assignKpisToScheme,
    isAssigningKpis: schemeOperations.isAssigningKpis,
    getSchemeMasterBySchemeId: schemeOperations.getSchemeMasterBySchemeId,
  };
};
