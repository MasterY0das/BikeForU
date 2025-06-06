import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const EmailVerificationPending: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
    if (!storedEmail) {
      navigate('/signup');
      return;
    }
    setEmail(storedEmail);

    // Set up real-time subscription for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        // Email is verified, clear storage and redirect to login
        sessionStorage.removeItem('pendingVerificationEmail');
        navigate('/login');
      }
    });

    // Check initial verification status
    const checkVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        sessionStorage.removeItem('pendingVerificationEmail');
        navigate('/login');
      }
      setLoading(false);
    };

    checkVerification();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      alert('Verification email resent!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-gray-400">
            We've sent a verification email to <span className="text-white">{email}</span>
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8">
          <div className="animate-pulse mb-6">
            <div className="text-6xl mb-4">📧</div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Please check your email and click the verification link to continue.
            The page will automatically redirect you once your email is verified.
          </p>

          <button
            onClick={handleResendEmail}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Resend verification email
          </button>
        </div>

        <p className="mt-8 text-gray-400">
          Didn't receive the email? Check your spam folder or try a different email address.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPending; 