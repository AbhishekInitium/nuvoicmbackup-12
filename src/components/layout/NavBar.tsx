
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Container from './Container';
import { usePortalContext } from '@/contexts/PortalContext';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              {/* Empty navigation for now - we're removing the menu items */}
            </nav>
          </div>
        )}
      </Container>
    </div>
  );
};

export default NavBar;
