
import React from 'react';
import { Trash2, Percent } from 'lucide-react';
import { Tier } from '@/types/incentiveTypes';
import { formatCurrency } from '@/utils/incentiveUtils';

interface TierRowProps {
  tier: Tier;
  index: number;
  currencySymbol: string;
  updateTier: (index: number, field: keyof Tier, value: string | number) => void;
  removeTier: (index: number) => void;
}

const TierRow: React.FC<TierRowProps> = ({
  tier,
  index,
  currencySymbol,
  updateTier,
  removeTier
}) => {
  return (
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
  );
};

export default TierRow;
