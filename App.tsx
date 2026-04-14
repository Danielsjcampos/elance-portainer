
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalSEO from './components/GlobalSEO';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RequirePermission from './components/RequirePermission';

// Pages
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import News from './pages/admin/News';
import Clients from './pages/admin/Clients';
import Leads from './pages/admin/Leads';
import Marketing from './pages/admin/Marketing';
import Contact from './components/Contact';
import Consultoria from './components/Consultoria';
import Escola from './components/Escola';
import EscolaLeiloeiros from './components/EscolaLeiloeiros';
import CourseImoveis from './components/CourseImoveis';
import Downloads from './components/Downloads';
import CursoAdvogados from './components/CursoAdvogados';
import Mentoria from './Mentoria';
import Ecossistema from './Ecossistema';
import Indique from './pages/Indique';
import BidInvest from './components/BidInvest';
import Settings from './pages/admin/Settings';
import EmailFlowCenter from './pages/admin/EmailFlowCenter';
import MinimalLayout from './layouts/MinimalLayout';
import LpElance from './pages/LpElance';
import LpCorretores from './pages/LpCorretores';
import LpAdvogados from './pages/LpAdvogados';
import Detran from './pages/Detran';
import DetranAppc from './pages/DetranAppc';
import DetranCap from './pages/DetranCap';
import DetranOlr from './pages/DetranOlr';

function App() {
  return (
    <HelmetProvider>
      <ModalProvider>
        <AuthProvider>
          <ThemeProvider>
            <GlobalSEO />
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="consultoria" element={<Consultoria />} />
                  <Route path="escola" element={<Escola />} />
                  <Route path="escola-leiloeiros" element={<EscolaLeiloeiros />} />
                  <Route path="curso-imoveis" element={<CourseImoveis />} />
                  <Route path="downloads" element={<Downloads />} />
                  <Route path="curso-advogados" element={<CursoAdvogados />} />
                  <Route path="mentoria" element={<Mentoria />} />
                  <Route path="ecossistema" element={<Ecossistema />} />
                  <Route path="indique" element={<Indique />} />
                  <Route path="bid-invest" element={<BidInvest />} />
                  <Route path="detran" element={<Detran />} />
                  <Route path="detranappc" element={<DetranAppc />} />
                  <Route path="detrancap" element={<DetranCap />} />
                  <Route path="detranolr" element={<DetranOlr />} />
                </Route>

                <Route element={<MinimalLayout />}>
                  <Route path="/lp-e-lance" element={<LpElance />} />
                  <Route path="/lp-corretores" element={<LpCorretores />} />
                  <Route path="/lp-advogados" element={<LpAdvogados />} />
                </Route>

                {/* Admin Login */}
                <Route path="/admin/login" element={<Login />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="news" element={<RequirePermission permissionKey="dashboard"><News /></RequirePermission>} />
                    <Route path="marketing" element={<RequirePermission permissionKey="marketing"><Marketing /></RequirePermission>} />
                    <Route path="leads" element={<RequirePermission permissionKey="leads"><Leads /></RequirePermission>} />
                    <Route path="clients" element={<RequirePermission permissionKey="leads"><Clients /></RequirePermission>} />
                    <Route path="email-marketing" element={<RequirePermission permissionKey="marketing"><EmailFlowCenter /></RequirePermission>} />
                    <Route path="settings" element={<RequirePermission permissionKey="settings"><Settings /></RequirePermission>} />
                  </Route>
                </Route>

                {/* Global Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </ModalProvider>
    </HelmetProvider>
  );
}

export default App;