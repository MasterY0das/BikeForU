import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { DatabaseService } from '../lib/database';
import { Link, useNavigate } from 'react-router-dom';
import DeletionRequest from '../components/DeletionRequest';

interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  interests: string[];
  colour: string;
  created_at: string;
  updated_at: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeletionRequest, setShowDeletionRequest] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    avatar_url: '',
    interests: [] as string[],
    colour: 'light'
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userProfile = await DatabaseService.getUserProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          name: userProfile.name || '',
          username: userProfile.username || '',
          avatar_url: userProfile.avatar_url || '',
          interests: userProfile.interests || [],
          colour: userProfile.colour || 'light'
        });
        
        // Sync theme with profile preference
        if (userProfile.colour && userProfile.colour !== theme) {
          setTheme(userProfile.colour as 'light' | 'dark');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = await DatabaseService.updateUserProfile(user.id, formData);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setEditing(false);
        
        // Update theme if changed
        if (formData.colour !== theme) {
          setTheme(formData.colour as 'light' | 'dark');
        }
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll use a placeholder URL
      // In production, you'd upload to a service like Supabase Storage
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  const availableInterests = [
    'Road Cycling', 'Mountain Biking', 'Cycling', 'Biking', 'Hiking', 
    'Running', 'Walking', 'Fitness', 'Adventure', 'Nature'
  ];

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                BikeForU
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className={`${isDark ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-600'} border rounded-lg p-4 mb-6`}>
            <p>{error}</p>
          </div>
        )}

        {profile && (
          <div className="space-y-8">
            {/* Profile Section */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border shadow-sm`}>
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <span className="text-2xl font-medium text-white">
                        {profile.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Profile Picture</p>
                    {editing && (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          onClick={handleImageSelect}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Select Image
                        </button>
                        {formData.avatar_url && (
                          <p className="text-xs text-green-600">Image selected</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="text-lg">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Username
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="text-lg">@{profile.username}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border shadow-sm`}>
              <h2 className="text-xl font-semibold mb-6">Preferences</h2>
              
              <div className="space-y-6">
                {/* Theme Preference */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Theme
                  </label>
                  {editing ? (
                    <select
                      value={formData.colour}
                      onChange={(e) => setFormData(prev => ({ ...prev, colour: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <p className="text-lg capitalize">{profile.colour}</p>
                      <button
                        onClick={() => {
                          const newTheme = theme === 'light' ? 'dark' : 'light';
                          setTheme(newTheme);
                          setFormData(prev => ({ ...prev, colour: newTheme }));
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                      >
                        Toggle Theme
                      </button>
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Interests
                  </label>
                  {editing ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableInterests.map((interest) => (
                        <label key={interest} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(interest)}
                            onChange={(e) => handleInterestChange(interest, e.target.checked)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{interest}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests && profile.interests.length > 0 ? (
                        profile.interests.map((interest, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No interests selected</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border shadow-sm`}>
              <h2 className="text-xl font-semibold mb-6">Account Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email
                  </label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Member Since
                  </label>
                  <p className="text-lg">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border shadow-sm`}>
              <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Logout</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Sign out of your account
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-red-600">Request Account Deletion</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeletionRequest(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Request Deletion
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile.name || '',
                      username: profile.username || '',
                      avatar_url: profile.avatar_url || '',
                      interests: profile.interests || [],
                      colour: profile.colour || 'light'
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Deletion Request Modal */}
        {showDeletionRequest && (
          <DeletionRequest onClose={() => setShowDeletionRequest(false)} />
        )}
      </main>
    </div>
  );
};

export default Profile; 