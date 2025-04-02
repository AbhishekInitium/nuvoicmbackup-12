
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
    const lastTier = tiers.length > 0 ? tiers[tiers.length - 1] : null;
    const newFrom = lastTier ? lastTier.to : 0;
    const newTo = newFrom + 100000;
    const newRate = 0.05;

    const newTier: Tier = {
      from: newFrom,
      to: newTo,
      rate: newRate,
      description: `${newFrom} - ${newTo}`
    };

    const newTiers = [...tiers, newTier];
    setTiers(newTiers);
    onUpdateCommissionStructure({ tiers: newTiers });
    
    toast({
      title: "Tier Added",
      description: `Added tier for ${newFrom} - ${newTo}`,
      variant: "default"
    });
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
    
    toast({
      title: "Tier Removed",
      description: "Commission tier has been removed.",
      variant: "default"
    });
  };

  // Update tier
  const updateTier = (index: number, field: keyof Tier, value: number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    
    // Update description
    newTiers[index].description = `${newTiers[index].from} - ${newTiers[index].to}`;
    
    // Validate
    if (field === 'from' && index > 0) {
      const prevTier = newTiers[index - 1];
      if (value < prevTier.to) {
        toast({
          title: "Invalid Range",
          description: "From value must be greater than or equal to previous tier's To value.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (field === 'to' && index < newTiers.length - 1) {
      const nextTier = newTiers[index + 1];
      if (value > nextTier.from) {
        toast({
          title: "Invalid Range",
          description: "To value must be less than or equal to next tier's From value.",
          variant: "destructive"
        });
        return;
      }
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
