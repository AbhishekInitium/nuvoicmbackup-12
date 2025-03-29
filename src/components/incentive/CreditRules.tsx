
import React from 'react';
import { PlusCircle, Trash2, Percent } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { CreditLevel } from '@/types/incentiveTypes';
import EmptyRulesState from './EmptyRulesState';

interface CreditRulesProps {
  levels: CreditLevel[];
  updateCreditRules: (levels: CreditLevel[]) => void;
}

const CreditRules: React.FC<CreditRulesProps> = ({ levels, updateCreditRules }) => {
  const { toast } = useToast();

  const addCreditLevel = () => {
    const newLevels = [...levels];
    
    newLevels.push({
      name: `New Level ${newLevels.length + 1}`,
      percentage: 0
    });
    
    updateCreditRules(newLevels);
  };

  const removeCreditLevel = (index: number) => {
    const newLevels = [...levels];
    newLevels.splice(index, 1);
    
    updateCreditRules(newLevels);
  };

  const updateCreditLevel = (index: number, field: keyof CreditLevel, value: string | number) => {
    const newLevels = [...levels];
    
    if (field === 'percentage') {
      // Parse the new value as a number
      const percentage = parseInt(value as string);
      newLevels[index].percentage = percentage;
      
      // Calculate the sum of all percentages
      const sum = newLevels.reduce((acc, level) => acc + level.percentage, 0);
      
      // If sum is not 100%, show warning
      if (sum !== 100) {
        toast({
          title: "Warning",
          description: `Total percentage is ${sum}%. It should equal 100%.`,
          variant: "default"
        });
      }
    } else {
      // Update other fields directly
      newLevels[index][field] = value as string;
    }
    
    updateCreditRules(newLevels);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-app-gray-700">Credit Level Distribution</label>
          <ActionButton 
            variant="outline"
            size="sm"
            onClick={addCreditLevel}
          >
            <PlusCircle size={16} className="mr-1" /> Add Level
          </ActionButton>
        </div>
        
        {levels.length === 0 ? (
          <EmptyRulesState
            message="No credit levels defined"
            description="Add credit levels to define how commission is distributed"
            buttonText="Add Credit Level"
            onAction={addCreditLevel}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-app-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-app-gray-200">
                <thead>
                  <tr className="bg-app-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Level Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Percentage (%)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-app-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-app-gray-200">
                  {levels.map((level, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-gray-50 bg-opacity-30'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input 
                          type="text" 
                          value={level.name}
                          onChange={(e) => updateCreditLevel(index, 'name', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="form-input pl-8 py-2"
                            value={level.percentage}
                            onChange={(e) => updateCreditLevel(index, 'percentage', e.target.value)}
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Percent size={16} className="text-app-gray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          className="text-app-red hover:text-opacity-80 transition-colors duration-200"
                          onClick={() => removeCreditLevel(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {levels.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-app-gray-500">
              Total credit distribution should equal 100%
            </p>
            <div className="flex items-center">
              <div className={`px-3 py-1 rounded-full ${
                levels.reduce((acc, level) => acc + level.percentage, 0) === 100
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Total: {levels.reduce((acc, level) => acc + level.percentage, 0)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditRules;
