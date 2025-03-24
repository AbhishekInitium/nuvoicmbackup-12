
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, AlertTriangle, Calendar, Truck, Monitor, Shield, Info } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import SectionPanel from '@/components/ui-custom/SectionPanel';
import GlassCard from '@/components/ui-custom/GlassCard';
import ActionButton from '@/components/ui-custom/ActionButton';
import { useToast } from "@/hooks/use-toast";
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IncentivePlan } from '@/types/incentiveTypes';
import { 
  executeCommissionCalculation, 
  ExecutionMode,
  CommissionExecutionParams,
  CommissionExecutionResult
} from '@/services/incentive/commissionExecutionService';
import { 
  IncentivePlanWithStatus, 
  getIncentivePlans, 
  markPlanAsExecuted 
} from '@/services/incentive/incentivePlanService';

const CommissionExecutionEngine: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [incentivePlans, setIncentivePlans] = useState<IncentivePlanWithStatus[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('SIMULATE');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [executionDate, setExecutionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CommissionExecutionResult | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<IncentivePlanWithStatus | null>(null);
  
  useEffect(() => {
    loadApprovedPlans();
  }, []);

  const loadApprovedPlans = async () => {
    setLoadingPlans(true);
    try {
      // Only load APPROVED plans
      const plans = await getIncentivePlans('APPROVED');
      setIncentivePlans(plans);
    } catch (error) {
      console.error('Error loading approved incentive plans:', error);
      toast({
        title: "Error Loading Plans",
        description: "There was an error loading the approved incentive plans.",
        variant: "destructive"
      });
    } finally {
      setLoadingPlans(false);
    }
  };
  
  useEffect(() => {
    if (incentivePlans && selectedPlanId) {
      const plan = incentivePlans.find(p => p.name === selectedPlanId);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [selectedPlanId, incentivePlans]);
  
  const executeCommission = async () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select an incentive plan to execute",
        variant: "destructive"
      });
      return;
    }

    // Check if the plan has already been executed in production
    if (executionMode === 'PRODUCTION' && selectedPlan.hasBeenExecuted) {
      toast({
        title: "Plan Already Executed",
        description: "This plan has already been executed in production mode and cannot be executed again.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExecuting(true);
      
      const params: CommissionExecutionParams = {
        planId: selectedPlan.name,
        executionMode,
        executionDate,
        periodStart: selectedPlan.effectiveStart,
        periodEnd: selectedPlan.effectiveEnd,
        participants: selectedPlan.participants,
        description
      };
      
      const result = await executeCommissionCalculation(selectedPlan, params);
      
      setExecutionResult(result);
      
      // If this was a production run, mark the plan as executed
      if (executionMode === 'PRODUCTION') {
        await markPlanAsExecuted(selectedPlan.name);
        
        // Update the local state to reflect the change
        setIncentivePlans(prevPlans => 
          prevPlans.map(plan => 
            plan.name === selectedPlan.name 
              ? { ...plan, hasBeenExecuted: true, lastExecutionDate: new Date().toISOString() } 
              : plan
          )
        );
        
        if (selectedPlan) {
          setSelectedPlan({
            ...selectedPlan,
            hasBeenExecuted: true,
            lastExecutionDate: new Date().toISOString()
          });
        }
      }
      
      toast({
        title: `${executionMode} Execution Complete`,
        description: `Successfully executed ${selectedPlan.name} in ${executionMode} mode`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error executing commission calculation:', error);
      toast({
        title: "Execution Failed",
        description: "An error occurred during commission execution. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <div className="py-12 sm:py-16 px-4 md:px-8 min-h-screen">
          <header className="mb-12 text-center">
            <div className="inline-block mb-2 chip-label">Execute</div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-app-gray-900 tracking-tight mb-3">
              Commission Execution Engine
            </h1>
            <p className="text-app-gray-500 max-w-2xl mx-auto">
              Execute incentive plans in simulation or production mode
            </p>
          </header>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SectionPanel title="Execution Parameters" defaultExpanded={true}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">
                      Select Incentive Plan
                    </label>
                    <Select 
                      value={selectedPlanId}
                      onValueChange={setSelectedPlanId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an approved incentive plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingPlans ? (
                          <SelectItem value="loading" disabled>Loading approved plans...</SelectItem>
                        ) : incentivePlans.length === 0 ? (
                          <SelectItem value="none" disabled>No approved plans available</SelectItem>
                        ) : (
                          incentivePlans.map((plan, index) => (
                            <SelectItem 
                              key={index} 
                              value={plan.name}
                              disabled={plan.hasBeenExecuted}
                            >
                              {plan.name} {plan.hasBeenExecuted ? "(Already Executed)" : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    
                    {incentivePlans.length === 0 && !loadingPlans && (
                      <div className="mt-2 text-sm text-amber-600 flex items-center">
                        <Info size={16} className="mr-1" />
                        No approved plans available. Plans must be approved by Finance before execution.
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">
                      Execution Mode
                    </label>
                    <RadioGroup 
                      value={executionMode}
                      onValueChange={(value) => setExecutionMode(value as ExecutionMode)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SIMULATE" id="simulate" />
                        <Label htmlFor="simulate" className="flex items-center">
                          <Monitor size={16} className="mr-1" /> Simulation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="PRODUCTION" 
                          id="production" 
                          disabled={selectedPlan?.hasBeenExecuted}
                        />
                        <Label htmlFor="production" className="flex items-center">
                          <Truck size={16} className="mr-1" /> Production
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm text-app-gray-500 mt-2">
                      {executionMode === 'SIMULATE' 
                        ? 'Simulation mode allows testing without finalizing results'
                        : 'Production mode will generate final, official results for payment'}
                    </p>
                    
                    {selectedPlan?.hasBeenExecuted && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                        This plan has already been executed in production mode on{' '}
                        {new Date(selectedPlan.lastExecutionDate || '').toLocaleDateString()}
                        {' '}and cannot be executed again.
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">
                      Execution Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar size={16} className="text-app-gray-400" />
                      </div>
                      <Input
                        type="date"
                        className="pl-10"
                        value={executionDate}
                        onChange={(e) => setExecutionDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {selectedPlan && (
                    <div className="p-4 bg-app-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        <Shield className="h-4 w-4 text-app-blue mr-2" />
                        <h3 className="text-sm font-medium text-app-gray-700">Plan Details</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Start: </span>
                          {new Date(selectedPlan.effectiveStart).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">End: </span>
                          {new Date(selectedPlan.effectiveEnd).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Status: </span>
                          <span className={selectedPlan.status === 'APPROVED' ? 'text-green-600' : 'text-amber-600'}>
                            {selectedPlan.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-app-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter an optional description for this execution"
                      rows={3}
                    />
                  </div>
                  
                  {executionMode === 'PRODUCTION' && (
                    <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Production mode will generate official results that may be used for payouts.
                            This cannot be undone!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={executeCommission}
                      disabled={
                        isExecuting || 
                        !selectedPlanId || 
                        (executionMode === 'PRODUCTION' && selectedPlan?.hasBeenExecuted)
                      }
                    >
                      <Play size={18} className="mr-2" />
                      {isExecuting ? 'Executing...' : `Execute ${executionMode === 'PRODUCTION' ? 'Production Run' : 'Simulation'}`}
                    </Button>
                    
                    {selectedPlan && (
                      <div className="mt-4 text-center">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/manager')}
                        >
                          Back to Dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SectionPanel>
            </div>
            
            <div className="lg:col-span-2">
              {executionResult ? (
                <SectionPanel title="Execution Results" defaultExpanded={true}>
                  <div className="space-y-6">
                    <div className="p-4 bg-app-blue-50 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-app-blue-900">
                            {executionResult.executionMode} Execution
                          </h3>
                          <p className="text-sm text-app-blue-700">
                            Plan: {executionResult.planId}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-app-blue-700">
                            Executed on: {new Date(executionResult.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-sm font-medium text-app-blue-900">
                            ID: {executionResult.executionId}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-app-gray-200 py-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <div className="text-sm text-app-gray-500">Period</div>
                          <div className="text-lg font-medium">
                            {new Date(executionResult.periodStart).toLocaleDateString()} - {new Date(executionResult.periodEnd).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-app-gray-500">Total Commission</div>
                          <div className="text-lg font-medium text-app-green-600">
                            ${executionResult.totalCommission.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-lg text-app-gray-800">Participant Results</h3>
                    
                    <div className="space-y-4">
                      {executionResult.participantResults.map((participant, index) => (
                        <GlassCard key={index} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-app-gray-500">Participant ID</div>
                              <div className="font-medium">{participant.participantId}</div>
                              
                              <div className="mt-3 text-sm text-app-gray-500">Sales Amount</div>
                              <div className="font-medium">${participant.salesAmount.toFixed(2)}</div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-app-gray-500">Commission Amount</div>
                              <div className="font-medium text-app-green-600">${participant.commissionAmount.toFixed(2)}</div>
                              
                              <div className="mt-3 text-sm text-app-gray-500">Applied Rate</div>
                              <div className="font-medium">{participant.appliedRate}% (Tier: {participant.tier})</div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Tabs defaultValue="adjustments">
                              <TabsList>
                                <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
                                <TabsTrigger value="rules">Custom Rules</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="adjustments">
                                {participant.adjustments.length === 0 ? (
                                  <p className="text-sm text-app-gray-500 py-2">No adjustments applied</p>
                                ) : (
                                  <ul className="text-sm divide-y">
                                    {participant.adjustments.map((adj, i) => (
                                      <li key={i} className="py-2 flex justify-between">
                                        <span>{adj.description}</span>
                                        <span className={adj.impact >= 0 ? 'text-app-green-600' : 'text-app-red-600'}>
                                          {adj.impact >= 0 ? '+' : ''}{adj.impact.toFixed(2)}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="rules">
                                {participant.customRulesApplied.length === 0 ? (
                                  <p className="text-sm text-app-gray-500 py-2">No custom rules applied</p>
                                ) : (
                                  <ul className="text-sm">
                                    {participant.customRulesApplied.map((rule, i) => (
                                      <li key={i} className="py-1">{rule}</li>
                                    ))}
                                  </ul>
                                )}
                              </TabsContent>
                            </Tabs>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <Button variant="outline" onClick={() => setExecutionResult(null)}>
                        Back to Parameters
                      </Button>
                      
                      {executionMode === 'SIMULATE' && selectedPlan && !selectedPlan.hasBeenExecuted && (
                        <Button 
                          onClick={() => {
                            setExecutionMode('PRODUCTION');
                            setExecutionResult(null);
                          }}
                        >
                          Run in Production Mode
                        </Button>
                      )}
                    </div>
                  </div>
                </SectionPanel>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="mx-auto h-16 w-16 text-app-gray-400 mb-4">
                      <Play size={64} strokeWidth={1} />
                    </div>
                    <h3 className="text-lg font-medium text-app-gray-900 mb-2">No Execution Results</h3>
                    <p className="text-app-gray-500 max-w-md">
                      Select an approved incentive plan and execution parameters, then click the Execute button to run the commission calculation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CommissionExecutionEngine;
