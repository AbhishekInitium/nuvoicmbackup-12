
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SchemeAdministratorHeader: React.FC = () => {
  return (
    <>
      <div className="py-4 px-8 bg-gray-50 border-b">
        <Link to="/manager/incentive-designer">
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft size={18} className="mr-2" /> Back to Options
          </Button>
        </Link>
      </div>

      <div className="py-6 px-8 mb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-900">Scheme Administrator</h1>
        <p className="text-gray-600 mt-2">
          Manage KPI mappings for use in incentive schemes
        </p>
      </div>
    </>
  );
};

export default SchemeAdministratorHeader;
