
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ExistingSchemeSelector from './ExistingSchemeSelector';
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';

interface SchemeSelectionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSchemeCopy: (scheme: IncentivePlanWithStatus) => void;
  title?: string;
  description?: string;
  editMode?: boolean;
}

const SchemeSelectionDialog: React.FC<SchemeSelectionDialogProps> = ({
  open,
  setOpen,
  onSchemeCopy,
  title = "Select a Scheme to Copy",
  description,
  editMode = false
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ExistingSchemeSelector 
          open={open}
          setOpen={setOpen}
          onSchemeCopy={onSchemeCopy}
          useDialogMode={true}
          editMode={editMode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SchemeSelectionDialog;
