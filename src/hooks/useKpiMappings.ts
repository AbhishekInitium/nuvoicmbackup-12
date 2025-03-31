
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { 
  KPIFieldMapping, 
  getKpiFieldMappings, 
  getAvailableKpiFields,
  saveKpiFieldMapping,
  updateKpiFieldMapping,
  uploadExcelFormat,
  assignKpiFieldsToScheme,
  getSchemeMaster,
  deleteKpiFieldMapping
} from '@/services/database/kpiMappingService';

export const useKpiMappings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [editingKpi, setEditingKpi] = useState<KPIFieldMapping | null>(null);

  // Query for fetching all KPI mappings
  const { 
    data: kpiMappings, 
    isLoading: isLoadingMappings,
    error: mappingsError,
    refetch: refetchMappings
  } = useQuery({
    queryKey: ['kpiMappings'],
    queryFn: getKpiFieldMappings,
    meta: {
      onError: (error: Error) => {
        console.error('Error in kpiMappings query:', error);
        toast({
          variant: "destructive",
          title: "Failed to load KPI mappings",
          description: error.message,
        });
      }
    }
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
    meta: {
      onError: (error: Error) => {
        console.error('Error in availableKpis query:', error);
        toast({
          variant: "destructive",
          title: "Failed to load available KPIs",
          description: error.message,
        });
      }
    }
  });

  // Mutation for saving a new KPI mapping
  const createKpiMutation = useMutation({
    mutationFn: saveKpiFieldMapping,
    onSuccess: (data) => {
      console.log('KPI mapping saved successfully:', data);
      toast({ 
        title: "Success", 
        description: "KPI field mapping saved successfully" 
      });
      queryClient.invalidateQueries({ queryKey: ['kpiMappings'] });
      queryClient.invalidateQueries({ queryKey: ['availableKpis'] });
    },
    onError: (error: Error) => {
      console.error('Error in createKpiMutation:', error);
      toast({ 
        title: "Error", 
        description: `Failed to save KPI mapping: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Mutation for updating an existing KPI mapping
  const updateKpiMutation = useMutation({
    mutationFn: ({ id, kpiMapping }: { id: string; kpiMapping: KPIFieldMapping }) => 
      updateKpiFieldMapping(id, kpiMapping),
    onSuccess: (data) => {
      console.log('KPI mapping updated successfully:', data);
      toast({ 
        title: "Success", 
        description: "KPI field mapping updated successfully" 
      });
      setEditingKpi(null);
      queryClient.invalidateQueries({ queryKey: ['kpiMappings'] });
      queryClient.invalidateQueries({ queryKey: ['availableKpis'] });
    },
    onError: (error: Error) => {
      console.error('Error in updateKpiMutation:', error);
      toast({ 
        title: "Error", 
        description: `Failed to update KPI mapping: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Mutation for uploading Excel file
  const uploadExcelMutation = useMutation({
    mutationFn: uploadExcelFormat,
    onSuccess: (headers) => {
      console.log('Excel upload successful, headers:', headers);
      setFileHeaders(headers);
      toast({ 
        title: "Success", 
        description: `Excel format uploaded: ${headers.length} headers found` 
      });
    },
    onError: (error: Error) => {
      console.error('Error in uploadExcelMutation:', error);
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
    onSuccess: (data) => {
      console.log('KPI fields assigned to scheme:', data);
      toast({ 
        title: "Success", 
        description: "KPI fields assigned to scheme" 
      });
      queryClient.invalidateQueries({ queryKey: ['schemeMaster'] });
    },
    onError: (error: Error) => {
      console.error('Error in assignKpisToSchemeMutation:', error);
      toast({ 
        title: "Error", 
        description: `Failed to assign KPI fields: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Mutation for deleting a KPI field mapping
  const deleteKpiMutation = useMutation({
    mutationFn: deleteKpiFieldMapping,
    onSuccess: (success) => {
      if (success) {
        console.log('KPI mapping deleted successfully');
        toast({ 
          title: "Success", 
          description: "KPI field mapping deleted successfully" 
        });
        queryClient.invalidateQueries({ queryKey: ['kpiMappings'] });
        queryClient.invalidateQueries({ queryKey: ['availableKpis'] });
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to delete KPI mapping", 
          variant: "destructive" 
        });
      }
    },
    onError: (error: Error) => {
      console.error('Error in deleteKpiMutation:', error);
      toast({ 
        title: "Error", 
        description: `Failed to delete KPI mapping: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Function to create a new KPI mapping
  const createKpiMapping = (kpiMapping: KPIFieldMapping) => {
    console.log('Creating KPI mapping:', kpiMapping);
    createKpiMutation.mutate(kpiMapping);
  };

  // Function to update an existing KPI mapping
  const updateKpiMapping = (id: string, kpiMapping: KPIFieldMapping) => {
    console.log('Updating KPI mapping:', id, kpiMapping);
    updateKpiMutation.mutate({ id, kpiMapping });
  };

  // Function to start editing a KPI mapping
  const startEditingKpi = (kpi: KPIFieldMapping) => {
    setEditingKpi({ ...kpi });
  };

  // Function to cancel editing
  const cancelEditingKpi = () => {
    setEditingKpi(null);
  };

  // Function to upload Excel file
  const uploadExcel = (file: File) => {
    console.log('Uploading Excel file:', file.name, file.type, file.size);
    uploadExcelMutation.mutate(file);
  };

  // Function to assign KPI fields to a scheme
  const assignKpisToScheme = (schemeId: string, kpiFields: string[]) => {
    console.log('Assigning KPI fields to scheme:', schemeId, kpiFields);
    assignKpisToSchemeMutation.mutate({ schemeId, kpiFields });
  };

  // Function to delete a KPI field mapping
  const deleteKpiMapping = (id: string) => {
    console.log('Deleting KPI mapping:', id);
    deleteKpiMutation.mutate(id);
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
    // Ensure kpiMappings is always an array
    kpiMappings: Array.isArray(kpiMappings) ? kpiMappings : [],
    isLoadingMappings,
    mappingsError,
    refetchMappings,
    
    // Ensure availableKpis is always an array
    availableKpis: Array.isArray(availableKpis) ? availableKpis : [],
    isLoadingAvailableKpis,
    availableKpisError,
    refetchAvailableKpis,
    
    fileHeaders,
    createKpiMapping,
    updateKpiMapping,
    isCreatingKpi: createKpiMutation.isPending,
    isUpdatingKpi: updateKpiMutation.isPending,
    
    // Editing state
    editingKpi,
    startEditingKpi,
    cancelEditingKpi,
    
    uploadExcel,
    isUploadingExcel: uploadExcelMutation.isPending,
    
    assignKpisToScheme,
    isAssigningKpis: assignKpisToSchemeMutation.isPending,
    
    deleteKpiMapping,
    isDeletingKpi: deleteKpiMutation.isPending,
    
    getSchemeMasterBySchemeId,
  };
};

