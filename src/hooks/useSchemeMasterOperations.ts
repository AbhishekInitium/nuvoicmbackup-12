
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { 
  assignKpiFieldsToScheme,
  getSchemeMaster,
} from '@/services/database/kpiMappingService';

export const useSchemeMasterOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      // Also invalidate KPI mappings to ensure all data is fresh
      queryClient.invalidateQueries({ queryKey: ['kpiMappings'] });
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

  // Function to assign KPI fields to a scheme
  const assignKpisToScheme = (schemeId: string, kpiFields: string[]) => {
    console.log('Assigning KPI fields to scheme:', schemeId, kpiFields);
    assignKpisToSchemeMutation.mutate({ schemeId, kpiFields });
  };

  // Function to get scheme master by schemeId
  const getSchemeMasterBySchemeId = (schemeId: string) => {
    return useQuery({
      queryKey: ['schemeMaster', schemeId],
      queryFn: () => getSchemeMaster(schemeId),
      enabled: !!schemeId, // Only run query if schemeId is provided
      refetchOnWindowFocus: true,
      staleTime: 10000, // Consider data stale after 10 seconds
      retry: 2, // Retry failed requests up to 2 times
    });
  };

  return {
    assignKpisToScheme,
    isAssigningKpis: assignKpisToSchemeMutation.isPending,
    getSchemeMasterBySchemeId
  };
};
