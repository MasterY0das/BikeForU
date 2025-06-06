import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          throw new Error('Invalid verification link');
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });

        if (error) throw error;
        setVerificationStatus('success');
        setTimeout(() => {
          sessionStorage.setItem('showVerificationSuccess', 'true');
          navigate('/login');
        }, 1500);
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(error.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleVerifyClick = async () => {
    try {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || !type) {
        throw new Error('Invalid verification link');
      }

      setVerificationStatus('loading');

      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });

      if (error) throw error;
      setVerificationStatus('success');
    } catch (error: any) {
      setVerificationStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">BikeForU</h1>
          <p className="text-xl text-gray-400">Email Verification</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
          {verificationStatus === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-xl">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-6">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-semibold">Email Verified!</h2>
              <p className="text-gray-400">Your email has been successfully verified.</p>
              <button
                onClick={() => navigate('/login')}
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Continue to Login
              </button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-6">
              <div className="text-red-500 text-6xl mb-4">✕</div>
              <h2 className="text-3xl font-semibold">Verification Failed</h2>
              <p className="text-gray-400">{errorMessage}</p>
              <button
                onClick={handleVerifyClick}
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 