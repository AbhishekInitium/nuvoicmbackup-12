
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { useToast } from "@/hooks/use-toast";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';
import SchemeTable from '@/components/incentive/SchemeTable';
import { getIncentiveSchemes } from '@/services/database/mongoDBService';
import DesignerNavigation from '@/components/incentive/DesignerNavigation';
import SchemeAdministratorScreen from '@/components/incentive/scheme-admin/SchemeAdministratorScreen';
import { Button } from '@/components/ui/button';

const IncentiveDesigner = () => {
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<IncentivePlanWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);
  const [showAdminScreen, setShowAdminScreen] = useState(false);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setIsLoading(true);
    try {
      const loadedSchemes = await getIncentiveSchemes();
      
      // Convert to IncentivePlanWithStatus format
      const formattedSchemes = loadedSchemes.map(scheme => ({
        ...scheme,
        status: scheme.metadata?.status || 'DRAFT',
        metadata: {
          createdAt: scheme.metadata?.createdAt || new Date().toISOString(),
          updatedAt: scheme.metadata?.updatedAt || new Date().toISOString(),
          version: scheme.metadata?.version || 1,
          status: scheme.metadata?.status || 'DRAFT'
        }
      })) as IncentivePlanWithStatus[];
      
      setSchemes(formattedSchemes);
      
      toast({
        title: "Schemes Loaded",
        description: `Loaded ${formattedSchemes.length} incentive schemes.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to load schemes:", error);
      toast({
        title: "Error",
        description: "Failed to load incentive schemes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsReadOnly(false);
    setShowDesigner(true);
    
    toast({
      title: "New Scheme",
      description: "Creating new incentive scheme",
      variant: "default"
    });
  };

  const handleViewScheme = (scheme: IncentivePlanWithStatus) => {
    setPlanTemplate(scheme);
    setIsEditMode(true);
    // Only editable if status is DRAFT
    setIsReadOnly(scheme.metadata.status !== 'DRAFT'); 
    setShowDesigner(true);
    
    toast({
      title: scheme.metadata.status === 'DRAFT' ? "Edit Scheme" : "View Scheme",
      description: `${scheme.metadata.status === 'DRAFT' ? 'Editing' : 'Viewing'} scheme: ${scheme.name}`,
      variant: "default"
    });
  };

  const handleBackToTable = () => {
    setShowDesigner(false);
    setShowAdminScreen(false);
    loadSchemes(); // Refresh the list when coming back
  };

  const handleOpenAdmin = () => {
    setShowAdminScreen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <DesignerNavigation 
          onBack={showDesigner || showAdminScreen ? handleBackToTable : undefined}
          showBackToDashboard={!showDesigner && !showAdminScreen}
          title={showDesigner ? (isEditMode ? (isReadOnly ? "View Scheme" : "Edit Scheme") : "Create Scheme") : "Scheme Management"}
        />
        
        {showAdminScreen ? (
          <SchemeAdministratorScreen onBack={handleBackToTable} />
        ) : showDesigner ? (
          <IncentivePlanDesigner 
            initialPlan={planTemplate} 
            isEditMode={isEditMode}
            isReadOnly={isReadOnly}
            onBack={handleBackToTable}
          />
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Incentive Scheme Management</h1>
              <Button onClick={handleOpenAdmin} variant="outline">
                Scheme Administrator
              </Button>
            </div>
            
            <SchemeTable 
              schemes={schemes}
              onViewDetails={handleViewScheme}
              onCreateNew={handleCreateNewScheme}
              isLoading={isLoading}
              onRefresh={loadSchemes}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
