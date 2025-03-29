
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'react-day-picker/dist/style.css';
import { PortalProvider } from './contexts/PortalContext';

// Pages
import Index from './pages/Index';
import AgentPortal from './pages/agent/AgentPortal';
import SapApiTester from './pages/SapApiTester';
import NotFound from './pages/NotFound';
import ManagerPortal from './pages/manager/ManagerPortal';
import IntegrationPortal from './pages/integration/IntegrationPortal';
import IncentiveDesigner from './pages/manager/IncentiveDesigner';
import TeamManagementPage from './pages/manager/TeamManagementPage';
import CommissionExecutionEngine from './pages/manager/CommissionExecutionEngine';

import { Toaster } from './components/ui/sonner';
import { Toaster as LegacyToaster } from './components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <PortalProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agent" element={<AgentPortal />} />
          <Route path="/manager" element={<ManagerPortal />} />
          <Route path="/manager/incentive-designer" element={<IncentiveDesigner />} />
          <Route path="/manager/team-management" element={<TeamManagementPage />} />
          <Route path="/manager/commission-execution" element={<CommissionExecutionEngine />} />
          <Route path="/integration" element={<IntegrationPortal />} />
          <Route path="/sap-api-tester" element={<SapApiTester />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
        <LegacyToaster />
      </PortalProvider>
    </BrowserRouter>
  );
}

export default App;
