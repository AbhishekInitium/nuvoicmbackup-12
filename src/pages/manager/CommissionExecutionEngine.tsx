import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { IncentivePlanWithStatus } from '@/services/incentive/incentivePlanService';
import SchemeExecutionSelectDialog from '@/components/incentive/SchemeExecutionSelectDialog';
import { Loader2, PlayCircle } from 'lucide-react';

const CommissionExecutionEngine = () => {
  const { toast } = useToast();
  const [showSchemeSelector, setShowSchemeSelector] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<IncentivePlanWithStatus | null>(null);
  const [executing, setExecuting] = useState(false);

  const handleSchemeSelect = (scheme: IncentivePlanWithStatus) => {
    setSelectedScheme(scheme);
    toast({
      title: "Scheme Selected",
      description: `Selected scheme: ${scheme.name}`,
      variant: "default"
    });
  };

  const handleExecuteScheme = async () => {
    if (!selectedScheme) {
      toast({
        title: "Error",
        description: "Please select a scheme to execute",
        variant: "destructive"
      });
      return;
    }

    setExecuting(true);
    
    try {
      // Simulate execution for now
      toast({
        title: "Execution Started",
        description: `Executing scheme: ${selectedScheme.name}`,
        variant: "default"
      });
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Execution Complete",
        description: `Successfully executed scheme: ${selectedScheme.name}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Execution error:', error);
      toast({
        title: "Execution Failed",
        description: `Failed to execute scheme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <div className="py-12 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Commission Execution Engine</h1>
            <p className="text-app-gray-600 mt-2">
              Execute commission calculations for your incentive schemes
            </p>
            <Separator className="my-6" />
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Incentive Scheme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => setShowSchemeSelector(true)}
                    variant="outline"
                  >
                    Select Scheme
                  </Button>
                  
                  {selectedScheme && (
                    <div className="bg-app-gray-100 p-2 rounded flex-grow">
                      <p className="font-medium">{selectedScheme.name}</p>
                      <p className="text-sm text-app-gray-600">{selectedScheme.description}</p>
                    </div>
                  )}
                </div>
                
                {selectedScheme && (
                  <Button 
                    onClick={handleExecuteScheme}
                    disabled={executing}
                    className="w-full mt-4"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Execute Commission Calculation
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Additional execution details would go here */}
        </div>
        
        <SchemeExecutionSelectDialog
          open={showSchemeSelector}
          setOpen={setShowSchemeSelector}
          onSchemeSelect={handleSchemeSelect}
        />
      </Container>
    </div>
  );
};

export default CommissionExecutionEngine;
