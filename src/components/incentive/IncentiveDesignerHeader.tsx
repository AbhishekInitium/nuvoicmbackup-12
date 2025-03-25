
import React from 'react';

const IncentiveDesignerHeader: React.FC = () => {
  return (
    <header className="mb-12 text-center">
      <div className="inline-block mb-2 chip-label">Design</div>
      <h1 className="text-3xl sm:text-4xl font-semibold text-app-gray-900 tracking-tight mb-3">
        Incentive Plan Designer
      </h1>
      <p className="text-app-gray-500 max-w-2xl mx-auto">
        Create and customize your sales incentive structure with backend integration
      </p>
    </header>
  );
};

export default IncentiveDesignerHeader;
