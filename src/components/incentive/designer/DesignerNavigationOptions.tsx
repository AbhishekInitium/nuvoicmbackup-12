
import React from 'react';

interface DesignerNavigationOptionsProps {
  setShowInitialOptions: (show: boolean) => void;
  setShowAdministratorScreen: (show: boolean) => void;
}

export const useDesignerNavigationOptions = ({
  setShowInitialOptions,
  setShowAdministratorScreen
}: DesignerNavigationOptionsProps) => {
  const handleAdminOption = () => {
    setShowInitialOptions(false);
    setShowAdministratorScreen(true);
  };

  const handleDesignerOption = () => {
    // Show designer options instead of staying on the main options screen
    setShowAdministratorScreen(false);
    setShowInitialOptions(false);
  };

  const handleBackFromAdminScreen = () => {
    setShowAdministratorScreen(false);
    setShowInitialOptions(true);
  };

  return {
    handleAdminOption,
    handleDesignerOption,
    handleBackFromAdminScreen
  };
};
