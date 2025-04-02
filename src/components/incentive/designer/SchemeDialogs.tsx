
import React from 'react';
import SchemeSelectionDialog from '@/components/incentive/SchemeSelectionDialog';
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';

interface SchemeDialogsProps {
  showExistingSchemes: boolean;
  setShowExistingSchemes: (show: boolean) => void;
  showEditSchemes: boolean;
  setShowEditSchemes: (show: boolean) => void;
  onCopyScheme: (scheme: IncentivePlanWithStatus) => void;
  onEditScheme: (scheme: IncentivePlanWithStatus) => void;
}

const SchemeDialogs: React.FC<SchemeDialogsProps> = ({
  showExistingSchemes,
  setShowExistingSchemes,
  showEditSchemes,
  setShowEditSchemes,
  onCopyScheme,
  onEditScheme
}) => {
  return (
    <>
      <SchemeSelectionDialog 
        open={showExistingSchemes}
        setOpen={setShowExistingSchemes}
        onSchemeCopy={onCopyScheme}
        title="Copy Existing Scheme"
        description="Select a scheme to use as a template for a new scheme"
      />

      <SchemeSelectionDialog 
        open={showEditSchemes}
        setOpen={setShowEditSchemes}
        onSchemeCopy={onEditScheme}
        title="Edit Existing Scheme"
        description="Select a scheme to edit. A new version will be created."
        editMode={true}
      />
    </>
  );
};

export default SchemeDialogs;
