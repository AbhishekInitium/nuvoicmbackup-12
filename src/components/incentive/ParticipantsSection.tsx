
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ParticipantsSectionProps {
  participants: string[];
  updatePlan: (section: string, value: string[]) => void;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ participants, updatePlan }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-app-gray-700 mb-3">Assigned Participants</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {participants.map((participant, index) => (
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
        ))}
      </div>
      
      <div className="flex items-center">
        <Input 
          type="text" 
          placeholder="Add new participant..." 
          id="new-participant"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              const participant = input.value.trim();
              if (participant) {
                updatePlan('participants', [...participants, participant]);
                input.value = '';
              }
            }
          }}
        />
        <button 
          className="ml-3 flex items-center justify-center h-12 w-12 rounded-full bg-app-blue text-white shadow-sm hover:bg-app-blue-dark transition-colors duration-200"
          onClick={() => {
            const input = document.getElementById('new-participant') as HTMLInputElement;
            const participant = input.value.trim();
            if (participant) {
              updatePlan('participants', [...participants, participant]);
              input.value = '';
            }
          }}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default ParticipantsSection;
