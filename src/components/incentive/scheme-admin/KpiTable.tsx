
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiField } from '@/types/schemeAdminTypes';

interface KpiTableProps {
  kpis?: KpiField[];
}

export const KpiTable: React.FC<KpiTableProps> = ({ kpis = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sample KPI data for demonstration
  const sampleKpis: KpiField[] = [
    {
      id: "1",
      kpi: "SalesOrg",
      description: "Organization",
      dataType: "Char4",
      sourceField: "SalesOrganization",
      sourceType: "SAP",
      api: "api_salesarea/srvd_a2x/sap/salesarea/0001",
      category: "qualification"
    },
    {
      id: "2",
      kpi: "CustomerType",
      description: "Type of customer (Enterprise, SMB, etc.)",
      dataType: "Char2",
      sourceField: "customerSegment",
      sourceType: "Excel",
      category: "adjustment"
    },
    {
      id: "3",
      kpi: "ReturnRate",
      description: "Percentage of products returned",
      dataType: "Dec2.2",
      sourceField: "returnRate",
      sourceType: "SAP",
      api: "api_sales/srvd_a2x/sap/returns/0001",
      category: "exclusion"
    },
    {
      id: "4",
      kpi: "SalesDate",
      description: "Date when the sale occurred",
      dataType: "Date",
      sourceField: "salesDate",
      sourceType: "Excel",
      category: "qualification"
    },
    {
      id: "5",
      kpi: "SpecialDiscount",
      description: "Special discount applied to sales",
      dataType: "Dec3.2",
      sourceField: "discount",
      sourceType: "Custom",
      category: "custom"
    }
  ];

  // Combine provided KPIs with sample KPIs
  const displayKpis = kpis.length > 0 ? kpis : sampleKpis;
  
  // Filter KPIs based on search query and category filter
  const filteredKpis = displayKpis.filter(kpi => {
    const matchesSearch = 
      kpi.kpi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kpi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kpi.sourceField.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || kpi.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'qualification':
        return 'bg-blue-100 text-blue-800';
      case 'adjustment':
        return 'bg-green-100 text-green-800';
      case 'exclusion':
        return 'bg-red-100 text-red-800';
      case 'custom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search KPIs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="qualification">Qualification</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
              <SelectItem value="exclusion">Exclusion</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">KPI Name</TableHead>
              <TableHead>Source Field</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Source Type</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKpis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No KPIs found. Create new KPIs from the KPI Mapping tab.
                </TableCell>
              </TableRow>
            ) : (
              filteredKpis.map((kpi) => (
                <TableRow key={kpi.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{kpi.kpi}</div>
                      <div className="text-xs text-gray-500">{kpi.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Tag className="h-3.5 w-3.5 text-gray-500 mr-1" />
                      {kpi.sourceField}
                    </div>
                  </TableCell>
                  <TableCell>{kpi.dataType}</TableCell>
                  <TableCell>{kpi.sourceType}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(kpi.category)}>
                      {kpi.category.charAt(0).toUpperCase() + kpi.category.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          Showing {filteredKpis.length} of {displayKpis.length} KPIs
        </div>
        
        <Button variant="outline" size="sm">
          Export KPI Catalog
        </Button>
      </div>
    </div>
  );
};
