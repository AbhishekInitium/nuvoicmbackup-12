
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import AgentPortal from '@/pages/agent/AgentPortal';
import ManagerPortal from '@/pages/manager/ManagerPortal';
import IncentiveDesigner from '@/pages/manager/IncentiveDesigner';
import SapApiTester from '@/pages/SapApiTester';
import { PortalProvider } from '@/contexts/PortalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <PortalProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Agent Routes */}
            <Route path="/agent" element={<AgentPortal />} />
            
            {/* Manager Routes */}
            <Route path="/manager" element={<ManagerPortal />} />
            <Route path="/manager/incentive-designer" element={<IncentiveDesigner />} />
            
            {/* Utility Routes */}
            <Route path="/api-tester" element={<SapApiTester />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </PortalProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
