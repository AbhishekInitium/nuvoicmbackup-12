
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type ExecutionMode = 'SIMULATE' | 'PRODUCTION';

interface FormValues {
  executionMode: ExecutionMode;
}

const CommissionExecutionEngine = () => {
  const { toast } = useToast();
  const [showSchemeSelector, setShowSchemeSelector] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<IncentivePlanWithStatus | null>(null);
  const [executing, setExecuting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      executionMode: 'SIMULATE',
    },
  });

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

    const executionMode = form.getValues().executionMode;
    setExecuting(true);
    
    try {
      // Simulate execution for now
      toast({
        title: "Execution Started",
        description: `Executing scheme: ${selectedScheme.name} in ${executionMode} mode`,
        variant: "default"
      });
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Execution Complete",
        description: `Successfully executed scheme: ${selectedScheme.name} in ${executionMode} mode`,
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
                  <>
                    <Form {...form}>
                      <div className="mt-6 mb-4">
                        <h3 className="text-lg font-medium mb-3">Execution Mode</h3>
                        <FormField
                          control={form.control}
                          name="executionMode"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="SIMULATE" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Simulation Run (Test calculation without affecting production data)
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="PRODUCTION" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Production Run (Final calculation that will be used for payments)
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Form>
                  
                    <Button 
                      onClick={handleExecuteScheme}
                      disabled={executing}
                      className="w-full mt-6"
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
                  </>
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
