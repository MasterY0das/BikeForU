import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const EmailVerificationPending: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the stored email
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
    if (!storedEmail) {
      navigate('/signup');
      return;
    }
    setEmail(storedEmail);
    setLoading(false);

    // Set up interval to check verification status
    const checkInterval = setInterval(async () => {
      try {
        // Check auth state directly
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        console.log('Current session state:', session);

        // Check if the user is verified
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('User check error:', userError);
          return;
        }

        console.log('Current user state:', user);

        // If user is verified, redirect
        if (user?.email_confirmed_at) {
          console.log('User verified, redirecting to login...');
          clearInterval(checkInterval);
          sessionStorage.setItem('showVerificationSuccess', 'true');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error checking verification status:', err);
      }
    }, 2000); // Check every 2 seconds

    // Cleanup interval on component unmount
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
    // Clear the verification success flag before navigating
    sessionStorage.removeItem('showVerificationSuccess');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-gray-400 mb-6">
          We've sent a verification email to <span className="text-white font-semibold">{email}</span>
        </p>
        <p className="text-gray-400 mb-8">
          Please check your inbox and click the verification link to continue.
          <br />
          <span className="text-sm">This page will automatically redirect you once verified.</span>
        </p>
        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <button
            onClick={handleBackToLogin}
            className="w-full bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Back to Login
          </button>
        </div>
        <p className="text-gray-400 mt-6 text-sm">
          Didn't receive the email? Check your spam folder or try a different email address.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPending; 