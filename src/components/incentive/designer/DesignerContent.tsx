
import React from 'react';
import SchemeOptionsScreen from '@/components/incentive/SchemeOptionsScreen';
import SchemeAdministratorScreen from '@/components/incentive/scheme-admin/SchemeAdministratorScreen';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { IncentivePlan } from '@/types/incentiveTypes';

interface DesignerContentProps {
  showInitialOptions: boolean;
  showAdministratorScreen: boolean;
  onCreateNewScheme: () => void;
  onOpenExistingSchemes: () => void;
  onEditExistingScheme: () => void;
  onAdminOption: () => void;
  onDesignerOption: () => void;
  onBackFromAdminScreen: () => void;
  planTemplate: IncentivePlan | null;
  isEditMode: boolean;
  handleBackToOptions: () => void;
}

const DesignerContent: React.FC<DesignerContentProps> = ({
  showInitialOptions,
  showAdministratorScreen,
  onCreateNewScheme,
  onOpenExistingSchemes,
  onEditExistingScheme,
  onAdminOption,
  onDesignerOption,
  onBackFromAdminScreen,
  planTemplate,
  isEditMode,
  handleBackToOptions
}) => {
  if (showInitialOptions) {
    return (
      <SchemeOptionsScreen 
        onCreateNewScheme={onCreateNewScheme}
        onOpenExistingSchemes={onOpenExistingSchemes}
        onEditExistingScheme={onEditExistingScheme}
        onAdminOption={onAdminOption}
        onDesignerOption={onDesignerOption}
        showMainOptions={true}
      />
    );
  }
  
  if (showAdministratorScreen) {
    return (
      <SchemeAdministratorScreen onBack={onBackFromAdminScreen} />
    );
  }
  
  return (
    <IncentivePlanDesigner 
      initialPlan={planTemplate} 
      isEditMode={isEditMode}
      onBack={handleBackToOptions}
    />
  );
};

export default DesignerContent;
