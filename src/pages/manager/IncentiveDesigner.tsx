
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';

import DesignerNavigation from '@/components/incentive/DesignerNavigation';
import SchemeDialogs from '@/components/incentive/designer/SchemeDialogs';
import DesignerContent from '@/components/incentive/designer/DesignerContent';
import { SchemeCreationOptions } from '@/components/incentive/designer/SchemeCreationOptions';
import { DesignerNavigationOptions } from '@/components/incentive/designer/DesignerNavigationOptions';

const IncentiveDesigner = () => {
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showAdministratorScreen, setShowAdministratorScreen] = useState(false);
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [showEditSchemes, setShowEditSchemes] = useState(false);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize the scheme creation options
  const schemeOptions = SchemeCreationOptions({
    setPlanTemplate,
    setShowExistingSchemes,
    setShowEditSchemes,
    setIsEditMode,
    setShowInitialOptions
  });

  // Initialize the navigation options
  const navigationOptions = DesignerNavigationOptions({
    setShowInitialOptions,
    setShowAdministratorScreen
  });

  const handleBackToOptions = () => setShowInitialOptions(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <DesignerNavigation 
          onBack={
            showAdministratorScreen 
              ? navigationOptions.handleBackFromAdminScreen
              : !showInitialOptions 
                ? handleBackToOptions 
                : undefined
          }
          showBackToDashboard={showInitialOptions && !showAdministratorScreen}
        />
        
        <DesignerContent 
          showInitialOptions={showInitialOptions}
          showAdministratorScreen={showAdministratorScreen}
          onCreateNewScheme={schemeOptions.handleCreateNewScheme}
          onOpenExistingSchemes={() => setShowExistingSchemes(true)}
          onEditExistingScheme={() => setShowEditSchemes(true)}
          onAdminOption={navigationOptions.handleAdminOption}
          onDesignerOption={navigationOptions.handleDesignerOption}
          onBackFromAdminScreen={navigationOptions.handleBackFromAdminScreen}
          planTemplate={planTemplate}
          isEditMode={isEditMode}
          handleBackToOptions={handleBackToOptions}
        />
        
        <SchemeDialogs 
          showExistingSchemes={showExistingSchemes}
          setShowExistingSchemes={setShowExistingSchemes}
          showEditSchemes={showEditSchemes}
          setShowEditSchemes={setShowEditSchemes}
          onCopyScheme={schemeOptions.handleCopyExistingScheme}
          onEditScheme={schemeOptions.handleEditExistingScheme}
        />
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
