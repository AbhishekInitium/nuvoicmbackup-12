
import React, { useEffect, useState } from 'react';
import { Copy, Loader2, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ActionButton from '../ui-custom/ActionButton';
import { MOCK_SCHEMES } from '@/constants/incentiveConstants';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus, getIncentivePlans } from '@/services/incentive/incentivePlanService';

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
      const plans = await getIncentivePlans();
      console.log('Loaded incentive plans:', plans);
      
      if (plans && plans.length > 0) {
        setSchemes(plans);
      } else {
        // If no plans were returned, use mock schemes
        console.log('No plans returned, using mock schemes');
        useMockSchemes();
      }
    } catch (err) {
      console.error('Error loading incentive schemes:', err);
      setError('Failed to load schemes. Using demo schemes instead.');
      useMockSchemes();
    } finally {
      setLoading(false);
    }
  };

  const useMockSchemes = () => {
    const mockSchemes: IncentivePlanWithStatus[] = MOCK_SCHEMES.map(mock => ({
      name: mock.name,
      description: mock.description,
      status: 'APPROVED' as const,
      effectiveStart: '2023-01-01',
      effectiveEnd: '2023-12-31',
      currency: 'USD',
      revenueBase: 'salesOrders',
      participants: ['ALL'],
      salesQuota: 100000,
      commissionStructure: { 
        tiers: [
          { from: 0, to: 50000, rate: 0.01 },
          { from: 50001, to: 100000, rate: 0.02 },
          { from: 100001, to: -1, rate: 0.03 }
        ]
      },
      measurementRules: { 
        primaryMetric: 'Net Revenue', 
        minQualification: 0,
        adjustments: [],
        exclusions: []
      },
      creditRules: { levels: [] },
      customRules: [],
      hasBeenExecuted: false
    }));
    
    setSchemes(mockSchemes);
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
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-app-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-md text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          {schemes.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {schemes.map((scheme, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg hover:bg-app-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleCopyScheme(scheme)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{scheme.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      DEMO
                    </span>
                  </div>
                  <p className="text-sm text-app-gray-500 mt-1 truncate">{scheme.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : schemes.length === 0 ? (
        <div className="p-4 bg-app-gray-50 text-app-gray-600 rounded-md text-sm text-center">
          No schemes found. Create your first scheme by clicking "New Scheme".
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {schemes.map((scheme, index) => (
            <div 
              key={index}
              className="p-3 border rounded-lg hover:bg-app-gray-50 cursor-pointer transition-colors"
              onClick={() => handleCopyScheme(scheme)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{scheme.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  scheme.status === 'APPROVED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {scheme.status}
                </span>
              </div>
              <p className="text-sm text-app-gray-500 mt-1 truncate">{scheme.description}</p>
            </div>
          ))}
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
      <PopoverContent className="w-96" align="end">
        <SchemeListContent />
      </PopoverContent>
    </Popover>
  );
};

export default ExistingSchemeSelector;
