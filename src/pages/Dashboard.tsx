import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database';

interface Route {
  id: string;
  name: string;
  distance: number;
  duration: number;
  start_time: string;
  end_time: string;
  privacy: string;
  created_at: string;
  user_id: string;
  sent?: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
}

interface Message {
  id: string;
  route_id: string;
  sent: string;
  text: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  interests: string[];
}

interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  interests: string[];
  colour: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [receivedRoutes, setReceivedRoutes] = useState<Route[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rides' | 'community'>('rides');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routeMessages, setRouteMessages] = useState<Message[]>([]);
  const [showRouteDetail, setShowRouteDetail] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load user profile
      const userProfile = await DatabaseService.getUserProfile(user.id);
      setProfile(userProfile);

      // Load user routes
      const userRoutes = await DatabaseService.getUserRoutes(user.id);
      setRoutes(userRoutes || []);

      // Load received routes (routes sent to the user)
      const receivedRoutes = await DatabaseService.getReceivedRoutes(user.id);
      setReceivedRoutes(receivedRoutes || []);

      // Load user friends
      const userFriends = await DatabaseService.getUserFriends(user.id);
      setFriends(userFriends || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} km`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRouteClick = async (route: Route) => {
    setSelectedRoute(route);
    setShowRouteDetail(true);
    
    // Load messages for this route
    const messages = await DatabaseService.getRouteMessages(route.id);
    setRouteMessages(messages || []);
  };

  const handleBackToRoutes = () => {
    setShowRouteDetail(false);
    setSelectedRoute(null);
    setRouteMessages([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation with Profile */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                BikeForU
              </Link>
            </div>
            
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              {profile && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {profile.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{profile.name}</p>
                    <p className="text-xs text-gray-400">@{profile.username}</p>
                  </div>
                </div>
              )}
              
              <Link 
                to="/profile" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Profile & Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('rides')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rides'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Your Rides ({routes.length + receivedRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'community'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Friends ({friends.length})
          </button>
        </div>

        {/* Rides Tab */}
        {activeTab === 'rides' && (
          <div className="space-y-8">
            {/* User's Own Routes */}
            {routes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Routes</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {routes.map((route) => (
                    <div key={route.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{route.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          route.privacy === 'public' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {route.privacy}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Distance:</span>
                          <span className="font-medium">{formatDistance(route.distance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Duration:</span>
                          <span className="font-medium">{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Date:</span>
                          <span className="font-medium">{formatDate(route.start_time)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Received Routes */}
            {receivedRoutes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Routes Shared with You</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {receivedRoutes.map((route) => (
                    <div key={route.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{route.name}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">
                          Shared
                        </span>
                      </div>
                      
                      {route.sender && (
                        <div className="mb-3 p-2 bg-blue-900/20 rounded border border-blue-800">
                          <p className="text-sm text-blue-300">
                            From: <span className="font-medium">{route.sender.name}</span>
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Distance:</span>
                          <span className="font-medium">{formatDistance(route.distance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Duration:</span>
                          <span className="font-medium">{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Date:</span>
                          <span className="font-medium">{formatDate(route.start_time)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {routes.length === 0 && receivedRoutes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No rides yet</h3>
                <p className="text-gray-500">Your rides from your phone will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No friends yet</h3>
                <p className="text-gray-500">Connect with other bikers to see them here</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center space-x-4 mb-4">
                      {friend.avatar_url ? (
                        <img 
                          src={friend.avatar_url} 
                          alt={friend.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {friend.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{friend.name}</h3>
                        <p className="text-sm text-gray-400">@{friend.username}</p>
                      </div>
                    </div>
                    
                    {friend.interests && friend.interests.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {friend.interests.slice(0, 3).map((interest, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-800 text-xs rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                          {friend.interests.length > 3 && (
                            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">
                              +{friend.interests.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 