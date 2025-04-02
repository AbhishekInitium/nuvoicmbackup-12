
import React from 'react';
import { Copy, Edit } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ActionButton from '../ui-custom/ActionButton';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import SchemeListContent from './scheme-list/SchemeListContent';

interface ExistingSchemeSelectorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSchemeCopy: (scheme: IncentivePlanWithStatus) => void;
  useDialogMode?: boolean;
  editMode?: boolean;
}

const ExistingSchemeSelector: React.FC<ExistingSchemeSelectorProps> = ({ 
  open, 
  setOpen, 
  onSchemeCopy,
  useDialogMode = false,
  editMode = false
}) => {
  const { toast } = useToast();

  const handleCopyScheme = (scheme: IncentivePlanWithStatus) => {
    onSchemeCopy(scheme);
    
    if (!useDialogMode) {
      toast({
        title: editMode ? "Scheme Selected for Editing" : "Scheme Copied",
        description: `${scheme.name} has been loaded${editMode ? " for editing" : " as a template"}.`,
        variant: "default"
      });
    }
    
    setOpen(false);
  };

  if (useDialogMode) {
    return (
      <>
        <h3 className="font-medium text-lg mb-4">{editMode ? "Select a Scheme to Edit" : "Select a Scheme to Copy"}</h3>
        <p className="text-sm text-app-gray-500 mb-4">
          {editMode 
            ? "Choose an existing scheme to edit and create a new version" 
            : "Choose an existing scheme to use as a template"}
        </p>
        <SchemeListContent 
          open={open} 
          onSchemeCopy={handleCopyScheme}
          editMode={editMode}
        />
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          {editMode ? (
            <>
              <Edit size={16} className="mr-2" /> Edit Existing Scheme
            </>
          ) : (
            <>
              <Copy size={16} className="mr-2" /> Copy Existing Scheme
            </>
          )}
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent className="w-[600px]" align="end">
        <div>
          <h3 className="font-medium text-lg">{editMode ? "Select a Scheme to Edit" : "Select a Scheme to Copy"}</h3>
          <p className="text-sm text-app-gray-500 mb-4">
            {editMode 
              ? "Choose an existing scheme to edit and create a new version" 
              : "Choose an existing scheme to use as a template"}
          </p>
          <SchemeListContent 
            open={open} 
            onSchemeCopy={handleCopyScheme}
            editMode={editMode}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExistingSchemeSelector;
