
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Tier } from '@/types/incentiveTypes';

export const useCommissionTiers = (
  initialTiers: Tier[], 
  onUpdateCommissionStructure: (tiers: Tier[]) => void
) => {
  const { toast } = useToast();
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);

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
    
    setTiers(newTiers);
    onUpdateCommissionStructure(newTiers);
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
    
    setTiers(newTiers);
    onUpdateCommissionStructure(newTiers);
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
    
    setTiers(newTiers);
    onUpdateCommissionStructure(newTiers);
  };

  return {
    tiers,
    addTier,
    removeTier,
    updateTier
  };
};
