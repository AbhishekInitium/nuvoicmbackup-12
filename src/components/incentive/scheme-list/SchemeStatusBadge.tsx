
import React from 'react';

interface SchemeStatusBadgeProps {
  status: string | undefined;
}

const SchemeStatusBadge: React.FC<SchemeStatusBadgeProps> = ({ status }) => {
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
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(status)}`}>
      {status || 'DRAFT'}
    </span>
  );
};

export default SchemeStatusBadge;
