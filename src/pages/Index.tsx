
import React from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { usePortalContext } from '@/contexts/PortalContext';

const Index = () => {
  const { setActivePortal } = usePortalContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-app-gray-900 tracking-tight mb-4">
              Nuvo ICM Platform
            </h1>
            <p className="text-xl text-app-gray-600">
              A comprehensive incentive compensation management system integrated with SAP
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Index;
