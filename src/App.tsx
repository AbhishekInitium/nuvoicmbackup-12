
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import AgentPortal from '@/pages/agent/AgentPortal';
import ManagerPortal from '@/pages/manager/ManagerPortal';
import IncentiveDesigner from '@/pages/manager/IncentiveDesigner';
import CommissionExecutionEngine from '@/pages/manager/CommissionExecutionEngine';
import TeamManagementPage from '@/pages/manager/TeamManagementPage';
import SapApiTester from '@/pages/SapApiTester';
import IntegrationPortal from '@/pages/integration/IntegrationPortal';
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
            <Route path="/manager/commission-execution" element={<CommissionExecutionEngine />} />
            <Route path="/manager/team" element={<TeamManagementPage />} />
            
            {/* Integration Routes */}
            <Route path="/integration" element={<IntegrationPortal />} />
            
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
