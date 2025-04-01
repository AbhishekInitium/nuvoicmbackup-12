
import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiField } from '@/types/schemeAdminTypes';
import { Label } from '@/components/ui/label';

interface KpiMappingCardProps {
  kpi: KpiField;
  onUpdate: (kpi: KpiField) => void;
  onRemove: (id: string, category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => void;
}

export const KpiMappingCard: React.FC<KpiMappingCardProps> = ({ kpi, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localKpi, setLocalKpi] = useState<KpiField>({ ...kpi });

  const handleChange = (field: keyof KpiField, value: string) => {
    setLocalKpi(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(localKpi);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalKpi({ ...kpi });
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`kpi-${kpi.id}`} className="mb-2 block text-sm font-medium">
                KPI Name
              </Label>
              <Input
                id={`kpi-${kpi.id}`}
                value={localKpi.kpi}
                onChange={(e) => handleChange('kpi', e.target.value)}
                placeholder="KPI Name"
              />
            </div>
            <div>
              <Label htmlFor={`dataType-${kpi.id}`} className="mb-2 block text-sm font-medium">
                Data Type
              </Label>
              <Input
                id={`dataType-${kpi.id}`}
                value={localKpi.dataType}
                onChange={(e) => handleChange('dataType', e.target.value)}
                placeholder="e.g., Char4, Int8, Date"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`sourceField-${kpi.id}`} className="mb-2 block text-sm font-medium">
                Source Field
              </Label>
              <Input
                id={`sourceField-${kpi.id}`}
                value={localKpi.sourceField}
                onChange={(e) => handleChange('sourceField', e.target.value)}
                placeholder="Source Field"
              />
            </div>
            <div>
              <Label htmlFor={`sourceType-${kpi.id}`} className="mb-2 block text-sm font-medium">
                Source Type
              </Label>
              <Select 
                value={localKpi.sourceType}
                onValueChange={(value: "SAP" | "Excel" | "Custom") => handleChange('sourceType', value)}
              >
                <SelectTrigger id={`sourceType-${kpi.id}`}>
                  <SelectValue placeholder="Source Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAP">SAP</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`description-${kpi.id}`} className="mb-2 block text-sm font-medium">
              Description
            </Label>
            <Input
              id={`description-${kpi.id}`}
              value={localKpi.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description"
            />
          </div>

          {localKpi.sourceType === "SAP" && (
            <div>
              <Label htmlFor={`api-${kpi.id}`} className="mb-2 block text-sm font-medium">
                API Endpoint
              </Label>
              <Input
                id={`api-${kpi.id}`}
                value={localKpi.api || ''}
                onChange={(e) => handleChange('api', e.target.value)}
                placeholder="e.g., api_salesarea/srvd_a2x/sap/salesarea/0001"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              type="button"
            >
              <X size={16} className="mr-1" /> Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              type="button"
            >
              <Check size={16} className="mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-medium">{kpi.kpi || "Unnamed KPI"}</h4>
              <p className="text-sm text-gray-500 mt-1">{kpi.description || "No description"}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => onRemove(kpi.id, kpi.category)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Source Field</p>
              <p className="text-sm">{kpi.sourceField || "Not specified"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Data Type</p>
              <p className="text-sm">{kpi.dataType || "Not specified"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Source Type</p>
              <p className="text-sm">{kpi.sourceType || "Not specified"}</p>
            </div>
            {kpi.api && (
              <div>
                <p className="text-xs font-medium text-gray-500">API</p>
                <p className="text-sm truncate" title={kpi.api}>{kpi.api}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
