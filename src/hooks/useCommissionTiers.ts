
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
    const newFrom = highestTo > 0 ? highestTo : 0;
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
