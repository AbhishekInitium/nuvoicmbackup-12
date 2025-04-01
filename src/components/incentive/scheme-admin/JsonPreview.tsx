
import React from 'react';
import { Card } from '@/components/ui/card';

interface JsonPreviewProps {
  data: any;
  title?: string;
  height?: string;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ 
  data, 
  title = "JSON Preview",
  height = "400px" 
}) => {
  const formattedJson = JSON.stringify(data, null, 2);
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      
      <pre 
        className="p-4 text-xs text-gray-800 overflow-auto bg-gray-50" 
        style={{ height, maxHeight: height }}
      >
        {formattedJson}
      </pre>
    </Card>
  );
};
