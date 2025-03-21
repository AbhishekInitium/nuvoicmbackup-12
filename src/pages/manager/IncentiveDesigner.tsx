
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { Button } from '@/components/ui/button';

const IncentiveDesigner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <div className="flex justify-end py-4 px-8">
          <Link to="/manager/commission-execution">
            <Button className="bg-app-blue hover:bg-app-blue-dark">
              <Play size={18} className="mr-2" /> Commission Execution Engine
            </Button>
          </Link>
        </div>
        <IncentivePlanDesigner />
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
