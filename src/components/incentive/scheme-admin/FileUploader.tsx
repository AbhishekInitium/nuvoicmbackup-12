
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, FileType } from 'lucide-react';

interface FileUploaderProps {
  onFileSelected?: (file: File) => void;
  onFileProcessed?: (data: any) => void;
  allowedTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  onFileProcessed,
  allowedTypes = ['.xlsx', '.xls', '.csv']
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Here you would typically upload the file to a server
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock processing result
      const mockColumns = [
        "Date", "Customer", "Product", "Quantity", "UnitPrice", "Revenue"
      ];
      
      if (onFileProcessed) {
        onFileProcessed({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          columns: mockColumns
        });
      }
      
      // Success message or handling
    } catch (error) {
      console.error("Error uploading file:", error);
      // Error handling
    } finally {
      setIsUploading(false);
    }
  };
  
  const acceptedFileTypes = allowedTypes.join(',');
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
        <FileType size={40} className="text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop a file here, or click to select a file
        </p>
        
        <div className="relative">
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
          <Button variant="outline" className="pointer-events-none">
            <Upload size={16} className="mr-2" />
            Select File
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: {allowedTypes.join(', ')}
        </p>
      </div>
      
      {selectedFile && (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Process File"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
