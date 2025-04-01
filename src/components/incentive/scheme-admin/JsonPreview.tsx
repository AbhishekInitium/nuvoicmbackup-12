
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code } from 'lucide-react';

interface JsonPreviewProps {
  data: any;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const formattedJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium flex items-center">
          <Code size={16} className="mr-2" />
          JSON Preview
        </h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs" 
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={14} className="mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy size={14} className="mr-1" /> Copy
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <pre 
          className={`bg-gray-50 p-4 text-xs overflow-x-auto ${expanded ? 'max-h-[500px]' : 'max-h-[200px]'}`}
          style={{ transition: 'max-height 0.3s ease-in-out' }}
        >
          {formattedJson}
        </pre>
      </Card>
    </div>
  );
};

export default JsonPreview;
