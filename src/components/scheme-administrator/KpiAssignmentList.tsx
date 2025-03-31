
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { KPIFieldMapping } from '@/services/database/kpiMappingService';

interface KpiAssignmentListProps {
  availableKpis: KPIFieldMapping[];
  selectedKpis: string[];
  onAssign: (kpis: string[]) => void;
  isLoading?: boolean;
  isAssigning?: boolean;
}

const KpiAssignmentList: React.FC<KpiAssignmentListProps> = ({
  availableKpis,
  selectedKpis,
  onAssign,
  isLoading = false,
  isAssigning = false
}) => {
  const [checkedKpis, setCheckedKpis] = useState<string[]>(selectedKpis);

  const handleToggle = (kpiName: string) => {
    setCheckedKpis(prev => 
      prev.includes(kpiName)
        ? prev.filter(name => name !== kpiName)
        : [...prev, kpiName]
    );
  };

  const handleSave = () => {
    onAssign(checkedKpis);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading available KPIs...</div>;
  }

  if (availableKpis.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">No KPIs available.</p>
        <p className="text-sm text-gray-400">Create KPI mappings first to assign them to this scheme.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>KPI Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Data Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableKpis.map((kpi) => (
              <TableRow key={kpi._id}>
                <TableCell>
                  <Checkbox
                    checked={checkedKpis.includes(kpi.kpiName)}
                    onCheckedChange={() => handleToggle(kpi.kpiName)}
                  />
                </TableCell>
                <TableCell className="font-medium">{kpi.kpiName}</TableCell>
                <TableCell>{kpi.sourceType}</TableCell>
                <TableCell>{kpi.dataType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isAssigning}
        >
          {isAssigning ? 'Saving...' : 'Save KPI Assignment'}
        </Button>
      </div>
    </div>
  );
};

export default KpiAssignmentList;
