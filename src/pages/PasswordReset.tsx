import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'verifying'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      console.log('PasswordReset Debug:', { token });

      if (!token) {
        setStatus('error');
        setErrorMessage('Link expired');
        return;
      }

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(token);
        
        if (error) {
          setStatus('error');
          setErrorMessage('Link expired');
          return;
        }

        if (data?.session) {
          setStatus('idle');
        } else {
          setStatus('error');
          setErrorMessage('Link expired');
        }
      } catch (error: any) {
        setStatus('error');
        setErrorMessage('Link expired');
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setStatus('error');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">BikeForU</h1>
          <p className="text-xl text-gray-400">Reset your password</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
          {status === 'success' ? (
            <div className="space-y-6">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-semibold">Password Reset Successful!</h2>
              <p className="text-gray-400">Your password has been successfully updated.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  required
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset; 