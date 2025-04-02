import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { IncentivePlan } from '@/types/incentiveTypes';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';

interface SchemeCreationOptionsProps {
  setPlanTemplate: (plan: IncentivePlan | null) => void;
  setShowExistingSchemes: (show: boolean) => void;
  setShowEditSchemes: (show: boolean) => void;
  setIsEditMode: (isEdit: boolean) => void;
  setShowInitialOptions: (show: boolean) => void;
}

export const useSchemeCreationOptions = ({
  setPlanTemplate,
  setShowExistingSchemes,
  setShowEditSchemes,
  setIsEditMode,
  setShowInitialOptions
}: SchemeCreationOptionsProps) => {
  const { toast } = useToast();

  const generateTimestampId = () => {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).substring(2);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `ICM_${day}${month}${year}_${hours}${minutes}${seconds}`;
  };

  const handleCreateNewScheme = () => {
    // Initialize with empty data - no prefilled fields
    setPlanTemplate({
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      name: '', // Empty name for user to fill in
      schemeId: generateTimestampId(), // Generate a new scheme ID
      description: '',
      commissionStructure: {
        tiers: []
      },
      measurementRules: {
        primaryMetrics: [], // No prefilled metrics
        minQualification: 0,
        adjustments: [],
        exclusions: []
      },
      creditRules: {
        levels: []
      },
      customRules: []
    });
    setIsEditMode(false);
    setShowInitialOptions(false);
  };

  const handleCopyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Keep the _id field from MongoDB for reference
    const planData: IncentivePlan = {
      _id: scheme._id, // MongoDB document ID
      name: `Copy of ${scheme.name}`, // Suggest a name, but user can change it
      schemeId: generateTimestampId(), // Generate a new scheme ID for the copy
      description: `Copy of ${scheme.name}`,
      effectiveStart: scheme.effectiveStart,
      effectiveEnd: scheme.effectiveEnd,
      currency: scheme.currency,
      revenueBase: scheme.revenueBase,
      participants: Array.isArray(scheme.participants) ? [...scheme.participants] : [],
      commissionStructure: {
        tiers: Array.isArray(scheme.commissionStructure?.tiers) ? [...scheme.commissionStructure.tiers] : []
      },
      measurementRules: {
        primaryMetrics: Array.isArray(scheme.measurementRules?.primaryMetrics) 
          ? [...scheme.measurementRules.primaryMetrics] 
          : [],
        minQualification: scheme.measurementRules?.minQualification || 0,
        adjustments: Array.isArray(scheme.measurementRules?.adjustments) 
          ? [...scheme.measurementRules.adjustments] 
          : [],
        exclusions: Array.isArray(scheme.measurementRules?.exclusions) 
          ? [...scheme.measurementRules.exclusions] 
          : []
      },
      creditRules: {
        levels: Array.isArray(scheme.creditRules?.levels) ? [...scheme.creditRules.levels] : []
      },
      customRules: Array.isArray(scheme.customRules) ? [...scheme.customRules] : [],
      salesQuota: typeof scheme.salesQuota === 'string' ? parseInt(scheme.salesQuota) || 0 : scheme.salesQuota
    };
    
    setPlanTemplate(planData);
    setShowExistingSchemes(false);
    setIsEditMode(false);
    setShowInitialOptions(false);
    
    toast({
      title: "Plan Loaded",
      description: `Loaded plan: ${scheme.name}`,
      variant: "default"
    });
  };

  const handleEditExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Include all fields from MongoDB including _id
    const planData: IncentivePlan = {
      _id: scheme._id, // MongoDB document ID 
      ...scheme,
      // Don't modify version here, IncentivePlanDesigner will handle it
      metadata: {
        ...scheme.metadata,
        updatedAt: new Date().toISOString()
      }
    };
    
    setPlanTemplate(planData);
    setShowEditSchemes(false);
    setIsEditMode(true);
    setShowInitialOptions(false);
    
    toast({
      title: "Plan Loaded for Editing",
      description: `Editing plan: ${scheme.name} (Version ${scheme.metadata?.version || 1})`,
      variant: "default"
    });
  };

  return {
    handleCreateNewScheme,
    handleCopyExistingScheme,
    handleEditExistingScheme
  };
};
