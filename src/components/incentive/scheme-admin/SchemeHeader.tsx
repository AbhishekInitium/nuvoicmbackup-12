
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SchemeHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export const SchemeHeader: React.FC<SchemeHeaderProps> = ({ 
  title, 
  subtitle, 
  onBack 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4 p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};
