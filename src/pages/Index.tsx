
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their appropriate portal
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/integration');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'agent':
          navigate('/agent');
          break;
        case 'finance':
          navigate('/operations');
          break;
      }
    }
  }, [user, navigate]);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">NUVO ICM Platform</h1>
        <p className="text-gray-600 mb-8">
          Incentive Compensation Management System
        </p>
        
        {!user ? (
          <Button size="lg" onClick={handleLogin}>
            Login to Continue
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600">
              You are logged in as {user.username}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {user.role === 'admin' && (
                <Button onClick={() => navigate('/integration')}>
                  Go to Admin Portal
                </Button>
              )}
              {user.role === 'manager' && (
                <Button onClick={() => navigate('/manager')}>
                  Go to Manager Portal
                </Button>
              )}
              {user.role === 'agent' && (
                <Button onClick={() => navigate('/agent')}>
                  Go to Agent Portal
                </Button>
              )}
              {user.role === 'finance' && (
                <Button onClick={() => navigate('/operations')}>
                  Go to Finance Portal
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Index;
