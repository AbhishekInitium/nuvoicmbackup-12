
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';

import SchemeOptionsScreen from '@/components/incentive/SchemeOptionsScreen';
import DesignerNavigation from '@/components/incentive/DesignerNavigation';
import SchemeSelectionDialog from '@/components/incentive/SchemeSelectionDialog';
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard, FileSpreadsheet } from 'lucide-react';

const IncentiveDesigner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [showEditSchemes, setShowEditSchemes] = useState(false);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
    setShowRoleSelection(false);
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
    setShowRoleSelection(false);
    
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
    setShowRoleSelection(false);
    
    toast({
      title: "Plan Loaded for Editing",
      description: `Editing plan: ${scheme.name} (Version ${scheme.metadata?.version || 1})`,
      variant: "default"
    });
  };

  const navigateToSchemeAdmin = () => {
    navigate('/manager/scheme-administrator');
  };

  // Role selection screen
  const renderRoleSelectionScreen = () => {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Select Your Role
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={navigateToSchemeAdmin}>
            <CardContent className="pt-6 pb-6">
              <div className="text-center mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Scheme Administrator</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Set up KPIs and data mappings for scheme designers
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => setShowRoleSelection(false)}
          >
            <CardContent className="pt-6 pb-6">
              <div className="text-center mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <Clipboard className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Scheme Creator</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create, copy, or edit incentive schemes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        {showInitialOptions && !showRoleSelection && (
          <DesignerNavigation 
            onBack={() => setShowRoleSelection(true)}
            showBackToDashboard={false}
          />
        )}
        
        {showRoleSelection ? (
          renderRoleSelectionScreen()
        ) : showInitialOptions ? (
          <SchemeOptionsScreen 
            onCreateNewScheme={handleCreateNewScheme}
            onOpenExistingSchemes={() => setShowExistingSchemes(true)}
            onEditExistingScheme={() => setShowEditSchemes(true)}
          />
        ) : (
          <IncentivePlanDesigner 
            initialPlan={planTemplate} 
            isEditMode={isEditMode}
            onBack={() => setShowInitialOptions(true)}
          />
        )}
        
        <SchemeSelectionDialog 
          open={showExistingSchemes}
          setOpen={setShowExistingSchemes}
          onSchemeCopy={handleCopyExistingScheme}
          title="Copy Existing Scheme"
          description="Select a scheme to use as a template for a new scheme"
        />

        <SchemeSelectionDialog 
          open={showEditSchemes}
          setOpen={setShowEditSchemes}
          onSchemeCopy={handleEditExistingScheme}
          title="Edit Existing Scheme"
          description="Select a scheme to edit. A new version will be created."
          editMode={true}
        />
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
