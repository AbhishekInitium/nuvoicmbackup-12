
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
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { KPIFieldMapping } from '@/services/database/kpiMappingService';

interface KpiMappingListProps {
  mappings: KPIFieldMapping[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

const KpiMappingList: React.FC<KpiMappingListProps> = ({
  mappings,
  isLoading = false,
  onDelete
}) => {
  // Ensure mappings is always an array
  const mappingsArray = Array.isArray(mappings) ? mappings : [];
  
  if (isLoading) {
    return <div className="text-center py-8">Loading KPI mappings...</div>;
  }

  if (mappingsArray.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">No KPI mappings created yet.</p>
        <p className="text-sm text-gray-400">Create new mappings to make them available for scheme designers.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section</TableHead>
            <TableHead>KPI Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Source Field</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>API</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappingsArray.map((mapping) => (
            <TableRow key={mapping._id}>
              <TableCell className="font-medium">{mapping.section}</TableCell>
              <TableCell>{mapping.kpiName}</TableCell>
              <TableCell className="max-w-[200px] truncate">{mapping.description}</TableCell>
              <TableCell>
                <Badge variant={mapping.sourceType === 'SAP' ? 'default' : mapping.sourceType === 'External' ? 'secondary' : 'outline'}>
                  {mapping.sourceType}
                </Badge>
              </TableCell>
              <TableCell>
                {mapping.sourceType === 'EXCEL' 
                  ? mapping.sourceFileHeader 
                  : mapping.sourceField}
              </TableCell>
              <TableCell>{mapping.dataType}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                <span className="text-xs">{mapping.api || '-'}</span>
              </TableCell>
              <TableCell className="text-right">
                {onDelete && mapping._id && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(mapping._id || '')}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
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
