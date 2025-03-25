
import React from 'react';
import { PlusCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SchemeOptionsScreenProps {
  onCreateNewScheme: () => void;
  onOpenExistingSchemes: () => void;
}

const SchemeOptionsScreen: React.FC<SchemeOptionsScreenProps> = ({
  onCreateNewScheme,
  onOpenExistingSchemes
}) => {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <header className="mb-16 text-center">
        <div className="inline-block mb-2 chip-label">Design</div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-app-gray-900 tracking-tight mb-3">
          Incentive Plan Designer
        </h1>
        <p className="text-app-gray-500 max-w-2xl mx-auto mb-12">
          Create and customize your sales incentive structure with backend integration
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div 
          className="bg-white border border-app-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
          onClick={onCreateNewScheme}
        >
          <div className="h-12 w-12 bg-app-blue-light rounded-full flex items-center justify-center mb-4">
            <PlusCircle size={24} className="text-app-blue" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Create New Scheme</h2>
          <p className="text-app-gray-500 mb-6 flex-grow">
            Start with a blank template and build your incentive scheme from scratch.
          </p>
          <Button className="mt-auto w-full">Create New</Button>
        </div>
        
        <div 
          className="bg-white border border-app-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
          onClick={onOpenExistingSchemes}
        >
          <div className="h-12 w-12 bg-app-green-light rounded-full flex items-center justify-center mb-4">
            <Copy size={24} className="text-app-green" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Copy Existing Scheme</h2>
          <p className="text-app-gray-500 mb-6 flex-grow">
            Use an existing scheme as a template and modify it to create a new one.
          </p>
          <Button variant="outline" className="mt-auto w-full">Select Existing</Button>
        </div>
      </div>
    </div>
  );
};

export default SchemeOptionsScreen;
