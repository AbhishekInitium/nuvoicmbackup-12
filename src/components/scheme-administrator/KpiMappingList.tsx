
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
import { Trash2, Edit, Eye, Clipboard } from 'lucide-react';
import { KPIFieldMapping } from '@/services/database/types/kpiTypes';
import { SECTION_DISPLAY_MAP } from '@/services/database/types/kpiTypes';

interface KpiMappingListProps {
  mappings: KPIFieldMapping[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (kpi: KPIFieldMapping) => void;
  onView?: (kpi: KPIFieldMapping) => void;
  isUsingInMemoryStorage?: boolean;
}

const KpiMappingList: React.FC<KpiMappingListProps> = ({
  mappings,
  isLoading = false,
  onDelete,
  onEdit,
  onView,
  isUsingInMemoryStorage = false
}) => {
  // Ensure mappings is always an array
  const mappingsArray = Array.isArray(mappings) ? mappings : [];
  
  // Group mappings by section for better organization
  const groupedMappings = mappingsArray.reduce((acc, mapping) => {
    if (!acc[mapping.section]) {
      acc[mapping.section] = [];
    }
    acc[mapping.section].push(mapping);
    return acc;
  }, {} as Record<string, KPIFieldMapping[]>);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading KPI mappings...</span>
      </div>
    );
  }

  if (mappingsArray.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-md border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">No KPI mappings created yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Create new mappings to make them available for scheme designers.
        </p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(groupedMappings).map(([section, sectionMappings]) => (
        <div key={section} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">
            {SECTION_DISPLAY_MAP[section as keyof typeof SECTION_DISPLAY_MAP] || section}
          </h3>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-medium">KPI Name</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium">Source</TableHead>
                  <TableHead className="font-medium">Source Field</TableHead>
                  <TableHead className="font-medium">Data Type</TableHead>
                  <TableHead className="font-medium">API</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionMappings.map((mapping) => (
                  <TableRow key={mapping._id || `kpi-${Math.random()}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{mapping.kpiName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <span title={mapping.description}>{mapping.description}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          mapping.sourceType === 'System' ? 'default' : 
                          mapping.sourceType === 'SAP' ? 'secondary' : 'outline'
                        }
                      >
                        {mapping.sourceType}
                      </Badge>
                    </TableCell>
                    <TableCell>{mapping.sourceField}</TableCell>
                    <TableCell>{mapping.dataType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <span className="text-xs" title={mapping.api || '-'}>{mapping.api || '-'}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {onEdit && mapping._id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit(mapping)}
                            className="h-8 w-8 p-0"
                            title="Edit KPI mapping"
                          >
                            <Edit size={16} className="text-blue-500" />
                          </Button>
                        )}
                        {onDelete && mapping._id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onDelete(mapping._id || '')}
                            className="h-8 w-8 p-0"
                            title="Delete KPI mapping"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiMappingList;
