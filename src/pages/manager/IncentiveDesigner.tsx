
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const IncentiveDesigner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <div className="flex items-center py-4 px-8">
          <Link to="/manager">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        <IncentivePlanDesigner />
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
