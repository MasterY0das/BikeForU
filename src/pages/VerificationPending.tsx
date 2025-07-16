import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationPending: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the stored data
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
    const storedName = sessionStorage.getItem('pendingVerificationName');
    const storedCode = sessionStorage.getItem('pendingVerificationCode');
    
    if (!storedEmail || !storedName || !storedCode) {
      navigate('/signup');
      return;
    }
    
    setEmail(storedEmail);
    setName(storedName);
    setVerificationCode(storedCode);
    setLoading(false);
  }, [navigate]);

  const handleContinueToOnboarding = () => {
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-green-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
          <p className="text-gray-400">We've sent a verification email to {email}</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Verification Code</h2>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Use this code to complete your onboarding:</p>
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-green-400 tracking-wider">
                {verificationCode}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            This code will be required when you complete your profile setup.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleContinueToOnboarding}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Continue to Onboarding
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300"
              >
                try again
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Welcome to BikeForU, {name}! 🚴‍♂️
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending; 