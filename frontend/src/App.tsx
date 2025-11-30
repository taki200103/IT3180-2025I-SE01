import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ResidentDashboard from './components/dashboards/ResidentDashboard';
import PoliceDashboard from './components/dashboards/PoliceDashboard';
import AccountantDashboard from './components/dashboards/AccountantDashboard';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function RoleBasedRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'resident':
      return <Navigate to="/resident" replace />;
    case 'police':
      return <Navigate to="/police" replace />;
    case 'accountant':
      return <Navigate to="/accountant" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['admin', 'resident', 'police', 'accountant']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<RoleBasedRedirect />} />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/resident/*"
            element={
              <ProtectedRoute allowedRoles={['resident']}>
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/police/*"
            element={
              <ProtectedRoute allowedRoles={['police']}>
                <PoliceDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/accountant/*"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AccountantDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
