import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const EmailVerificationPending: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
    if (!storedEmail) {
      navigate('/signup');
      return;
    }
    setEmail(storedEmail);
    setLoading(false);

    const checkInterval = setInterval(async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          return;
        }

        if (user?.email_confirmed_at) {
          clearInterval(checkInterval);
          sessionStorage.setItem('showVerificationSuccess', 'true');
          navigate('/login');
        }
      } catch (err) {
      }
    }, 2000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [navigate]);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      alert('Verification email resent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem('showVerificationSuccess');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-green-200">Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-600/20 border-2 border-green-400/30 backdrop-blur-sm mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Check Your Email!</h1>
          <p className="text-green-200 mb-6">
            We've sent a verification email to <span className="text-white font-semibold">{email}</span>
          </p>
          <p className="text-green-200 mb-8">
            Please check your inbox and click the verification link to continue your adventure.
            <br />
            <span className="text-sm">This page will automatically redirect you once verified.</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <button
            onClick={handleBackToLogin}
            className="w-full btn-secondary"
          >
            Back to Login
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-green-800/30 border border-green-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Can't find the email?</h3>
          <ul className="text-sm text-green-200 space-y-1 text-left">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• Try adding no-reply@bikeforu.com to your contacts</li>
            <li>• Wait a few minutes - emails can take time to arrive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPending; 