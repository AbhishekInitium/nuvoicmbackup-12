
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, BarChart3, Database } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { usePortalContext } from '@/contexts/PortalContext';

const Index = () => {
  const { setActivePortal } = usePortalContext();

  // Define navigation items
  const navItems = [
    {
      label: 'Sales Agent Portal',
      path: '/agent',
      icon: <User className="h-6 w-6 mb-2" />,
      onClick: () => setActivePortal('agent'),
      description: 'Access your dashboard, quota attainment, and earnings information'
    },
    {
      label: 'Manager Portal',
      path: '/manager',
      icon: <Settings className="h-6 w-6 mb-2" />,
      onClick: () => setActivePortal('manager'),
      description: 'Manage incentive plans, team performance, and commission payments'
    },
    {
      label: 'Ops & Finance',
      path: '/operations',
      icon: <BarChart3 className="h-6 w-6 mb-2" />,
      onClick: () => setActivePortal('all'),
      description: 'Financial reporting, commission validation, and payment processing'
    },
    {
      label: 'SAP Integration',
      path: '/integration',
      icon: <Database className="h-6 w-6 mb-2" />,
      onClick: () => setActivePortal('all'),
      description: 'Configure and test SAP integration points and data mapping'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-app-gray-900 tracking-tight mb-4">
              Nuvo ICM Platform
            </h1>
            <p className="text-xl text-app-gray-600 mb-12">
              A comprehensive incentive compensation management system integrated with SAP
            </p>
            
            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  onClick={item.onClick}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-app-gray-100"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-app-blue-50 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium text-app-gray-900 mb-2">{item.label}</h3>
                  <p className="text-sm text-app-gray-600 text-center">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Index;
