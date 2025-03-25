
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AgentProfileProps {
  employeeData: any;
}

const AgentProfile: React.FC<AgentProfileProps> = ({ employeeData }) => {
  // Default profile data (will be replaced with real data when available)
  const profile = employeeData || {
    FirstName: 'Mike',
    LastName: 'Summers',
    BaseSalary: 85000,
    EmployeeID: '114965',
    TTC: 135235
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-app-gray-100 flex-shrink-0">
            <img 
              src="/lovable-uploads/c90c90eb-5444-4a80-b289-a4aecdc43521.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-2 text-center sm:text-left">
            <div>
              <p className="text-sm text-app-gray-600">First Name</p>
              <p className="font-medium">{profile.FirstName}</p>
            </div>
            
            <div>
              <p className="text-sm text-app-gray-600">Last Name</p>
              <p className="font-medium">{profile.LastName}</p>
            </div>
            
            <div>
              <p className="text-sm text-app-gray-600">Base</p>
              <p className="font-medium">${profile.BaseSalary.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-app-gray-600">Badge</p>
              <p className="font-medium">{profile.EmployeeID}</p>
            </div>
            
            <div>
              <p className="text-sm text-app-gray-600">TTC</p>
              <p className="font-medium">${profile.TTC.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentProfile;
