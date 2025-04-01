
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Cog, FileJson } from 'lucide-react';
import KpiMappingForm from './scheme-admin/KpiMappingForm';

interface SchemeAdministratorProps {
  revenueBase: string;
  schemeId: string;
  name: string;
}

const SchemeAdministrator: React.FC<SchemeAdministratorProps> = ({ 
  revenueBase, 
  schemeId,
  name
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-md p-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium mb-2">Scheme Administrator</h3>
          <p className="text-sm text-gray-600">
            Define technical KPI mappings for this incentive scheme
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Cog size={16} className="mr-2" />
              Configure KPI Mappings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileJson size={18} className="mr-2" />
                Scheme Administrative Configuration
              </DialogTitle>
            </DialogHeader>
            
            <KpiMappingForm 
              calculationBase={revenueBase} 
              schemeId={schemeId}
              adminName={`${name}_${new Date().getFullYear()}`}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SchemeAdministrator;
