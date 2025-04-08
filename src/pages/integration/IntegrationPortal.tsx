import React from 'react';
import Header from '@/components/layout/Header';
import LogoutButton from '@/components/auth/LogoutButton';
import { useAuth } from '@/contexts/AuthContext';

const IntegrationPortal = () => {
  const { user } = useAuth();

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Integration Portal</h1>
          {user && <LogoutButton />}
        </div>
        {/* Additional integration portal content */}
      </div>
    </div>
  );
};

export default IntegrationPortal;
