
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Scheme Administrator';
      case 'manager':
        return 'Manager';
      case 'agent':
        return 'Agent';
      case 'finance':
        return 'Finance/Ops';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="font-bold text-lg"
            onClick={() => navigate('/')}
          >
            NUVO ICM
          </Button>
          
          {user && (
            <span className="text-sm text-gray-600">
              {user.username} - <span className="font-medium">{getRoleName(user.role)}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
