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
    let done = false;
    const finish = (ok: boolean, msg = '') => {
      if (done) return;
      done = true;
      setHasSession(ok);
      if (msg) setErrorMessage(msg);
      setSessionChecked(true);
    };

    // Supabase (detectSessionInUrl + PKCE) auto-exchanges the `code` in the
    // URL for a session in the background. Listen for that completing so we
    // don't race it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
          finish(true);
        }
      }
    );

    async function checkOrSetSession() {
      // 1. Already have a session? (e.g. after a reload, or auto-exchange done)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        finish(true);
        return;
      }

      // 2. PKCE flow: exchange the recovery `code` for a session.
      const code = searchParams.get('code');
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            finish(true);
            return;
          }
          // The code may have already been consumed by detectSessionInUrl —
          // re-check before giving up.
          const { data: { session: retry } } = await supabase.auth.getSession();
          finish(!!retry, retry ? '' : error.message);
        } catch (err: any) {
          const { data: { session: retry } } = await supabase.auth.getSession();
          finish(!!retry, retry ? '' : (err?.message || 'An unexpected error occurred.'));
        }
        return;
      }

      // 3. Legacy OTP token flow (needs the account email).
      const token = searchParams.get('token');
      if (token) {
        let emailFromUrl = searchParams.get('email') || email;
        const type = (searchParams.get('type') as 'recovery') || 'recovery';
        if (!emailFromUrl) {
          setEmailPrompt(true);
          setSessionChecked(true);
          return;
        }
        try {
          const { error } = await supabase.auth.verifyOtp({ email: emailFromUrl, token, type });
          finish(!error, error ? error.message : '');
        } catch (err) {
          finish(false, 'An unexpected error occurred.');
        }
        return;
      }

      // 4. No code/token: give the auth listener a brief window, then fail.
      setTimeout(() => finish(false, 'Your reset link is invalid or has expired.'), 4000);
    }

    checkOrSetSession();

    return () => subscription.unsubscribe();
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
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center bg-amber-900/80 border border-amber-700/40 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-4 text-amber-50">Enter Your Email</h2>
          <p className="text-amber-200 mb-6">For security, please enter the email address associated with your account to continue resetting your password.</p>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-amber-950/50 border border-amber-600/60 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 text-white placeholder-amber-300/50 transition-colors"
              required
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
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
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-amber-200">Checking reset link...</p>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center bg-amber-900/80 border border-amber-700/40 rounded-2xl shadow-2xl p-8">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-2xl font-semibold mb-4">Invalid or Expired Link</h2>
          <p className="text-amber-200 mb-6">{errorMessage || 'Your reset link is invalid or has expired. Please request a new password reset.'}</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-amber-900/80 border border-amber-700/40 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-amber-50">Reset Password</h1>
          <p className="text-amber-200">Enter your new password</p>
        </div>

        {status === 'success' ? (
          <div className="bg-amber-950/40 border border-amber-700/30 rounded-lg p-6 text-center">
            <div className="text-amber-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-4">Password Reset Successful!</h2>
            <p className="text-amber-200 mb-6">
              Your password has been successfully updated.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-amber-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-amber-200 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-amber-950/50 border border-amber-600/60 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 text-white placeholder-amber-300/50 transition-colors"
                required
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-200 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-amber-950/50 border border-amber-600/60 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 text-white placeholder-amber-300/50 transition-colors"
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
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md disabled:opacity-50"
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