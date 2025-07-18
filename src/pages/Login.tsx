import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we should show the success message
    const shouldShowSuccess = sessionStorage.getItem('showVerificationSuccess');
    if (shouldShowSuccess) {
      setShowSuccess(true);
      // Remove the flag after showing the message
      sessionStorage.removeItem('showVerificationSuccess');
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-center animate-fade-in">
            Your email has been verified! You can now log in to your account.
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back, Adventurer!</h1>
          <p className="text-green-200">Ready to CRUSH your next workout?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-green-900/50 border border-green-700 focus:outline-none focus:border-green-400 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-green-900/50 border border-green-700 focus:outline-none focus:border-green-400 text-white"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 transform hover:scale-105"
          >
            {loading ? 'Signing in...' : 'Let\'s GO!'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <Link to="/forgot-password" className="text-green-400 hover:text-green-300 block">
            Forgot your password?
          </Link>
          <p className="text-green-200">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-400 hover:text-green-300">
              Join the adventure!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 