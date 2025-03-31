
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { KPIFieldMapping, KPI_SECTIONS } from '@/services/database/kpiMappingService';

interface KpiMappingFormProps {
  onSubmit: (kpiMapping: KPIFieldMapping) => void;
  fileHeaders?: string[];
  isSaving?: boolean;
}

const KpiMappingForm: React.FC<KpiMappingFormProps> = ({
  onSubmit,
  fileHeaders = [],
  isSaving = false
}) => {
  const [kpiMapping, setKpiMapping] = useState<KPIFieldMapping>({
    section: 'BASE_DATA',
    kpiName: '',
    description: '',
    sourceType: 'SAP',
    sourceField: '',
    sourceFileHeader: '',
    dataType: 'string',
    api: '',
    availableToDesigner: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(kpiMapping);
    // Reset form
    setKpiMapping({
      section: 'BASE_DATA',
      kpiName: '',
      description: '',
      sourceType: 'SAP',
      sourceField: '',
      sourceFileHeader: '',
      dataType: 'string',
      api: '',
      availableToDesigner: true
    });
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
            onValueChange={(value) => handleChange('sourceType', value as 'SAP' | 'EXCEL' | 'External')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SAP">SAP</SelectItem>
              <SelectItem value="EXCEL">Excel</SelectItem>
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

        {kpiMapping.sourceType === 'EXCEL' && (
          <div>
            <Label htmlFor="sourceFileHeader">Excel Column Header</Label>
            {fileHeaders.length > 0 ? (
              <Select
                value={kpiMapping.sourceFileHeader}
                onValueChange={(value) => handleChange('sourceFileHeader', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Excel column" />
                </SelectTrigger>
                <SelectContent>
                  {fileHeaders.map((header, index) => (
                    <SelectItem key={index} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="sourceFileHeader"
                value={kpiMapping.sourceFileHeader || ''}
                onChange={(e) => handleChange('sourceFileHeader', e.target.value)}
                placeholder="Enter Excel column header"
              />
            )}
          </div>
        )}

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

        <div>
          <Label htmlFor="api">API Endpoint</Label>
          <Input
            id="api"
            value={kpiMapping.api || ''}
            onChange={(e) => handleChange('api', e.target.value)}
            placeholder="Enter API endpoint (e.g. API_SALES_ORDER_SRV//A_SalesOrder)"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="availableToDesigner"
            checked={kpiMapping.availableToDesigner}
            onCheckedChange={(checked) => handleChange('availableToDesigner', checked)}
          />
          <Label htmlFor="availableToDesigner">Available to scheme designers</Label>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save KPI Mapping'}
      </Button>
    </form>
  );
};

export default KpiMappingForm;
