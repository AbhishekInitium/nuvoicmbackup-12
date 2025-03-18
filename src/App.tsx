
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import AgentPortal from '@/pages/agent/AgentPortal';
import ManagerPortal from '@/pages/manager/ManagerPortal';
import IncentiveDesigner from '@/pages/manager/IncentiveDesigner';
import { PortalProvider } from '@/contexts/PortalContext';

function App() {
  return (
    <Router>
      <PortalProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Agent Routes */}
          <Route path="/agent" element={<AgentPortal />} />
          
          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerPortal />} />
          <Route path="/manager/incentive-designer" element={<IncentiveDesigner />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </PortalProvider>
    </Router>
  );
}

export default App;
