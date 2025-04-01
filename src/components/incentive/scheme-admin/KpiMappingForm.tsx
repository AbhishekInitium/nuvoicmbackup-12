
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import KpiMappingCard from './KpiMappingCard';
import JsonPreview from './JsonPreview';
import { saveSchemeAdmin } from '@/services/database/mongoDBService';

interface KpiMappingFormProps {
  calculationBase: string;
  schemeId: string;
  adminName: string;
  onClose: () => void;
}

// Define the initial KPI mapping structure
const KPI_SECTIONS = {
  BASE_DATA: 'baseData',
  QUALIFICATION_CRITERIA: 'qualificationFields',
  ADJUSTMENT_CRITERIA: 'adjustmentFields',
  EXCLUSION_CRITERIA: 'exclusionFields',
  CUSTOM_RULES: 'customRules'
};

const KpiMappingForm: React.FC<KpiMappingFormProps> = ({ 
  calculationBase,
  schemeId,
  adminName: initialAdminName,
  onClose 
}) => {
  const { toast } = useToast();
  const [adminName, setAdminName] = useState<string>(initialAdminName);
  const [baseField, setBaseField] = useState<string>('');
  
  const [kpiData, setKpiData] = useState({
    [KPI_SECTIONS.BASE_DATA]: [],
    [KPI_SECTIONS.QUALIFICATION_CRITERIA]: [],
    [KPI_SECTIONS.ADJUSTMENT_CRITERIA]: [],
    [KPI_SECTIONS.EXCLUSION_CRITERIA]: [],
    [KPI_SECTIONS.CUSTOM_RULES]: []
  });

  const handleUpdateKpiSection = (section: string, data: any[]) => {
    setKpiData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSave = async () => {
    if (!adminName.trim()) {
      toast({
        title: "Validation Error",
        description: "Admin Name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!baseField.trim()) {
      toast({
        title: "Validation Error",
        description: "Base Field is required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare data for saving
      const adminConfig = {
        adminId: uuidv4(),
        adminName: adminName.trim(),
        calculationBase,
        baseField: baseField.trim(),
        ...kpiData,
        createdAt: new Date().toISOString()
      };

      // Save to MongoDB
      await saveSchemeAdmin(adminConfig);
      
      toast({
        title: "Success",
        description: "Scheme administrative configuration saved successfully",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving scheme admin config:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <Label htmlFor="adminName">Admin Name (Unique Identifier)</Label>
            <Input
              id="adminName"
              value={adminName}
              onChange={e => setAdminName(e.target.value)}
              placeholder="e.g. NorthAmerica_Orders_2024"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be unique across all scheme configurations
            </p>
          </div>

          <div className="mb-6">
            <Label htmlFor="baseField">Base Field (Primary Aggregation Field)</Label>
            <Input
              id="baseField"
              value={baseField}
              onChange={e => setBaseField(e.target.value)}
              placeholder="e.g. SoAmount"
            />
            <p className="text-xs text-gray-500 mt-1">
              The primary field used for calculations (e.g., SoAmount, InvoiceValue)
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Configuration Summary</h3>
          <div className="text-sm">
            <p><span className="font-medium">Calculation Base:</span> {calculationBase}</p>
            <p><span className="font-medium">Scheme ID:</span> {schemeId}</p>
            <p><span className="font-medium">Admin Name:</span> {adminName}</p>
            <p><span className="font-medium">Base Field:</span> {baseField || "-"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Base Data Section */}
        <KpiMappingCard
          title="BASE DATA"
          description="Fields available for aggregation"
          section={KPI_SECTIONS.BASE_DATA}
          data={kpiData[KPI_SECTIONS.BASE_DATA]}
          updateData={(data) => handleUpdateKpiSection(KPI_SECTIONS.BASE_DATA, data)}
        />
        
        {/* Qualification Criteria Section */}
        <KpiMappingCard
          title="QUALIFICATION CRITERIA"
          description="Fields used to qualify transactions"
          section={KPI_SECTIONS.QUALIFICATION_CRITERIA}
          data={kpiData[KPI_SECTIONS.QUALIFICATION_CRITERIA]}
          updateData={(data) => handleUpdateKpiSection(KPI_SECTIONS.QUALIFICATION_CRITERIA, data)}
        />
        
        {/* Adjustment Criteria Section */}
        <KpiMappingCard
          title="ADJUSTMENT CRITERIA"
          description="Fields used for payout modification"
          section={KPI_SECTIONS.ADJUSTMENT_CRITERIA}
          data={kpiData[KPI_SECTIONS.ADJUSTMENT_CRITERIA]}
          updateData={(data) => handleUpdateKpiSection(KPI_SECTIONS.ADJUSTMENT_CRITERIA, data)}
        />
        
        {/* Exclusion Criteria Section */}
        <KpiMappingCard
          title="EXCLUSION CRITERIA"
          description="Fields used to exclude records"
          section={KPI_SECTIONS.EXCLUSION_CRITERIA}
          data={kpiData[KPI_SECTIONS.EXCLUSION_CRITERIA]}
          updateData={(data) => handleUpdateKpiSection(KPI_SECTIONS.EXCLUSION_CRITERIA, data)}
        />
        
        {/* Custom Rules Section */}
        <KpiMappingCard
          title="CUSTOM RULES"
          description="Optional logic rules"
          section={KPI_SECTIONS.CUSTOM_RULES}
          data={kpiData[KPI_SECTIONS.CUSTOM_RULES]}
          updateData={(data) => handleUpdateKpiSection(KPI_SECTIONS.CUSTOM_RULES, data)}
        />
      </div>

      {/* JSON Preview */}
      <JsonPreview 
        data={{
          adminId: uuidv4(),
          adminName,
          calculationBase,
          baseField,
          ...kpiData,
          createdAt: new Date().toISOString()
        }} 
      />
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    </div>
  );
};

export default KpiMappingForm;
