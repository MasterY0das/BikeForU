import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { DatabaseService } from '../lib/database';
import FriendRequests from '../components/FriendRequests';

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
  const { theme } = useTheme();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [receivedRoutes, setReceivedRoutes] = useState<Route[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rides' | 'community' | 'friends'>('rides');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routeMessages, setRouteMessages] = useState<Message[]>([]);
  const [showRouteDetail, setShowRouteDetail] = useState(false);
  const navigate = useNavigate();

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
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-green-200' : 'text-gray-600'}>Loading your adventure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation with Profile */}
      <nav className={`${theme === 'dark' ? 'bg-gray-900/90 border-b border-green-800' : 'bg-white border-b border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="Reload Dashboard"
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'}`}> <span className="text-white font-bold text-sm">B</span> </div>
                <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>BikeForU</span>
              </button>
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
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {profile.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{profile.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-gray-600'}`}>@{profile.username}</p>
                  </div>
                </div>
              )}
              <Link 
                to="/profile" 
                className={theme === 'dark' ? 'text-green-200 hover:text-white transition-colors' : 'text-gray-600 hover:text-gray-900 transition-colors'}
              >
                Profile & Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Adventure Hub</h1>
        {/* Tab Navigation */}
        <div className={`flex space-x-1 p-1 mb-8 rounded-lg ${theme === 'dark' ? 'bg-green-800/40' : 'bg-gray-100'}`}>
          <button
            onClick={() => setActiveTab('rides')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'rides'
                ? 'bg-green-700 text-white shadow-sm'
                : 'text-green-200 hover:text-white'
            }`}
          >
            Your Epic Rides ({routes.length + receivedRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'community'
                ? 'bg-green-700 text-white shadow-sm'
                : 'text-green-200 hover:text-white'
            }`}
          >
            Your Squad ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'friends'
                ? 'bg-green-700 text-white shadow-sm'
                : 'text-green-200 hover:text-white'
            }`}
          >
            Friend Requests
          </button>
        </div>
        {/* Rides Tab */}
        {activeTab === 'rides' && (
          <div className="space-y-8">
            {/* User's Own Routes */}
            {routes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Your Epic Routes</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {routes.map((route) => (
                    <div key={route.id} className="bg-gray-900/80 p-6 border border-green-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{route.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          route.privacy === 'public' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-700 text-green-200'
                        }`}>
                          {route.privacy}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Distance:</span>
                          <span className="font-medium text-white">{formatDistance(route.distance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Duration:</span>
                          <span className="font-medium text-white">{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Date:</span>
                          <span className="font-medium text-white">{formatDate(route.start_time)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRouteClick(route)}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 font-medium transition-colors rounded-lg"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Received Routes */}
            {receivedRoutes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Routes Shared With You</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {receivedRoutes.map((route) => (
                    <div key={route.id} className="bg-gray-900/80 p-6 border border-green-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{route.name}</h3>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          shared
                        </span>
                      </div>
                      {route.sender && (
                        <div className="mb-3 text-sm text-green-200">
                          Shared by: {route.sender.name}
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Distance:</span>
                          <span className="font-medium text-white">{formatDistance(route.distance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Duration:</span>
                          <span className="font-medium text-white">{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Date:</span>
                          <span className="font-medium text-white">{formatDate(route.start_time)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRouteClick(route)}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 font-medium transition-colors rounded-lg"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Empty State */}
            {routes.length === 0 && receivedRoutes.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2 text-white">No rides yet!</h3>
                <p className="text-green-200 mb-4">Start your adventure by recording your first ride.</p>
                <Link
                  to="/profile"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-colors inline-block transform hover:scale-105 rounded-lg"
                >
                  Start Riding
                </Link>
              </div>
            )}
          </div>
        )}
        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Your Adventure Squad</h2>
            {friends.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-gray-900/80 p-6 border border-green-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-3 mb-4">
                      {friend.avatar_url ? (
                        <img 
                          src={friend.avatar_url} 
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {friend.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white">{friend.name}</h3>
                        <p className="text-sm text-green-200">@{friend.username}</p>
                      </div>
                    </div>
                    {friend.interests && friend.interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-green-200 mb-2">Interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {friend.interests.slice(0, 3).map((interest, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                          {friend.interests.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              +{friend.interests.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 font-medium transition-colors rounded-lg">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2 text-white">No friends yet!</h3>
                <p className="text-green-200 mb-4">Connect with other adventure seekers to build your squad.</p>
                <button
                  onClick={() => setActiveTab('friends')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-colors inline-block transform hover:scale-105 rounded-lg"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        )}
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <FriendRequests />
        )}
      </main>
      {/* Route Detail Modal */}
      {showRouteDetail && selectedRoute && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/90 border border-green-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedRoute.name}</h2>
                <button
                  onClick={handleBackToRoutes}
                  className="text-green-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-800/40 p-4 border border-green-800 rounded-lg">
                  <p className="text-green-200 text-sm">Distance</p>
                  <p className="text-xl font-semibold text-white">{formatDistance(selectedRoute.distance)}</p>
                </div>
                <div className="bg-green-800/40 p-4 border border-green-800 rounded-lg">
                  <p className="text-green-200 text-sm">Duration</p>
                  <p className="text-xl font-semibold text-white">{formatDuration(selectedRoute.duration)}</p>
                </div>
                <div className="bg-green-800/40 p-4 border border-green-800 rounded-lg">
                  <p className="text-green-200 text-sm">Start Time</p>
                  <p className="text-xl font-semibold text-white">{new Date(selectedRoute.start_time).toLocaleString()}</p>
                </div>
                <div className="bg-green-800/40 p-4 border border-green-800 rounded-lg">
                  <p className="text-green-200 text-sm">End Time</p>
                  <p className="text-xl font-semibold text-white">{new Date(selectedRoute.end_time).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Messages</h3>
                {routeMessages.length > 0 ? (
                  <div className="space-y-3">
                    {routeMessages.map((message) => (
                      <div key={message.id} className="bg-gray-800/80 p-3 border border-green-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          {message.sender?.avatar_url ? (
                            <img 
                              src={message.sender.avatar_url} 
                              alt={message.sender.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {message.sender?.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-sm text-white">{message.sender?.name || 'Unknown'}</span>
                          <span className="text-xs text-green-200">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-green-200">{message.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-200">No messages yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 