
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, AlertTriangle, Calendar, Truck, Monitor, Shield, Info, FileText, Download } from 'lucide-react';
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
  CommissionExecutionResult,
  getExecutionLog
} from '@/services/incentive/commissionExecutionService';
import { 
  IncentivePlanWithStatus, 
  getIncentivePlans, 
  markPlanAsExecuted 
} from '@/services/incentive/incentivePlanService';
import { Badge } from '@/components/ui/badge';
import { getIncentiveSchemes } from '@/services/database/mongoDBService';

// Type for log entries from the execution log
interface LogEntryDisplay {
  id: string;
  timestamp: string;
  category: string;
  message: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
}

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
  const [executionLogs, setExecutionLogs] = useState<LogEntryDisplay[]>([]);
  const [activeTab, setActiveTab] = useState<string>('results');
  
  useEffect(() => {
    loadApprovedPlans();
  }, []);

  const loadApprovedPlans = async () => {
    setLoadingPlans(true);
    try {
      // Get schemes from MongoDB instead of S/4 HANA
      const plans = await getIncentiveSchemes();
      console.log('Loaded incentive plans from MongoDB:', plans);
      
      if (plans && plans.length > 0) {
        // Transform MongoDB schemes to match IncentivePlanWithStatus structure
        const transformedPlans: IncentivePlanWithStatus[] = plans.map(plan => ({
          ...plan,
          status: plan.metadata?.status || 'DRAFT',
          hasBeenExecuted: false,
          metadata: plan.metadata || {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            status: 'DRAFT'
          }
        }));
        
        setIncentivePlans(transformedPlans);
        
        toast({
          title: "Plans Loaded",
          description: `Successfully loaded ${plans.length} incentive plans.`,
          variant: "default"
        });
      } else {
        console.log('No plans returned, showing error message');
        toast({
          title: "No Plans Found",
          description: "No incentive plans were found in the database.",
          variant: "destructive"
        });
        setIncentivePlans([]);
      }
    } catch (error) {
      console.error('Error loading incentive plans:', error);
      toast({
        title: "Error Loading Plans",
        description: "There was an error loading incentive plans from MongoDB.",
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
      setExecutionLogs([]);
      
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
      
      // Try to get detailed execution logs
      try {
        const log = await getExecutionLog(result.executionId);
        if (log && log.entries) {
          setExecutionLogs(log.entries);
        }
      } catch (logError) {
        console.error('Error loading execution logs:', logError);
      }
      
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
  
  // Function to export execution log as JSON
  const exportExecutionLog = () => {
    if (!executionResult) return;
    
    const logData = {
      execution: executionResult,
      logs: executionLogs,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-log-${executionResult.executionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Function to get the badge color for log levels
  const getLogLevelBadge = (level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG') => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'DEBUG':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                      
                      {executionResult.logSummary && (
                        <div className="mt-3 text-sm">
                          <div className="flex space-x-3">
                            <span>
                              <Badge variant="outline" className="bg-blue-50">
                                {executionResult.logSummary.totalEntries} log entries
                              </Badge>
                            </span>
                            {executionResult.logSummary.errors > 0 && (
                              <span>
                                <Badge variant="destructive">
                                  {executionResult.logSummary.errors} errors
                                </Badge>
                              </span>
                            )}
                            {executionResult.logSummary.warnings > 0 && (
                              <span>
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                  {executionResult.logSummary.warnings} warnings
                                </Badge>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
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
                    
                    <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="logs">Execution Logs</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="results" className="pt-4">
                        <h3 className="font-medium text-lg text-app-gray-800 mb-4">Participant Results</h3>
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
                              
                              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                <div className="text-app-gray-500">Qualified Records</div>
                                <div>{participant.qualifiedRecords}</div>
                                
                                <div className="text-app-gray-500">Disqualified Records</div>
                                <div>{participant.disqualifiedRecords}</div>
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
                      </TabsContent>
                      
                      <TabsContent value="logs" className="pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-lg text-app-gray-800">Execution Logs</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={exportExecutionLog}
                            className="flex items-center"
                          >
                            <Download size={16} className="mr-1" />
                            Export Logs
                          </Button>
                        </div>
                        
                        {executionLogs.length > 0 ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="max-h-96 overflow-y-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Time</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Level</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Category</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {executionLogs.map((log) => (
                                    <tr key={log.id}>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <Badge className={getLogLevelBadge(log.level)}>
                                          {log.level}
                                        </Badge>
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                        {log.category}
                                      </td>
                                      <td className="px-3 py-2 text-xs text-gray-900">
                                        {log.message}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No detailed logs available for this execution</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="reports" className="pt-4">
                        <h3 className="font-medium text-lg text-app-gray-800 mb-4">Commission Reports</h3>
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-4">Download commission reports in different formats</p>
                          
                          <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Button variant="outline" size="sm">
                              <Download size={16} className="mr-1" /> Excel Report
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download size={16} className="mr-1" /> PDF Summary
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download size={16} className="mr-1" /> Full Data (CSV)
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
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
