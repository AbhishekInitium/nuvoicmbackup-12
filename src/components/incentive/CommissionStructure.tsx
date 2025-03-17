
import React from 'react';
import { PlusCircle, Trash2, Percent } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { useToast } from "@/hooks/use-toast";
import { Tier } from '@/types/incentiveTypes';
import { getCurrencySymbol, formatCurrency } from '@/utils/incentiveUtils';

interface CommissionStructureProps {
  tiers: Tier[];
  currency: string;
  updateCommissionStructure: (tiers: Tier[]) => void;
}

const CommissionStructure: React.FC<CommissionStructureProps> = ({ 
  tiers, 
  currency,
  updateCommissionStructure 
}) => {
  const { toast } = useToast();
  const currencySymbol = getCurrencySymbol(currency);

  const addTier = () => {
    const newTiers = [...tiers];
    const lastTier = newTiers[newTiers.length - 1];
    
    // Ensure the new tier starts exactly 1 higher than the previous tier's end
    const newFrom = lastTier.to + 1;
    const newTo = newFrom + 50000;
    const newRate = lastTier.rate + 1;
    
    newTiers.push({
      from: newFrom,
      to: newTo,
      rate: newRate
    });
    
    updateCommissionStructure(newTiers);
  };

  const removeTier = (index: number) => {
    // Don't allow removing the base tier (index 0)
    if (index === 0) {
      toast({
        title: "Cannot Remove Base Tier",
        description: "The base tier cannot be removed as it defines the starting commission rate.",
        variant: "destructive"
      });
      return;
    }
    
    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    
    updateCommissionStructure(newTiers);
  };

  const updateTier = (index: number, field: keyof Tier, value: string | number) => {
    const newTiers = [...tiers];
    
    // Parse the value as a number with 2 decimal places
    const numValue = parseFloat(parseFloat(value as string).toFixed(2));
    
    // Validate tier boundaries
    if (field === 'from' || field === 'to') {
      // If updating the 'from' value, ensure it's greater than the previous tier's 'to'
      if (field === 'from' && index > 0) {
        const prevTier = newTiers[index - 1];
        if (numValue <= prevTier.to) {
          toast({
            title: "Invalid Range",
            description: `From value must be greater than previous tier's To value (${prevTier.to})`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // If updating the 'to' value, ensure it's greater than the current 'from'
      if (field === 'to') {
        const currentFrom = newTiers[index].from;
        if (numValue <= currentFrom) {
          toast({
            title: "Invalid Range",
            description: "To value must be greater than From value",
            variant: "destructive"
          });
          return;
        }
        
        // If not the last tier, ensure the 'to' value is less than the next tier's 'from'
        if (index < newTiers.length - 1) {
          const nextTier = newTiers[index + 1];
          if (numValue >= nextTier.from) {
            toast({
              title: "Invalid Range",
              description: `To value must be less than next tier's From value (${nextTier.from})`,
              variant: "destructive"
            });
            return;
          }
        }
      }
    }
    
    // Update the field
    newTiers[index][field] = numValue;
    
    updateCommissionStructure(newTiers);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-app-gray-700">Tiered Commission Structure</label>
          <ActionButton 
            variant="outline"
            size="sm"
            onClick={addTier}
          >
            <PlusCircle size={16} className="mr-1" /> Add Tier
          </ActionButton>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-app-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-app-gray-200">
              <thead>
                <tr className="bg-app-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">From ({currencySymbol})</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">To ({currencySymbol})</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Commission Rate (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-app-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-app-gray-200">
                {tiers.map((tier, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-gray-50 bg-opacity-30'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input 
                          type="number" 
                          className="form-input pl-8 py-2"
                          value={formatCurrency(tier.from)}
                          onChange={(e) => updateTier(index, 'from', e.target.value)}
                          disabled={index > 0} // First tier's "from" can be edited, others are derived
                          step="0.01"
                          min="0"
                          max="9999999999999.99"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-app-gray-400">{currencySymbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input 
                          type="number" 
                          className="form-input pl-8 py-2"
                          value={formatCurrency(tier.to)}
                          onChange={(e) => updateTier(index, 'to', e.target.value)}
                          step="0.01"
                          min="0"
                          max="9999999999999.99"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-app-gray-400">{currencySymbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.1"
                          className="form-input pl-8 py-2"
                          value={tier.rate}
                          onChange={(e) => updateTier(index, 'rate', e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Percent size={16} className="text-app-gray-400" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-app-gray-500">
                      {index === 0 ? 'Base Tier' : `Tier ${index}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {index === 0 ? (
                        <span className="text-app-gray-400">-</span>
                      ) : (
                        <button 
                          className="text-app-red hover:text-opacity-80 transition-colors duration-200"
                          onClick={() => removeTier(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-app-gray-500 mt-3">
          Sales within each tier range will be commissioned at the corresponding rate.
        </p>
      </div>
    </div>
  );
};

export default CommissionStructure;
