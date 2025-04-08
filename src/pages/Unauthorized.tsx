
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    // Redirect based on role if logged in
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
        default:
          navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is a mistake.
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button variant="outline" onClick={goBack}>
            Go Back
          </Button>
          <Button onClick={goHome}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
