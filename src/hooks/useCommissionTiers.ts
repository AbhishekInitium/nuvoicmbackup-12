
import { useState, useEffect } from 'react';
import { Tier, CommissionStructure } from '@/types/incentiveTypes';
import { hasOverlappingTiers } from '@/utils/validationUtils';

export const useCommissionTiers = (
  initialStructure: CommissionStructure,
  onChange?: (structure: CommissionStructure) => void
) => {
  const [structure, setStructure] = useState<CommissionStructure>(initialStructure || { tiers: [] });

  useEffect(() => {
    if (initialStructure && JSON.stringify(initialStructure) !== JSON.stringify(structure)) {
      setStructure(initialStructure);
    }
  }, [initialStructure]);

  const addTier = () => {
    // Get the highest 'to' value from existing tiers
    const highestTo = structure.tiers.reduce((max, tier) => Math.max(max, tier.to), 0);
    const newFrom = highestTo > 0 ? highestTo + 1 : 0; // Add 1 to the highest 'to' value
    const newTo = newFrom + 10000; // Add a reasonable gap
    
    const updatedStructure = {
      ...structure,
      tiers: [...structure.tiers, { from: newFrom, to: newTo, rate: 1 }]
    };
    
    setStructure(updatedStructure);
    if (onChange) onChange(updatedStructure);
  };

  const removeTier = (index: number) => {
    const updatedTiers = [...structure.tiers];
    updatedTiers.splice(index, 1);
    
    // After removing a tier, ensure progressive tiers for all subsequent tiers
    for (let i = 1; i < updatedTiers.length; i++) {
      if (i === 1) {
        // First tier should start from 0
        continue;
      } else {
        // Set the 'from' value to the previous tier's 'to' value + 1
        updatedTiers[i].from = updatedTiers[i - 1].to + 1;
      }
    }
    
    const updatedStructure = {
      ...structure,
      tiers: updatedTiers
    };
    
    setStructure(updatedStructure);
    if (onChange) onChange(updatedStructure);
  };

  const updateTier = (index: number, field: keyof Tier, value: number) => {
    const updatedTiers = [...structure.tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value
    };

    // If "to" value is updated, update the "from" value of the next tier
    if (field === 'to' && index < updatedTiers.length - 1) {
      updatedTiers[index + 1].from = value + 1;
    }
    
    const updatedStructure = {
      ...structure,
      tiers: updatedTiers
    };
    
    setStructure(updatedStructure);
    if (onChange) onChange(updatedStructure);
  };

  return {
    tiers: structure.tiers,
    addTier,
    removeTier,
    updateTier,
    hasOverlappingTiers: () => hasOverlappingTiers(structure.tiers)
  };
};

export default useCommissionTiers;
