import React, { useEffect, useState } from 'react';
import { Copy, Loader2, AlertCircle, RefreshCcw, Edit, History } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ActionButton from '../ui-custom/ActionButton';
import { Button } from '../ui/button';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { getIncentiveSchemes } from '@/services/database/mongoDBService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

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
        
        const validPlans = plans.map(plan => {
          const status = (plan.metadata?.status || 'DRAFT') as 'DRAFT' | 'APPROVED' | 'SIMULATION' | 'PRODUCTION';
          
          return {
            _id: plan._id || '',
            name: plan.name || 'Unnamed Plan',
            schemeId: plan.schemeId || '',
            description: plan.description || '',
            effectiveStart: plan.effectiveStart || '',
            effectiveEnd: plan.effectiveEnd || '',
            currency: plan.currency || 'USD',
            revenueBase: plan.revenueBase || '',
            participants: Array.isArray(plan.participants) ? plan.participants : [],
            status: status,
            salesQuota: plan.salesQuota || 0,
            commissionStructure: {
              tiers: Array.isArray(plan.commissionStructure?.tiers) ? plan.commissionStructure.tiers : []
            },
            measurementRules: {
              primaryMetrics: Array.isArray(plan.measurementRules?.primaryMetrics) 
                ? plan.measurementRules.primaryMetrics 
                : [],
              minQualification: plan.measurementRules?.minQualification || 0,
              adjustments: Array.isArray(plan.measurementRules?.adjustments) 
                ? plan.measurementRules.adjustments 
                : [],
              exclusions: Array.isArray(plan.measurementRules?.exclusions) 
                ? plan.measurementRules.exclusions 
                : []
            },
            creditRules: {
              levels: Array.isArray(plan.creditRules?.levels) ? plan.creditRules.levels : []
            },
            customRules: Array.isArray(plan.customRules) ? plan.customRules : [],
            metadata: {
              createdAt: plan.metadata?.createdAt || new Date().toISOString(),
              updatedAt: plan.metadata?.updatedAt || new Date().toISOString(),
              version: plan.metadata?.version || 1,
              status: status
            }
          } as IncentivePlanWithStatus;
        });
        
        setSchemes(validPlans);
        
        toast({
          title: "Plans Loaded",
          description: `Successfully loaded ${plans.length} incentive plans.`,
          variant: "default"
        });
      } else {
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
        title: editMode ? "Scheme Selected for Editing" : "Scheme Copied",
        description: `${scheme.name} has been loaded${editMode ? " for editing" : " as a template"}.`,
        variant: "default"
      });
    }
    
    setOpen(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status: string | undefined) => {
    const statusUpper = status?.toUpperCase() || '';
    switch (statusUpper) {
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
          <h3 className="font-medium text-lg">{editMode ? "Select a Scheme to Edit" : "Select a Scheme to Copy"}</h3>
          <p className="text-sm text-app-gray-500">
            {editMode 
              ? "Choose an existing scheme to edit and create a new version" 
              : "Choose an existing scheme to use as a template"}
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
                <TableHead>Date Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((scheme, index) => (
                <TableRow key={index} className="hover:bg-app-gray-50">
                  <TableCell className="font-medium">{scheme.name}</TableCell>
                  <TableCell>{formatDate(scheme.metadata?.updatedAt || scheme.metadata?.createdAt)}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(scheme.metadata?.status)}`}>
                      {scheme.metadata?.status || 'DRAFT'}
                    </span>
                  </TableCell>
                  <TableCell>{scheme.metadata?.version || 1}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleCopyScheme(scheme)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        {editMode ? (
                          <>
                            <Edit size={14} />
                            Edit
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {editMode && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
          <div className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            <p>When you edit a scheme, a new version will be created automatically upon saving.</p>
          </div>
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
        <SchemeListContent />
      </PopoverContent>
    </Popover>
  );
};

export default ExistingSchemeSelector;
