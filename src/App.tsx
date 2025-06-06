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

const App: React.FC = () => {
  return (
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
            <ProtectedRoute>
              <PasswordReset />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

// Protected Route component to check for valid tokens
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  // For password reset, we need the token
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default App; 