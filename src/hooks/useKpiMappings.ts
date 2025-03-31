
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { 
  KPIFieldMapping, 
  getKpiFieldMappings, 
  getAvailableKpiFields,
  saveKpiFieldMapping,
  uploadExcelFormat,
  assignKpiFieldsToScheme,
  getSchemeMaster
} from '@/services/database/kpiMappingService';

export const useKpiMappings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);

  // Query for fetching all KPI mappings
  const { 
    data: kpiMappings, 
    isLoading: isLoadingMappings,
    error: mappingsError,
    refetch: refetchMappings
  } = useQuery({
    queryKey: ['kpiMappings'],
    queryFn: getKpiFieldMappings,
  });

  // Query for fetching available KPI fields for designers
  const {
    data: availableKpis,
    isLoading: isLoadingAvailableKpis,
    error: availableKpisError,
    refetch: refetchAvailableKpis
  } = useQuery({
    queryKey: ['availableKpis'],
    queryFn: getAvailableKpiFields,
  });

  // Mutation for saving a new KPI mapping
  const createKpiMutation = useMutation({
    mutationFn: saveKpiFieldMapping,
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: "KPI field mapping saved successfully" 
      });
      queryClient.invalidateQueries({ queryKey: ['kpiMappings'] });
      queryClient.invalidateQueries({ queryKey: ['availableKpis'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: `Failed to save KPI mapping: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Mutation for uploading Excel file
  const uploadExcelMutation = useMutation({
    mutationFn: uploadExcelFormat,
    onSuccess: (headers) => {
      setFileHeaders(headers);
      toast({ 
        title: "Success", 
        description: `Excel format uploaded: ${headers.length} headers found` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: `Failed to upload Excel format: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Mutation for assigning KPI fields to a scheme
  const assignKpisToSchemeMutation = useMutation({
    mutationFn: ({ schemeId, kpiFields }: { schemeId: string; kpiFields: string[] }) => 
      assignKpiFieldsToScheme(schemeId, kpiFields),
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: "KPI fields assigned to scheme" 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: `Failed to assign KPI fields: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Function to create a new KPI mapping
  const createKpiMapping = (kpiMapping: KPIFieldMapping) => {
    createKpiMutation.mutate(kpiMapping);
  };

  // Function to upload Excel file
  const uploadExcel = (file: File) => {
    uploadExcelMutation.mutate(file);
  };

  // Function to assign KPI fields to a scheme
  const assignKpisToScheme = (schemeId: string, kpiFields: string[]) => {
    assignKpisToSchemeMutation.mutate({ schemeId, kpiFields });
  };

  // Query for fetching scheme master by schemeId
  const getSchemeMasterBySchemeId = (schemeId: string) => {
    return useQuery({
      queryKey: ['schemeMaster', schemeId],
      queryFn: () => getSchemeMaster(schemeId),
      enabled: !!schemeId, // Only run query if schemeId is provided
    });
  };

  return {
    kpiMappings: kpiMappings || [],
    isLoadingMappings,
    mappingsError,
    refetchMappings,
    
    availableKpis: availableKpis || [],
    isLoadingAvailableKpis,
    availableKpisError,
    refetchAvailableKpis,
    
    fileHeaders,
    createKpiMapping,
    uploadExcel,
    isUploadingExcel: uploadExcelMutation.isPending,
    
    assignKpisToScheme,
    isAssigningKpis: assignKpisToSchemeMutation.isPending,
    
    getSchemeMasterBySchemeId,
  };
};
