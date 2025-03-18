
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define portal types
type PortalType = 'agent' | 'manager' | 'operations' | 'integration' | 'all';

// Context type
type PortalContextType = {
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
};

// Create the context
const PortalContext = createContext<PortalContextType | undefined>(undefined);

// Provider component
export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [activePortal, setActivePortal] = useState<PortalType>('all');
  const location = useLocation();

  // Update active portal based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/agent')) {
      setActivePortal('agent');
    } else if (path.startsWith('/manager')) {
      setActivePortal('manager');
    } else if (path.startsWith('/operations')) {
      setActivePortal('operations');
    } else if (path.startsWith('/integration')) {
      setActivePortal('integration');
    } else {
      setActivePortal('all');
    }
  }, [location.pathname]);

  return (
    <PortalContext.Provider value={{ activePortal, setActivePortal }}>
      {children}
    </PortalContext.Provider>
  );
};

// Custom hook to use the portal context
export const usePortalContext = () => {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortalContext must be used within a PortalProvider');
  }
  return context;
};
