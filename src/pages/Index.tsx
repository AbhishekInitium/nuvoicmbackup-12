
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, BarChart3, Database, ArrowRight } from 'lucide-react';
import Container from '@/components/layout/Container';
import NavBar from '@/components/layout/NavBar';
import GlassCard from '@/components/ui-custom/GlassCard';
import { usePortalContext } from '@/contexts/PortalContext';

const Index = () => {
  const { setActivePortal } = usePortalContext();

  const portalCards = [
    {
      title: 'Sales Agent Portal',
      description: 'View your earnings, commissions, KPIs, and track performance against goals',
      icon: <User className="h-16 w-16 text-app-blue" />,
      path: '/agent',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      portalType: 'agent' as const,
    },
    {
      title: 'Manager Portal',
      description: 'Create and modify incentive plans, assign to teams, track team performance',
      icon: <Settings className="h-16 w-16 text-app-green" />,
      path: '/manager',
      color: 'bg-gradient-to-br from-green-50 to-teal-50',
      portalType: 'manager' as const,
    },
    {
      title: 'Operations & Finance',
      description: 'Analyze sales trends, payout accuracy, and financial forecasting',
      icon: <BarChart3 className="h-16 w-16 text-app-purple" />,
      path: '/operations',
      color: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
      portalType: 'operations' as const,
    },
    {
      title: 'SAP Integration',
      description: 'Manage integration with SAP S/4HANA for invoices and payment processing',
      icon: <Database className="h-16 w-16 text-app-orange" />,
      path: '/integration',
      color: 'bg-gradient-to-br from-amber-50 to-orange-50',
      portalType: 'integration' as const,
    },
  ];

  const handlePortalClick = (portalType) => {
    setActivePortal(portalType);
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {portalCards.map((card, index) => (
              <Link 
                key={index} 
                to={card.path}
                onClick={() => handlePortalClick(card.portalType)}
              >
                <GlassCard className={`h-full ${card.color} hover:shadow-md transition-all`}>
                  <div className="p-8 flex flex-col items-center text-center h-full">
                    <div className="mb-6">
                      {card.icon}
                    </div>
                    <h2 className="text-xl font-semibold mb-3 text-app-gray-900">{card.title}</h2>
                    <p className="text-app-gray-600 mb-6">{card.description}</p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-app-blue font-medium">
                        Enter Portal <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/manager/incentive-designer"
              onClick={() => setActivePortal('manager')}
              className="inline-flex items-center justify-center bg-app-blue text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:bg-app-blue-dark transition-colors"
            >
              Go to Incentive Plan Designer <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Index;
