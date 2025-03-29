
import React, { useEffect, useState } from 'react';
import { Copy, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ActionButton from '../ui-custom/ActionButton';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { getIncentiveSchemes } from '@/services/database/mongoDBService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

interface ExistingSchemeSelectorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSchemeCopy: (scheme: IncentivePlanWithStatus) => void;
  useDialogMode?: boolean;
}

const ExistingSchemeSelector: React.FC<ExistingSchemeSelectorProps> = ({ 
  open, 
  setOpen, 
  onSchemeCopy,
  useDialogMode = false
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState<IncentivePlanWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadIncentiveSchemes();
    }
  }, [open]);

  const loadIncentiveSchemes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading incentive plans from MongoDB');
      const plans = await getIncentiveSchemes();
      console.log('Loaded incentive plans:', plans);
      
      if (plans && plans.length > 0) {
        console.log('Setting schemes with:', plans.length, 'plans');
        setSchemes(plans);
        
        toast({
          title: "Plans Loaded",
          description: `Successfully loaded ${plans.length} incentive plans.`,
          variant: "default"
        });
      } else {
        // If no plans were returned, show error message
        console.log('No plans returned, showing error message');
        setError('No schemes found. Database returned empty response.');
        setSchemes([]);
      }
    } catch (err) {
      console.error('Error loading incentive schemes:', err);
      setError('Failed to load schemes. Database request failed.');
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyScheme = (scheme: IncentivePlanWithStatus) => {
    onSchemeCopy(scheme);
    
    if (!useDialogMode) {
      toast({
        title: "Scheme Copied",
        description: `${scheme.name} has been loaded as a template.`,
        variant: "default"
      });
    }
    
    setOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-amber-100 text-amber-800';
      case 'SIMULATION':
        return 'bg-blue-100 text-blue-800';
      case 'PRODUCTION':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const SchemeListContent = () => (
    <div className="space-y-4">
      {!useDialogMode && (
        <>
          <h3 className="font-medium text-lg">Select a Scheme to Copy</h3>
          <p className="text-sm text-app-gray-500">
            Choose an existing scheme to use as a template
          </p>
        </>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-app-gray-500">
          {schemes.length} {schemes.length === 1 ? 'scheme' : 'schemes'} available
        </span>
        <button
          onClick={loadIncentiveSchemes}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCcw className="h-3 w-3" />}
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-app-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-amber-50 text-amber-600 rounded-md text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      ) : schemes.length === 0 ? (
        <div className="p-4 bg-app-gray-50 text-app-gray-600 rounded-md text-sm text-center">
          No schemes found. Create your first scheme by clicking "New Scheme".
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((scheme, index) => (
                <TableRow key={index} className="hover:bg-app-gray-50">
                  <TableCell className="font-medium">{scheme.name}</TableCell>
                  <TableCell>{formatDate(scheme.metadata?.createdAt || '')}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(scheme.metadata?.status || '')}`}>
                      {scheme.metadata?.status || 'DRAFT'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => handleCopyScheme(scheme)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 ml-auto"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  if (useDialogMode) {
    return <SchemeListContent />;
  }

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
      <PopoverContent className="w-[600px]" align="end">
        <SchemeListContent />
      </PopoverContent>
    </Popover>
  );
};

export default ExistingSchemeSelector;
