
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DesignerNavigationProps {
  onBack?: () => void;
  showBackToDashboard?: boolean;
}

const DesignerNavigation: React.FC<DesignerNavigationProps> = ({ 
  onBack,
  showBackToDashboard = true 
}) => {
  return (
    <div className="flex items-center py-4 px-8">
      {showBackToDashboard && (
        <Link to="/manager">
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
      )}
      
      {onBack && (
        <Button variant="ghost" className="flex items-center" onClick={onBack}>
          <ArrowLeft size={18} className="mr-2" /> Back to Options
        </Button>
      )}
    </div>
  );
};

export default DesignerNavigation;
