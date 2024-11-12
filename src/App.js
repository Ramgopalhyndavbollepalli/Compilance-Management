// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ComplianceManagement from './pages/ComplianceManagement';
import AuditLogs from './components/AuditLogs';
import Notifications from './components/Notifications';
import ComplianceReporting from './components/ComplianceReporting';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<SidebarLayout />}>
          <Route element={<ProtectedRoute requiredRoles={['admin', 'editor', 'viewer']} />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={['admin', 'editor', 'viewer']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={['admin', 'editor']} />}>
              <Route path="/compliance-management" element={<ComplianceManagement />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={['admin', 'editor', 'viewer']} />}>
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/compliance-reporting" element={<ComplianceReporting />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
