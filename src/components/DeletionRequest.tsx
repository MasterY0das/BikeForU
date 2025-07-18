import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { DatabaseService } from '../lib/database';

interface DeletionRequestProps {
  onClose: () => void;
}

const DeletionRequest: React.FC<DeletionRequestProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'password' | 'confirm'>('password');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify password by attempting to sign in
      const { data, error } = await import('../lib/supabase').then(m => m.supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: password
      }));

      if (error) {
        throw new Error('Incorrect password. Please try again.');
      }

      if (data.user) {
        setStep('confirm');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeletion = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user profile for username
      const profile = await DatabaseService.getUserProfile(user?.id || '');
      
      // Prepare email content
      const emailBody = `
Account Deletion Request

User Information:
- UUID: ${user?.id}
- Username: ${profile?.username || 'Not set'}
- Email: ${user?.email}
- Name: ${profile?.name || 'Not set'}
- Request Date: ${new Date().toISOString()}

This user has requested to delete their account. Please process this request according to your data retention policies.

Note: This request was made through the BikeForU application deletion request feature.
      `;

      // Create Gmail URL with pre-filled content
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nikhil9kalburgi@gmail.com&su=Deletion Request - ${encodeURIComponent(profile?.username || user?.email || 'Unknown User')}&body=${encodeURIComponent(emailBody)}`;

      // Open Gmail in new tab
      window.open(gmailUrl, '_blank');
      
      // Logout user after sending deletion request
      await logout();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Request Account Deletion</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              isDark ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <p>{error}</p>
            </div>
          )}

          {step === 'password' && (
            <div>
              <div className={`mb-6 p-4 rounded-lg ${
                isDark ? 'bg-yellow-900/50 border border-yellow-700 text-yellow-300' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              }`}>
                <p className="text-sm">
                  <strong>Important:</strong> This action will send a deletion request to our support team. 
                  You will be logged out after the request is sent.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Enter your password to continue
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500' 
                        : 'border-gray-300 focus:border-red-500'
                    }`}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <div className={`mb-6 p-4 rounded-lg ${
                isDark ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                <p className="text-sm">
                  <strong>Final Warning:</strong> This action will send a deletion request to our support team. 
                  You will be logged out immediately after the request is sent.
                </p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className="font-semibold mb-2">What happens next:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• A deletion request email will be sent to our support team</li>
                    <li>• You will be logged out of your account</li>
                    <li>• Our team will process your request within 7-10 business days</li>
                    <li>• You will receive a confirmation email once processed</li>
                  </ul>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-green-600 font-semibold text-lg">Contact: nikhil9kalburgi@gmail.com</p>
                  <p className="text-gray-500 text-sm mt-2">Please email us from your registered address for account deletion requests.</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('password')}
                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirmDeletion}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending Request...' : 'Send Deletion Request'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletionRequest; 