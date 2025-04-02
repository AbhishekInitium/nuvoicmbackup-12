
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCcw, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { getIncentiveSchemes } from '@/services/database/mongoDBService';
import SchemeListTable from './SchemeListTable';

interface SchemeListContentProps {
  open: boolean;
  onSchemeCopy: (scheme: IncentivePlanWithStatus) => void;
  editMode?: boolean;
}

const SchemeListContent: React.FC<SchemeListContentProps> = ({ 
  open, 
  onSchemeCopy,
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

  return (
    <div className="space-y-4">
      {editMode ? (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-4">
          <div className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            <p>When you edit a scheme, a new version will be created automatically upon saving.</p>
          </div>
        </div>
      ) : null}
      
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
        <SchemeListTable 
          schemes={schemes} 
          editMode={editMode}
          onSelectScheme={onSchemeCopy}
        />
      )}
    </div>
  );
};

export default SchemeListContent;
