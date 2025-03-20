
import React, { useState } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useSalesOrganizations } from '@/hooks/useSalesOrganizations';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface ParticipantsSectionProps {
  participants: string[];
  updatePlan: (section: string, value: string[]) => void;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ participants, updatePlan }) => {
  const { salesOrgs, isLoading, error, isUsingFallback } = useSalesOrganizations();
  const [selectedOrg, setSelectedOrg] = useState<string>('');

  const handleAddParticipant = () => {
    if (selectedOrg && !participants.includes(selectedOrg)) {
      updatePlan('participants', [...participants, selectedOrg]);
      setSelectedOrg('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-app-gray-700 mb-3">Assigned Participants</label>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error connecting to backend system. Using fallback sales organizations.
        </div>
      )}
      
      {isUsingFallback && !error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle size={18} className="mr-2" />
          Using demo sales organization data. Cannot connect to backend system at this time.
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {participants.length === 0 ? (
          <div className="text-app-gray-500 italic">No sales organizations assigned</div>
        ) : (
          participants.map((participant, index) => (
            <div 
              key={index} 
              className="chip chip-blue group hover:pr-2 transition-all duration-200"
            >
              {participant}
              <button 
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  const newParticipants = [...participants];
                  newParticipants.splice(index, 1);
                  updatePlan('participants', newParticipants);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="flex items-center">
        {isLoading ? (
          <div className="w-full h-10 bg-gray-100 animate-pulse rounded"></div>
        ) : (
          <Select
            value={selectedOrg}
            onValueChange={setSelectedOrg}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a sales organization" />
            </SelectTrigger>
            <SelectContent>
              {salesOrgs.map((org) => (
                <SelectItem key={org.SalesOrganization} value={org.SalesOrganization}>
                  {org.SalesOrganizationName} ({org.SalesOrganization})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <button 
          className={`ml-3 flex items-center justify-center h-12 w-12 rounded-full 
            ${(!selectedOrg || isLoading) 
              ? 'bg-app-gray-300 cursor-not-allowed' 
              : 'bg-app-blue hover:bg-app-blue-dark'} 
            text-white shadow-sm transition-colors duration-200`}
          onClick={handleAddParticipant}
          disabled={!selectedOrg || isLoading}
        >
          <Plus size={20} />
        </button>
      </div>
      
      {isLoading && (
        <div className="mt-2 text-sm text-app-gray-500">
          Loading sales organizations...
        </div>
      )}
    </div>
  );
};

export default ParticipantsSection;
