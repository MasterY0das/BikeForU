import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [email, setEmail] = useState('');
  const [emailPrompt, setEmailPrompt] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function checkOrSetSession() {
      // Try to get session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
        setSessionChecked(true);
        return;
      }
      // If no session, try to verify token from URL
      const token = searchParams.get('token') || searchParams.get('code');
      let emailFromUrl = searchParams.get('email') || '';
      const typeFromUrl = searchParams.get('type');
      const type = (typeFromUrl as 'recovery') || 'recovery';
      if (!emailFromUrl && email) {
        emailFromUrl = email;
      }
      if (token) {
        if (!emailFromUrl) {
          setEmailPrompt(true);
          setSessionChecked(true);
          return;
        }
        try {
          const { error } = await supabase.auth.verifyOtp({
            email: emailFromUrl,
            token,
            type,
          });
          if (!error) {
            setHasSession(true);
          } else {
            setErrorMessage(error.message);
            setHasSession(false);
          }
        } catch (err) {
          setErrorMessage('An unexpected error occurred.');
          setHasSession(false);
        }
        setSessionChecked(true);
        return;
      }
      setSessionChecked(true);
    }
    checkOrSetSession();
  }, [searchParams, email]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionChecked(false);
    setEmailPrompt(false);
    // This will trigger useEffect again with the new email
  };

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

  if (emailPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center bg-gray-900/80 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Enter Your Email</h2>
          <p className="text-green-200 mb-6">For security, please enter the email address associated with your account to continue resetting your password.</p>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-green-600 rounded-lg focus:outline-none focus:border-green-400 text-white placeholder-green-200"
              required
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-200">Checking reset link...</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center bg-gray-900/80 rounded-2xl shadow-2xl p-8">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-2xl font-semibold mb-4">Invalid or Expired Link</h2>
          <p className="text-green-200 mb-6">{errorMessage || 'Your reset link is invalid or has expired. Please request a new password reset.'}</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-gray-900/80 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Reset Password</h1>
          <p className="text-green-200">Enter your new password</p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-900/80 rounded-lg p-6 text-center shadow-lg">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-4">Password Reset Successful!</h2>
            <p className="text-green-200 mb-6">
              Your password has been successfully updated.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white text-green-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-green-200 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-green-600 rounded-lg focus:outline-none focus:border-green-400 text-white placeholder-green-200"
                required
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-200 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-green-600 rounded-lg focus:outline-none focus:border-green-400 text-white placeholder-green-200"
                required
                placeholder="Confirm new password"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md disabled:opacity-50"
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
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
  );
};

export default PasswordReset; 