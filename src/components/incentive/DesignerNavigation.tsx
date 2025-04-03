
import React from 'react';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';

interface DesignerNavigationProps {
  onBack?: () => void;
  showBackToDashboard?: boolean;
  title?: string;
  configurationSelected?: boolean;
}

const DesignerNavigation: React.FC<DesignerNavigationProps> = ({ 
  onBack, 
  showBackToDashboard = false,
  title = "Incentive Designer",
  configurationSelected = false
}) => {
  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-8 border-b bg-white">
      <div className="flex items-center space-x-4">
        {onBack ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="flex items-center text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        ) : showBackToDashboard ? (
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="flex items-center text-gray-600 hover:text-black"
          >
            <Link to="/manager">
              <LayoutDashboard size={16} className="mr-2" />
              Dashboard
            </Link>
          </Button>
        ) : null}
        
        <h2 className="text-xl font-semibold">{title}</h2>
        
        {configurationSelected && (
          <Badge variant="success" className="ml-2">Configuration Selected</Badge>
        )}
      </div>
    </div>
  );
};

export default DesignerNavigation;
