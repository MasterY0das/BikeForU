import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EmailVerification from './pages/EmailVerification';
import PasswordReset from './pages/PasswordReset';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/reset-password" element={<PasswordReset />} />
      </Routes>
    </Router>
  );
};

export default App; 