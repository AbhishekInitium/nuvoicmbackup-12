
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExistingSchemeSelector from './ExistingSchemeSelector';
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';

interface SchemeSelectionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSchemeCopy: (scheme: IncentivePlanWithStatus) => void;
}

const SchemeSelectionDialog: React.FC<SchemeSelectionDialogProps> = ({
  open,
  setOpen,
  onSchemeCopy
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a Scheme to Copy</DialogTitle>
        </DialogHeader>
        <ExistingSchemeSelector 
          open={open}
          setOpen={setOpen}
          onSchemeCopy={onSchemeCopy}
          useDialogMode={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SchemeSelectionDialog;
