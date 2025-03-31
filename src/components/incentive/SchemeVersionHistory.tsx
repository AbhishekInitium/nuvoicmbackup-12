
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IncentivePlan } from '@/types/incentiveTypes';
import { getSchemeVersions } from '@/services/database/mongoDBService';
import { Badge } from "@/components/ui/badge";

interface SchemeVersionHistoryProps {
  schemeId: string;
  onBack: () => void;
  onEditVersion: (version: IncentivePlan) => void;
}

const SchemeVersionHistory: React.FC<SchemeVersionHistoryProps> = ({
  schemeId,
  onBack,
  onEditVersion
}) => {
  const [versions, setVersions] = useState<IncentivePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schemeId) {
      loadVersionHistory();
    }
  }, [schemeId]);

  const loadVersionHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const versionHistory = await getSchemeVersions(schemeId);
      setVersions(versionHistory);
    } catch (err) {
      console.error('Error loading scheme versions:', err);
      setError('Failed to load version history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status: string | undefined) => {
    const statusUpper = status?.toUpperCase() || '';
    switch (statusUpper) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-amber-100 text-amber-800';
      case 'SIMULATION':
        return 'bg-blue-100 text-blue-800';
      case 'PRODUCTION':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-16">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="text-app-gray-600">Loading version history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-4 py-8">
        <Button variant="ghost" onClick={onBack} className="w-fit">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="p-6 bg-amber-50 text-amber-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-6 w-6" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="w-fit">
          <ArrowLeft size={16} className="mr-2" />
          Back to Scheme
        </Button>
        <h2 className="text-xl font-semibold">Version History</h2>
      </div>

      {versions.length === 0 ? (
        <div className="p-6 bg-app-gray-50 rounded-lg text-center text-app-gray-600">
          No version history available for this scheme.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">V{version.metadata?.version || 1}</TableCell>
                  <TableCell>{formatDate(version.metadata?.updatedAt)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getStatusBadgeClass(version.metadata?.status)}
                    >
                      {version.metadata?.status || 'DRAFT'}
                    </Badge>
                  </TableCell>
                  <TableCell>System</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditVersion(version)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="text-sm text-app-gray-600 bg-blue-50 p-4 rounded-md">
        <p>When you edit and save a version, a new version will be automatically created.</p>
      </div>
    </div>
  );
};

export default SchemeVersionHistory;
