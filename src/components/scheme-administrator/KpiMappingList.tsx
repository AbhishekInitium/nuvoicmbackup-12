
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KPIFieldMapping } from '@/services/database/kpiMappingService';

interface KpiMappingListProps {
  mappings: KPIFieldMapping[];
  isLoading?: boolean;
}

const KpiMappingList: React.FC<KpiMappingListProps> = ({
  mappings,
  isLoading = false
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading KPI mappings...</div>;
  }

  if (mappings.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">No KPI mappings created yet.</p>
        <p className="text-sm text-gray-400">Create new mappings to make them available for scheme designers.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>KPI Name</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Field/Header</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow key={mapping._id}>
              <TableCell className="font-medium">{mapping.kpiName}</TableCell>
              <TableCell>
                <Badge variant={mapping.sourceType === 'SAP' ? 'default' : 'outline'}>
                  {mapping.sourceType}
                </Badge>
              </TableCell>
              <TableCell>
                {mapping.sourceType === 'SAP' 
                  ? mapping.sourceField 
                  : mapping.sourceFileHeader}
              </TableCell>
              <TableCell>{mapping.dataType}</TableCell>
              <TableCell>
                {mapping.availableToDesigner ? (
                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Inactive
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KpiMappingList;
