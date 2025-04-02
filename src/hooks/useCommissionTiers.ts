
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CommissionStructure } from '@/types/incentiveTypes';

// Define Tier type since it's being referenced but not exported from incentiveTypes
interface Tier {
  from: number;
  to: number;
  rate: number;
  description?: string;
}

export const useCommissionTiers = (
  initialCommissionStructure: CommissionStructure,
  onUpdateCommissionStructure: (structure: CommissionStructure) => void
) => {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<Tier[]>(initialCommissionStructure.tiers || []);

  // Add new tier
  const addTier = () => {
    const newTier: Tier = {
      from: 0,
      to: 0,
      rate: 0.05,
      description: "New tier"
    };

    const newTiers = [...tiers, newTier];
    setTiers(newTiers);
    onUpdateCommissionStructure({ tiers: newTiers });
    
    toast({
      title: "Tier Added",
      description: "Please define the tier range and commission rate",
      variant: "default"
    });
  };

  // Remove tier
  const removeTier = (index: number) => {
    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    setTiers(newTiers);
    onUpdateCommissionStructure({ tiers: newTiers });
    
    toast({
      title: "Tier Removed",
      description: "Commission tier has been removed.",
      variant: "default"
    });
  };

  // Check for tier overlaps
  const checkTierOverlap = (tiers: Tier[]): boolean => {
    // Sort tiers by the 'from' value
    const sortedTiers = [...tiers].sort((a, b) => a.from - b.from);
    
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      const currentTier = sortedTiers[i];
      const nextTier = sortedTiers[i + 1];
      
      // Check if the current tier's 'to' overlaps with the next tier's 'from'
      // Special case: -1 is used to represent "unlimited" or "no upper bound"
      if (currentTier.to !== -1 && currentTier.to >= nextTier.from) {
        return true;
      }
    }
    
    return false;
  };

  // Update tier
  const updateTier = (index: number, field: keyof Tier, value: number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    
    // Update description if both from and to are set
    if (newTiers[index].from !== undefined && newTiers[index].to !== undefined) {
      const toValue = newTiers[index].to === -1 ? "∞" : newTiers[index].to;
      newTiers[index].description = `${newTiers[index].from} - ${toValue}`;
    }
    
    // Check for tier overlaps
    if (checkTierOverlap(newTiers)) {
      toast({
        title: "Tier Overlap Detected",
        description: "Tiers cannot overlap. Please adjust the tier ranges.",
        variant: "destructive"
      });
      return;
    }
    
    setTiers(newTiers);
    onUpdateCommissionStructure({ tiers: newTiers });
  };

  return {
    tiers,
    addTier,
    removeTier,
    updateTier
  };
};
