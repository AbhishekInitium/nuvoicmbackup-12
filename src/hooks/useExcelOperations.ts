
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { uploadExcelFormat } from '@/services/database/kpiMappingService';

export const useExcelOperations = () => {
  const { toast } = useToast();
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);

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

  // Function to upload Excel file
  const uploadExcel = (file: File) => {
    console.log('Uploading Excel file:', file.name, file.type, file.size);
    uploadExcelMutation.mutate(file);
  };

  return {
    fileHeaders,
    uploadExcel,
    isUploadingExcel: uploadExcelMutation.isPending
  };
};
