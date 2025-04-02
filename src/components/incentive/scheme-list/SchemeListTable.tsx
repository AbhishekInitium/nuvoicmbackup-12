
import React from 'react';
import { Copy, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SchemeStatusBadge from './SchemeStatusBadge';
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';

interface SchemeListTableProps {
  schemes: IncentivePlanWithStatus[];
  editMode?: boolean;
  onSelectScheme: (scheme: IncentivePlanWithStatus) => void;
}

const SchemeListTable: React.FC<SchemeListTableProps> = ({ 
  schemes, 
  editMode = false, 
  onSelectScheme 
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schemes.map((scheme, index) => (
            <TableRow key={index} className="hover:bg-app-gray-50">
              <TableCell className="font-medium">{scheme.name}</TableCell>
              <TableCell>{formatDate(scheme.metadata?.updatedAt || scheme.metadata?.createdAt)}</TableCell>
              <TableCell>
                <SchemeStatusBadge status={scheme.metadata?.status} />
              </TableCell>
              <TableCell>{scheme.metadata?.version || 1}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onSelectScheme(scheme)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                  >
                    {editMode ? (
                      <>
                        <Edit size={14} />
                        Edit
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SchemeListTable;
