
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculationBase } from '@/services/database/types/kpiTypes';

interface SchemeHeaderProps {
  calculationBase: CalculationBase;
  onChange: (values: Partial<CalculationBase>) => void;
}

const SchemeHeader: React.FC<SchemeHeaderProps> = ({ calculationBase, onChange }) => {
  return (
    <Card className="mb-6 bg-gray-50">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Scheme Administrator Name</Label>
            <Input
              id="adminName"
              value={calculationBase.adminName}
              onChange={(e) => onChange({ adminName: e.target.value })}
              placeholder="e.g., NorthAmerica_Orders_2024"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminId">Administrator ID</Label>
            <Input
              id="adminId"
              value={calculationBase.adminId}
              onChange={(e) => onChange({ adminId: e.target.value })}
              placeholder="Unique identifier"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calculationBase">Calculation Base</Label>
            <Input
              id="calculationBase"
              value={calculationBase.calculationBase}
              onChange={(e) => onChange({ calculationBase: e.target.value })}
              placeholder="e.g., Sales Orders"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="baseField">Base Field</Label>
            <Input
              id="baseField"
              value={calculationBase.baseField || ''}
              onChange={(e) => onChange({ baseField: e.target.value })}
              placeholder="e.g., SoAmount"
              className="bg-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemeHeader;
