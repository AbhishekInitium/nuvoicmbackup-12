
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExcelUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  fileHeaders?: string[];
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onUpload,
  isUploading = false,
  fileHeaders = []
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setError(null);
    
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is Excel format
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `"${file.name}" ready to upload`,
      });
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setError(null);
      console.log('Uploading file:', selectedFile.name, selectedFile.type, selectedFile.size);
      try {
        onUpload(selectedFile);
      } catch (err) {
        console.error('Upload error in component:', err);
        setError(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was a problem uploading your file",
        });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Browse Files
          </Button>
          <span className="text-sm text-gray-600 flex-1 truncate">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </span>
        </div>

        {selectedFile && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            {isUploading ? 'Uploading...' : 'Upload Excel Template'}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fileHeaders && fileHeaders.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Detected Headers:</h4>
          <div className="bg-gray-50 p-3 rounded-md text-xs max-h-32 overflow-y-auto">
            {fileHeaders.map((header, index) => (
              <div key={index} className="mb-1 px-2 py-1 bg-white rounded border border-gray-200">
                {header}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-2">
          Upload an Excel file to extract column headers for mapping. 
          The first row will be used as column headers.
        </p>
      )}
    </div>
  );
};

export default ExcelUploader;
