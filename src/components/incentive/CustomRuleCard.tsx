
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import { CustomRule } from '@/types/incentiveTypes';
import RuleCondition from './RuleCondition';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

interface CustomRuleCardProps {
  rule: CustomRule;
  availableFields: string[];
  currency: string;
  onUpdate: (field: keyof CustomRule, value: any) => void;
  onRemove: () => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const CustomRuleCard: React.FC<CustomRuleCardProps> = ({
  rule,
  availableFields,
  currency,
  onUpdate,
  onRemove,
  selectedScheme,
  kpiMetadata
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localName, setLocalName] = React.useState(rule.name || '');
  
  const handleSave = () => {
    onUpdate('name', localName);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setLocalName(rule.name || '');
    setIsEditing(false);
  };
  
  // Get currency symbol from currency code
  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode.toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return currencyCode;
    }
  };
  
  const currencySymbol = getCurrencySymbol(currency);
  
  // Handle condition update
  const handleConditionUpdate = (field: string, value: string | number) => {
    const updatedCondition = { ...rule.condition, [field]: value };
    onUpdate('condition', updatedCondition);
    
    // If this is a field update and we have metadata, also update description and other metadata
    if (field === 'field' && kpiMetadata && kpiMetadata[value as string]) {
      const metadata = kpiMetadata[value as string];
      
      if (metadata.description && !rule.name) {
        // Only update name if it's empty (or auto-generate a name based on description)
        setLocalName(metadata.description);
        onUpdate('name', metadata.description);
      }
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <div className="w-full">
              <Input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Custom Rule Name"
                className="mb-2"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSave} className="h-8">
                  <Save size={16} className="mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                  <X size={16} className="mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-lg font-medium">{rule.name || 'Unnamed Rule'}</h4>
                {rule.description && <p className="text-sm text-gray-500 mt-1">{rule.description}</p>}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onRemove}
                  className="h-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Rule Condition:</p>
          <RuleCondition
            condition={rule.condition}
            availableFields={availableFields}
            currencySymbol={currencySymbol}
            onUpdate={handleConditionUpdate}
            onRemove={onRemove}
            selectedScheme={selectedScheme}
            kpiMetadata={kpiMetadata}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomRuleCard;
