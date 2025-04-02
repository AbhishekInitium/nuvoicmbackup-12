
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { Kpi } from '@/types/schemeAdminTypes';

interface KpiListProps {
  kpis: Kpi[];
  setKpis: (kpis: Kpi[]) => void;
}

const KpiList: React.FC<KpiListProps> = ({ kpis, setKpis }) => {
  const addKPI = () => {
    setKpis([...kpis, { name: '', description: '', dataSource: '', calculation: '' }]);
  };

  const updateKPI = (index: number, field: string, value: string) => {
    const updatedKPIs = [...kpis];
    updatedKPIs[index][field] = value;
    setKpis(updatedKPIs);
  };

  const removeKPI = (index: number) => {
    const updatedKPIs = [...kpis];
    updatedKPIs.splice(index, 1);
    setKpis(updatedKPIs);
  };

  return (
    <div className="space-y-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>KPI {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-name`}>Name</Label>
              <Input
                type="text"
                id={`kpi-${index}-name`}
                placeholder="KPI Name"
                value={kpi.name}
                onChange={(e) => updateKPI(index, 'name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-description`}>Description</Label>
              <Textarea
                id={`kpi-${index}-description`}
                placeholder="KPI Description"
                value={kpi.description}
                onChange={(e) => updateKPI(index, 'description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-dataSource`}>Data Source</Label>
              <Input
                type="text"
                id={`kpi-${index}-dataSource`}
                placeholder="Data Source"
                value={kpi.dataSource}
                onChange={(e) => updateKPI(index, 'dataSource', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`kpi-${index}-calculation`}>Calculation</Label>
              <Textarea
                id={`kpi-${index}-calculation`}
                placeholder="Calculation"
                value={kpi.calculation}
                onChange={(e) => updateKPI(index, 'calculation', e.target.value)}
              />
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeKPI(index)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addKPI}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add KPI
      </Button>
    </div>
  );
};

export default KpiList;
