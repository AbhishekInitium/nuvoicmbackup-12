
import React from 'react';
import { PlusCircle, Copy, Edit } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SchemeOptionsScreenProps {
  onCreateNewScheme: () => void;
  onOpenExistingSchemes: () => void;
  onEditExistingScheme?: () => void;
}

const SchemeOptionsScreen: React.FC<SchemeOptionsScreenProps> = ({
  onCreateNewScheme,
  onOpenExistingSchemes,
  onEditExistingScheme
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Create or Modify an Incentive Scheme
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <PlusCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Scheme</h3>
              <p className="text-sm text-gray-500 mb-4">
                Start from scratch with a brand new incentive scheme
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={onCreateNewScheme}
              >
                Create New
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                <Copy className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Copy Existing Scheme</h3>
              <p className="text-sm text-gray-500 mb-4">
                Create a new scheme based on an existing one
              </p>
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={onOpenExistingSchemes}
              >
                Select Scheme to Copy
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
                <Edit className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Edit Existing Scheme</h3>
              <p className="text-sm text-gray-500 mb-4">
                Modify an existing incentive scheme and update its version
              </p>
              <Button 
                variant="outline" 
                className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
                onClick={onEditExistingScheme}
              >
                Select Scheme to Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchemeOptionsScreen;
