
import React from 'react';
import { Copy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ActionButton from '../ui-custom/ActionButton';
import { MOCK_SCHEMES } from '@/constants/incentiveConstants';
import { useToast } from "@/hooks/use-toast";

interface ExistingSchemeSelectorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSchemeCopy: (schemeId: number) => void;
}

const ExistingSchemeSelector: React.FC<ExistingSchemeSelectorProps> = ({ 
  open, 
  setOpen, 
  onSchemeCopy 
}) => {
  const { toast } = useToast();

  const copyExistingScheme = (schemeId: number) => {
    // In a real app, this would fetch the scheme from the backend
    const selectedScheme = MOCK_SCHEMES.find(scheme => scheme.id === schemeId);
    
    if (selectedScheme) {
      toast({
        title: "Scheme Copied",
        description: `${selectedScheme.name} has been loaded as a template.`,
        variant: "default"
      });
      
      onSchemeCopy(schemeId);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Copy size={16} className="mr-2" /> Copy Existing Scheme
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Select a Scheme to Copy</h3>
          <p className="text-sm text-app-gray-500">
            Choose an existing scheme to use as a template
          </p>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {MOCK_SCHEMES.map((scheme) => (
              <div 
                key={scheme.id}
                className="p-3 border rounded-lg hover:bg-app-gray-50 cursor-pointer transition-colors"
                onClick={() => copyExistingScheme(scheme.id)}
              >
                <h4 className="font-medium">{scheme.name}</h4>
                <p className="text-sm text-app-gray-500 mt-1">{scheme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExistingSchemeSelector;
