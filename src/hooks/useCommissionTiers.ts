
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

  // Add new tier with empty/default values
  const addTier = () => {
    // Set default values based on the last tier's "to" value if it exists
    const lastTier = tiers.length > 0 ? tiers[tiers.length - 1] : null;
    const defaultFrom = lastTier ? lastTier.to : 0;
    
    const newTier: Tier = {
      from: defaultFrom,
      to: defaultFrom + 100,  // Default to 100 more than the "from" value
      rate: 0,
      description: ''
    };

    const newTiers = [...tiers, newTier];
    setTiers(newTiers);
    onUpdateCommissionStructure({ tiers: newTiers });
  };

  // Remove tier
  const removeTier = (index: number) => {
    if (tiers.length <= 1) {
      toast({
        title: "Cannot Remove Tier",
        description: "You must have at least one tier in the commission structure.",
        variant: "destructive"
      });
      return;
    }

    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    setTiers(newTiers);
    onUpdateCommissionStructure({ tiers: newTiers });
  };

  // Update tier
  const updateTier = (index: number, field: keyof Tier, value: number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    
    // Update description
    newTiers[index].description = `${newTiers[index].from} - ${newTiers[index].to}`;

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
