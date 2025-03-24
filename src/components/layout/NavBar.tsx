
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, BarChart3, Database, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Container from './Container';
import { usePortalContext } from '@/contexts/PortalContext';

const NavBar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activePortal } = usePortalContext();

  // Define portal-specific navigation items
  const getNavItems = () => {
    // Base items that should always be visible
    let items = [];
    
    // If we're in a specific portal or on the main page
    if (activePortal === 'agent' || activePortal === 'all') {
      items.push({
        label: 'Sales Agent Portal',
        path: '/agent',
        icon: <User className="h-4 w-4 mr-2" />,
        active: location.pathname.startsWith('/agent'),
      });
    }
    
    if (activePortal === 'manager' || activePortal === 'all') {
      items.push({
        label: 'Manager Portal',
        path: '/manager',
        icon: <Settings className="h-4 w-4 mr-2" />,
        active: location.pathname.startsWith('/manager'),
      });
    }
    
    if (activePortal === 'all') {
      items.push({
        label: 'Ops & Finance',
        path: '/operations',
        icon: <BarChart3 className="h-4 w-4 mr-2" />,
        active: location.pathname.startsWith('/operations'),
      });
      
      items.push({
        label: 'SAP Integration',
        path: '/integration',
        icon: <Database className="h-4 w-4 mr-2" />,
        active: location.pathname.startsWith('/integration'),
      });
    }
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="bg-white shadow-sm border-b border-app-gray-200 py-3">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/8fbbb301-31ad-45ec-ac54-b296904f23bd.png" 
                alt="Nuvo ICM Logo" 
                className="h-12 mr-2" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors",
                  item.active
                    ? "text-app-blue"
                    : "text-app-gray-600 hover:text-app-gray-900"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-app-gray-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center text-sm font-medium py-2 px-2 rounded-md transition-colors",
                    item.active
                      ? "bg-app-blue-50 text-app-blue"
                      : "text-app-gray-600 hover:text-app-gray-900 hover:bg-app-gray-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </Container>
    </div>
  );
};

export default NavBar;
