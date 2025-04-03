
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Exclusion } from '@/types/incentiveTypes';
import GlassCard from '../ui-custom/GlassCard';
import { OPERATORS } from '@/constants/incentiveConstants';
import { KpiField } from '@/types/schemeAdminTypes';

interface ExclusionFormProps {
  exclusion: Exclusion;
  exclusionIndex: number;
  dbFields: string[];
  kpiMetadata?: Record<string, KpiField>;
  onUpdateExclusion: (index: number, field: keyof Exclusion, value: string | number) => void;
  onRemoveExclusion: (index: number) => void;
  isReadOnly?: boolean;
}

const ExclusionForm: React.FC<ExclusionFormProps> = ({
  exclusion,
  exclusionIndex,
  dbFields,
  kpiMetadata,
  onUpdateExclusion,
  onRemoveExclusion,
  isReadOnly = false
}) => {
  // Determine input type based on field data type
  const getInputType = (): string => {
    if (exclusion.field && kpiMetadata && kpiMetadata[exclusion.field]) {
      const dataType = kpiMetadata[exclusion.field].dataType;
      
      switch(dataType?.toLowerCase()) {
        case 'number':
        case 'decimal':
        case 'integer':
        case 'int8':
          return 'number';
        case 'date':
          return 'date';
        case 'boolean':
          return 'checkbox';
        case 'char1':
        case 'char2':
        case 'char3':
        case 'char4':
        case 'char':
        case 'char10':
        case 'string':
        default:
          return 'text';
      }
    }
    
    return 'text';
  };

  const inputType = getInputType();

  return (
    <GlassCard className="p-4">
      <div className="flex justify-between items-start mb-4">
        <Input 
          type="text" 
          value={exclusion.description}
          onChange={(e) => onUpdateExclusion(exclusionIndex, 'description', e.target.value)}
          className="text-lg font-medium border-none px-0 h-auto focus-visible:ring-0"
          placeholder="Exclusion Description"
          disabled={isReadOnly}
        />
        {!isReadOnly && (
          <button 
            className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200"
            onClick={() => onRemoveExclusion(exclusionIndex)}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {exclusion.field}
            </div>
          ) : (
            <Select 
              value={exclusion.field}
              onValueChange={(value) => onUpdateExclusion(exclusionIndex, 'field', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {dbFields.map(field => {
                  // Get the display name from metadata if available
                  const displayName = kpiMetadata && kpiMetadata[field] 
                    ? kpiMetadata[field].description || field 
                    : field;
                  return (
                    <SelectItem key={field} value={field}>{displayName}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {exclusion.operator}
            </div>
          ) : (
            <Select 
              value={exclusion.operator}
              onValueChange={(value) => onUpdateExclusion(exclusionIndex, 'operator', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map(op => (
                  <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
          {isReadOnly ? (
            <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
              {exclusion.value}
            </div>
          ) : (
            <Input 
              type={inputType}
              value={exclusion.value}
              onChange={(e) => {
                const value = e.target.value;
                
                // Only try to parse as number if input type is number
                if (inputType === 'number') {
                  const numValue = parseFloat(value);
                  onUpdateExclusion(exclusionIndex, 'value', isNaN(numValue) ? value : numValue);
                } else {
                  onUpdateExclusion(exclusionIndex, 'value', value);
                }
              }}
              step={inputType === 'number' ? "0.01" : undefined}
              disabled={isReadOnly}
            />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default ExclusionForm;
