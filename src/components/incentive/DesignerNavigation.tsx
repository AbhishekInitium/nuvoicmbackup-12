
import React from 'react';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DesignerNavigationProps {
  onBack?: () => void;
  showBackToDashboard?: boolean;
  title?: string;
  subtitle?: string;
}

const DesignerNavigation: React.FC<DesignerNavigationProps> = ({ 
  onBack, 
  showBackToDashboard = false,
  title = "Incentive Designer",
  subtitle
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
        
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default DesignerNavigation;
