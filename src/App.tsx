import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmailVerification from './pages/EmailVerification';
import EmailVerificationPending from './pages/EmailVerificationPending';
import PasswordReset from './pages/PasswordReset';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import DatabaseDebug from './components/DatabaseDebug';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verification-pending" element={<EmailVerificationPending />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/debug" element={<DatabaseDebug />} />
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
    </ThemeProvider>
  );
};

export default App; 