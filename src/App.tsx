import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmailVerification from './pages/EmailVerification';
import EmailVerificationPending from './pages/EmailVerificationPending';
import PasswordReset from './pages/PasswordReset';
import ForgotPassword from './pages/ForgotPassword';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification-pending" element={<EmailVerificationPending />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/verify" 
            element={
              <ProtectedRoute>
                <EmailVerification />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PasswordReset />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Protected Route component to check for valid tokens
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const token = searchParams.get('token');
  const isResetPasswordRoute = window.location.pathname === '/reset-password';

  console.log('ProtectedRoute Debug:', {
    pathname: window.location.pathname,
    token,
    isResetPasswordRoute,
    user: user ? 'exists' : 'null'
  });

  // For reset password route, we only need to check for token
  if (isResetPasswordRoute && !token) {
    console.log('Redirecting to home: No token found');
    return <Navigate to="/" replace />;
  }

  // For other protected routes, check authentication
  if (!isResetPasswordRoute && !user) {
    console.log('Redirecting to login: No user found');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default App; 