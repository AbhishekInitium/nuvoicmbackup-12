
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { Badge } from '../ui/badge';

interface SchemeTableProps {
  schemes: IncentivePlanWithStatus[];
  onViewDetails: (scheme: IncentivePlanWithStatus) => void;
  onCreateNew: () => void;
  isLoading: boolean;
  onRefresh?: () => void;
}

const SchemeTable: React.FC<SchemeTableProps> = ({
  schemes,
  onViewDetails,
  onCreateNew,
  isLoading,
  onRefresh
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DRAFT': return 'outline';
      case 'APPROVED': return 'secondary';
      case 'SIMULATED': return 'default';
      case 'PRODUCTION': case 'PRODRUN': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Incentive Schemes</h2>
        <div className="flex space-x-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
              <RefreshCw size={16} /> Refresh
            </Button>
          )}
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus size={16} /> Create New Scheme
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No schemes found. Create your first scheme.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Effective From</TableHead>
                <TableHead>Effective To</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((scheme) => (
                <TableRow 
                  key={scheme._id}
                  className={`cursor-pointer ${selectedSchemeId === scheme._id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedSchemeId(scheme._id)}
                >
                  <TableCell className="font-medium">{scheme.name}</TableCell>
                  <TableCell>{formatDate(scheme.effectiveStart)}</TableCell>
                  <TableCell>{formatDate(scheme.effectiveEnd)}</TableCell>
                  <TableCell className="max-w-xs truncate">{scheme.description}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(scheme.metadata?.status || 'DRAFT')}>
                      {scheme.metadata?.status || 'DRAFT'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(scheme);
                      }}
                    >
                      {scheme.metadata?.status === 'DRAFT' ? (
                        <Edit className="h-4 w-4 mr-2" />
                      ) : (
                        <Eye className="h-4 w-4 mr-2" />
                      )}
                      {scheme.metadata?.status === 'DRAFT' ? 'Edit' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SchemeTable;
