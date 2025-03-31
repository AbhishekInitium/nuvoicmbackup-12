
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { KPIFieldMapping, KPI_SECTIONS } from '@/services/database/kpiMappingService';

interface KpiMappingFormProps {
  onSubmit: (kpiMapping: KPIFieldMapping) => void;
  initialData?: KPIFieldMapping | null;
  isSaving?: boolean;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

const defaultKpiMapping: KPIFieldMapping = {
  section: 'BASE_DATA',
  kpiName: '',
  description: '',
  sourceType: 'System',
  sourceField: '',
  sourceFileHeader: '',
  dataType: 'string',
  api: '',
  availableToDesigner: true
};

const KpiMappingForm: React.FC<KpiMappingFormProps> = ({
  onSubmit,
  initialData = null,
  isSaving = false,
  onCancel,
  mode = 'create'
}) => {
  const [kpiMapping, setKpiMapping] = useState<KPIFieldMapping>(
    initialData ? { ...initialData } : { ...defaultKpiMapping }
  );

  useEffect(() => {
    // Update form data when initialData changes (for edit mode)
    if (initialData) {
      setKpiMapping({ ...initialData });
    } else {
      setKpiMapping({ ...defaultKpiMapping });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(kpiMapping);
    
    // Only reset the form in create mode
    if (mode === 'create' && !initialData) {
      setKpiMapping({ ...defaultKpiMapping });
    }
  };

  const handleChange = (field: keyof KPIFieldMapping, value: any) => {
    setKpiMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="section">Section</Label>
          <Select
            value={kpiMapping.section}
            onValueChange={(value) => handleChange('section', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {KPI_SECTIONS.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="kpiName">KPI Name</Label>
          <Input
            id="kpiName"
            value={kpiMapping.kpiName}
            onChange={(e) => handleChange('kpiName', e.target.value)}
            placeholder="Enter KPI name"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This name will be shown to scheme designers
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={kpiMapping.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter KPI description"
          />
        </div>

        <div>
          <Label htmlFor="sourceType">Source Type</Label>
          <Select
            value={kpiMapping.sourceType}
            onValueChange={(value) => handleChange('sourceType', value as 'System' | 'External')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="External">External</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sourceField">Source Field</Label>
          <Input
            id="sourceField"
            value={kpiMapping.sourceField}
            onChange={(e) => handleChange('sourceField', e.target.value)}
            placeholder="Enter source field name (e.g. Amount, SalesRep)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            e.g. Amount, SalesOrganization, SalesRep, VBRP-NETWR
          </p>
        </div>

        <div>
          <Label htmlFor="dataType">Data Type</Label>
          <Select
            value={kpiMapping.dataType}
            onValueChange={(value) => handleChange('dataType', value as 'string' | 'number' | 'date' | 'boolean' | 'Char4' | '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="Char4">Char4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {kpiMapping.sourceType === 'System' && (
          <div>
            <Label htmlFor="api">API Endpoint</Label>
            <Input
              id="api"
              value={kpiMapping.api || ''}
              onChange={(e) => handleChange('api', e.target.value)}
              placeholder="Enter API endpoint (e.g. API_SALES_ORDER_SRV//A_SalesOrder)"
            />
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="availableToDesigner"
            checked={kpiMapping.availableToDesigner}
            onCheckedChange={(checked) => handleChange('availableToDesigner', checked)}
          />
          <Label htmlFor="availableToDesigner">Available to scheme designers</Label>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : mode === 'create' ? 'Save KPI Mapping' : 'Update KPI Mapping'}
        </Button>
        
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default KpiMappingForm;
