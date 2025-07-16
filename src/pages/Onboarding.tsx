import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DatabaseService } from '../lib/database';

interface OnboardingData {
  name: string;
  username: string;
  interests: string[];
  colour: string;
}

const Onboarding: React.FC = () => {
  const [step, setStep] = useState<'code' | 'profile'>('code');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Profile data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    username: '',
    interests: [],
    colour: 'dark'
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const availableInterests = [
    'Road Cycling', 'Mountain Biking', 'Cycling', 'Running', 'Trekking', 
    'Walking', 'Hiking', 'Trail Running', 'Gravel Cycling', 'BMX'
  ];

  // Generate verification code when user first arrives
  useEffect(() => {
    const generateCode = async () => {
      try {
        const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
        if (!storedEmail) {
          console.log('No stored email found, user may have arrived directly');
          return;
        }

        console.log('🔑 Generating verification code for:', storedEmail);
        const code = await DatabaseService.generateVerificationCode(storedEmail);
        
        if (code) {
          console.log('✅ Verification code generated successfully');
          // Store the code in session for the verification step
          sessionStorage.setItem('pendingVerificationCode', code);
        } else {
          console.error('❌ Failed to generate verification code');
          setError('Failed to generate verification code. Please try again.');
        }
      } catch (error) {
        console.error('💥 Error generating verification code:', error);
        setError('Failed to generate verification code. Please try again.');
      }
    };

    generateCode();
  }, []);

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
      if (!storedEmail) {
        throw new Error('No email found. Please start over.');
      }

      const verificationResult = await DatabaseService.verifyOnboardingCode(
        storedEmail, 
        verificationCode
      );

      if (!verificationResult) {
        throw new Error('Invalid or expired verification code');
      }

      // Mark code as used
      await DatabaseService.markCodeAsUsed(verificationResult.id);

      setSuccess('Code verified successfully!');
      setTimeout(() => {
        setStep('profile');
        setSuccess(null);
      }, 1500);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setOnboardingData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setOnboardingData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const handleProfileCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
      const storedUserId = sessionStorage.getItem('pendingUserId');
      
      if (!storedEmail || !storedUserId) {
        throw new Error('Missing user data. Please start over.');
      }

      if (!onboardingData.username.trim()) {
        throw new Error('Username is required');
      }

      // Create user profile
      const profileData = {
        id: storedUserId,
        name: onboardingData.name.trim(),
        username: onboardingData.username.trim(),
        interests: onboardingData.interests,
        colour: onboardingData.colour,
        avatar_url: imagePreview || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (profileError) throw profileError;

      // Clear session storage
      sessionStorage.removeItem('pendingVerificationEmail');
      sessionStorage.removeItem('pendingVerificationName');
      sessionStorage.removeItem('pendingVerificationCode');
      sessionStorage.removeItem('pendingUserId');

      setSuccess('Profile completed successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Code verification step
  if (step === 'code') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-400">Enter your verification code to continue</p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Your verification code:</p>
              <p className="text-2xl font-mono text-white tracking-wider">
                {sessionStorage.getItem('pendingVerificationCode') || 'Generating...'}
              </p>
            </div>
          </div>

          {success && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
              <p className="text-green-200">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleCodeVerification} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-center text-2xl font-mono tracking-wider"
                placeholder="ABC123"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have the code?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300"
              >
                Start over
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Profile setup step
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">Set up your BikeForU profile</p>
        </div>

        {success && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
            <p className="text-green-200">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleProfileCompletion} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={onboardingData.name}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={onboardingData.username}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Choose a unique username"
              required
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium">?</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label 
                  htmlFor="avatar-upload"
                  className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-center"
                >
                  Choose Image
                </label>
              </div>
            </div>
          </div>

          {/* Theme Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme Preference
            </label>
            <select
              value={onboardingData.colour}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, colour: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Interests (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableInterests.map((interest) => (
                <label key={interest} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={onboardingData.interests.includes(interest)}
                    onChange={(e) => handleInterestChange(interest, e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !onboardingData.username.trim()}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding; 