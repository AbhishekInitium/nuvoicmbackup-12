
import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import GlassCard from '@/components/ui-custom/GlassCard';

interface TeamHierarchyUploadProps {
  onUploadComplete?: (data: any[]) => void;
}

const TeamHierarchyUpload: React.FC<TeamHierarchyUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          selectedFile.type !== 'application/vnd.ms-excel' &&
          selectedFile.type !== 'text/csv') {
        toast({
          title: "Invalid file format",
          description: "Please upload an Excel or CSV file",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadStatus('idle');
      parseExcelPreview(selectedFile);
    }
  };

  const parseExcelPreview = (file: File) => {
    // In a real app, this would use a library like SheetJS to parse the Excel file
    // For now, we'll just simulate parsing with a timeout
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // This is just a simulation - in a real app, parse the actual Excel data
        setTimeout(() => {
          // Sample preview data
          const sampleData = [
            {
              businessPartner: '1000192',
              orgLevel: '3',
              reportsTo: '1000089',
              managerOrgLevel: '2',
              effectiveFromDate: '2023-01-01'
            },
            {
              businessPartner: '1000245',
              orgLevel: '4',
              reportsTo: '1000192',
              managerOrgLevel: '3',
              effectiveFromDate: '2023-01-01'
            },
            {
              businessPartner: '1000245',
              orgLevel: '4',
              reportsTo: '1000211',
              managerOrgLevel: '3',
              effectiveFromDate: '2023-06-15'
            }
          ];
          
          setPreviewData(sampleData);
        }, 500);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: "Error parsing file",
          description: "Could not read the file content. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      // In a real app, this would send the file to the server
      // For now, we'll just simulate an upload with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadStatus('success');
      toast({
        title: "Upload successful",
        description: "Team hierarchy data has been uploaded",
        variant: "default"
      });
      
      if (onUploadComplete && previewData) {
        onUploadComplete(previewData);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Team Hierarchy</h2>
      <p className="text-sm text-app-gray-600 mb-6">
        Upload an Excel file containing team hierarchy information from the HCM system. 
        The file should include Business Partner, Org Level, Reports To, Manager Org Level,
        and Effective From Date columns.
      </p>
      
      <div className="border-2 border-dashed border-app-gray-200 rounded-lg p-6 text-center mb-6">
        <Upload className="mx-auto h-12 w-12 text-app-gray-400 mb-2" />
        <p className="text-sm text-app-gray-600 mb-4">
          Drag and drop an Excel file, or click to browse
        </p>
        <Input
          type="file"
          id="fileUpload"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('fileUpload')?.click()}
        >
          Select File
        </Button>
        
        {file && (
          <div className="mt-4 text-sm text-app-gray-600">
            Selected: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)
          </div>
        )}
      </div>
      
      {previewData && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Preview:</h3>
          <div className="bg-app-gray-50 p-4 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-app-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Business Partner</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Org Level</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Reports To</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Manager Org Level</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Effective From</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-app-gray-200">
                {previewData.slice(0, 3).map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-gray-50'}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-app-gray-900">{row.businessPartner}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-app-gray-900">{row.orgLevel}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-app-gray-900">{row.reportsTo}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-app-gray-900">{row.managerOrgLevel}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-app-gray-900">{row.effectiveFromDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 3 && (
              <p className="text-xs text-app-gray-500 mt-2 text-center">
                Showing 3 of {previewData.length} records
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!file || isUploading}
          onClick={handleUpload}
          className="flex items-center"
        >
          {isUploading ? (
            <>Processing...</>
          ) : uploadStatus === 'success' ? (
            <><CheckCircle className="mr-2 h-4 w-4" /> Uploaded Successfully</>
          ) : uploadStatus === 'error' ? (
            <><AlertCircle className="mr-2 h-4 w-4" /> Upload Failed</>
          ) : (
            <>Upload Hierarchy Data</>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

export default TeamHierarchyUpload;
