import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const COOLDOWN_MINUTES = 5;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const lastResetKey = `last_reset_${email}`;
    const lastReset = localStorage.getItem(lastResetKey);
    const now = Date.now();
    if (lastReset && now - parseInt(lastReset, 10) < COOLDOWN_MINUTES * 60 * 1000) {
      setError(`You can only request a password reset every ${COOLDOWN_MINUTES} minutes. Please try again later.`);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      localStorage.setItem(lastResetKey, now.toString());
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
          <p className="text-amber-200">Enter your email to receive a password reset link</p>
        </div>

        {success ? (
          <div className="bg-amber-900/80 rounded-lg p-6 text-center">
            <div className="text-amber-400 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
            <p className="text-amber-200 mb-6">
              If an account exists with {email}, you will receive a password reset link.
              <br />
              <span className="text-sm mt-2 block">
                The link will expire in 24 hours.
              </span>
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-amber-800/50 border border-amber-600 rounded-lg focus:outline-none focus:border-amber-400 text-white"
                required
                placeholder="Enter your email address"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <Link to="/" className="text-amber-400 hover:text-amber-300">
                Back to Home
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 