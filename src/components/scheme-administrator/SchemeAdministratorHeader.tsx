
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SchemeAdministratorHeader: React.FC = () => {
  return (
    <>
      <div className="py-4 px-8">
        <Link to="/manager/incentive-designer">
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft size={18} className="mr-2" /> Back to Options
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Scheme Administrator</h1>
    </>
  );
};

export default SchemeAdministratorHeader;
