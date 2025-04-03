
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { Loader2, LockIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RevenueBaseSelectorProps {
  revenueBase: string;
  updateRevenueBase: (value: string) => void;
  schemeConfigs?: SchemeAdminConfig[];
  onSchemeSelect?: (schemeId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  isLocked?: boolean;
  selectedConfig?: SchemeAdminConfig | null;
}

const RevenueBaseSelector: React.FC<RevenueBaseSelectorProps> = ({ 
  revenueBase, 
  updateRevenueBase,
  schemeConfigs = [],
  onSchemeSelect,
  isLoading = false,
  disabled = false,
  isLocked = false,
  selectedConfig = null
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-app-gray-700 mb-2">Revenue Base</label>
        
        {/* Scheme Configuration Selector */}
        {!isLocked && (
          <div className="mb-4">
            <label className="text-sm text-app-gray-500 mb-2 block">
              Select from saved scheme configurations:
            </label>
            <Select 
              onValueChange={(schemeId) => onSchemeSelect && onSchemeSelect(schemeId)}
              disabled={isLoading || disabled}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Choose a scheme configuration" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> 
                    Loading configurations...
                  </div>
                ) : schemeConfigs.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-app-gray-500">
                    No scheme configurations available
                  </div>
                ) : (
                  schemeConfigs.map((config) => (
                    <SelectItem key={config._id} value={config._id || ''}>
                      {config.adminName} - {config.calculationBase}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Current Revenue Base Display */}
        <div>
          <label className="text-sm text-app-gray-500 mb-2 flex items-center">
            Selected calculation base:
            {isLocked && (
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                <LockIcon size={12} className="mr-1" /> Locked
              </Badge>
            )}
          </label>
          <div className="px-4 py-2 border rounded bg-app-gray-50 text-app-gray-700">
            {selectedConfig ? (
              <span>
                {selectedConfig.adminName} - {selectedConfig.calculationBase}
              </span>
            ) : (
              revenueBase || "None selected"
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-app-gray-500 mt-2">
        Data for calculations will be sourced from the selected system
      </p>
    </div>
  );
};

export default RevenueBaseSelector;
