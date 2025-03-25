
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import IncentivePlanDesigner from '@/components/IncentivePlanDesigner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExistingSchemeSelector from '@/components/incentive/ExistingSchemeSelector';
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import { DEFAULT_PLAN } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';

const IncentiveDesigner = () => {
  const { toast } = useToast();
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  const [planTemplate, setPlanTemplate] = useState<IncentivePlan | null>(null);

  const handleCreateNewScheme = () => {
    // Set default template with empty values
    setPlanTemplate({
      ...DEFAULT_PLAN,
      participants: [],
      salesQuota: 0,
      name: '',
      description: ''
    });
    setShowInitialOptions(false);
  };

  const handleCopyExistingScheme = (scheme: IncentivePlanWithStatus) => {
    // Extract necessary properties for the plan template
    const {
      name,
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules,
      creditRules,
      customRules,
      salesQuota = 0
    } = scheme;
    
    const planData: IncentivePlan = {
      name: `Copy of ${name}`,
      description,
      effectiveStart,
      effectiveEnd,
      currency,
      revenueBase,
      participants,
      commissionStructure,
      measurementRules,
      creditRules,
      customRules,
      salesQuota: typeof salesQuota === 'string' ? parseInt(salesQuota) || 0 : salesQuota
    };
    
    setPlanTemplate(planData);
    setShowExistingSchemes(false);
    setShowInitialOptions(false);
    
    toast({
      title: "Plan Loaded",
      description: `Loaded plan: ${scheme.name}`,
      variant: "default"
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <div className="flex items-center py-4 px-8">
          <Link to="/manager">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {showInitialOptions ? (
          <div className="max-w-4xl mx-auto py-16">
            <header className="mb-16 text-center">
              <div className="inline-block mb-2 chip-label">Design</div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-app-gray-900 tracking-tight mb-3">
                Incentive Plan Designer
              </h1>
              <p className="text-app-gray-500 max-w-2xl mx-auto mb-12">
                Create and customize your sales incentive structure with backend integration
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div 
                className="bg-white border border-app-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                onClick={handleCreateNewScheme}
              >
                <div className="h-12 w-12 bg-app-blue-light rounded-full flex items-center justify-center mb-4">
                  <PlusCircle size={24} className="text-app-blue" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Create New Scheme</h2>
                <p className="text-app-gray-500 mb-6 flex-grow">
                  Start with a blank template and build your incentive scheme from scratch.
                </p>
                <Button className="mt-auto w-full">Create New</Button>
              </div>
              
              <div 
                className="bg-white border border-app-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                onClick={() => setShowExistingSchemes(true)}
              >
                <div className="h-12 w-12 bg-app-green-light rounded-full flex items-center justify-center mb-4">
                  <Copy size={24} className="text-app-green" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Copy Existing Scheme</h2>
                <p className="text-app-gray-500 mb-6 flex-grow">
                  Use an existing scheme as a template and modify it to create a new one.
                </p>
                <Button variant="outline" className="mt-auto w-full">Select Existing</Button>
              </div>
            </div>
          </div>
        ) : (
          <IncentivePlanDesigner initialPlan={planTemplate} onBack={() => setShowInitialOptions(true)} />
        )}
        
        <Dialog open={showExistingSchemes} onOpenChange={setShowExistingSchemes}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Select a Scheme to Copy</DialogTitle>
            </DialogHeader>
            <ExistingSchemeSelector 
              open={showExistingSchemes}
              setOpen={setShowExistingSchemes}
              onSchemeCopy={handleCopyExistingScheme}
              useDialogMode={true}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default IncentiveDesigner;
