import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DatabaseService } from '../lib/database';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🚀 Starting signup process...');
    console.log('📝 Form data:', { email, password: '***' });

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('👤 Creating user account...');
      // Simple signup with Supabase's built-in auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      console.log('📊 Signup response:', { data, error: signUpError });

      if (signUpError) {
        console.error('❌ Signup error:', signUpError);
        throw signUpError;
      }

      // Check if we got a user back
      if (!data?.user) {
        console.error('❌ No user data returned');
        throw new Error('Failed to create account');
      }

      console.log('✅ User created successfully:', data.user.id);

      console.log('💾 Storing data in session...');
      // Store email for onboarding
      sessionStorage.setItem('pendingVerificationEmail', email);
      sessionStorage.setItem('pendingUserId', data.user.id);
      console.log('✅ Session data stored');

      console.log('🧭 Navigating to verification page...');
      // Navigate to verification pending page
      navigate('/verification-pending');
      console.log('✅ Navigation completed');
    } catch (error: any) {
      console.error('💥 Signup process failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.details
      });
      setError(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join the BikeForU community</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
              <h3 className="text-red-200 font-semibold mb-2">Signup Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
              <details className="mt-2">
                <summary className="text-red-400 text-xs cursor-pointer">Show Debug Info</summary>
                <div className="mt-2 p-2 bg-red-800 rounded text-xs text-red-200">
                  <p>Check browser console (F12) for detailed error logs</p>
                  <p>Form data: {JSON.stringify({ email, hasPassword: !!password })}</p>
                </div>
              </details>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 