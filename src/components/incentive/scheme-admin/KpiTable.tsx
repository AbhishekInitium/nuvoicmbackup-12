
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiField } from '@/types/kpiTypes';

interface KpiTableProps {
  data: KpiField[];
  onEdit: (item: KpiField, index: number) => void;
  onDelete: (index: number) => void;
}

const KpiTable: React.FC<KpiTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">KPI</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Source Type</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Source Field</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Data Type</th>
            <th className="border border-gray-200 px-4 py-2 text-left w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">{item.kpi}</td>
              <td className="border border-gray-200 px-4 py-2">{item.description}</td>
              <td className="border border-gray-200 px-4 py-2">{item.sourceType}</td>
              <td className="border border-gray-200 px-4 py-2">{item.sourceField}</td>
              <td className="border border-gray-200 px-4 py-2">{item.dataType}</td>
              <td className="border border-gray-200 px-4 py-2 space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => onEdit(item, index)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-red-500 hover:text-red-600" 
                  onClick={() => onDelete(index)}
                >
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KpiTable;
