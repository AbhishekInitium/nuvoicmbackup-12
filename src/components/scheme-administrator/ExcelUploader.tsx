
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

interface ExcelUploaderProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onUpload,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
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
        >
          Browse Files
        </Button>
        <span className="text-sm text-gray-600">
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

      <p className="text-xs text-gray-500">
        Upload an Excel file to extract column headers for mapping. 
        The first row will be used as column headers.
      </p>
    </div>
  );
};

export default ExcelUploader;
