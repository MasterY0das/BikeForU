import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const [routes, setRoutes] = useState<Route[]>([]);
  const [receivedRoutes, setReceivedRoutes] = useState<Route[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rides' | 'community' | 'friends'>('rides');
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
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your adventure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation with Profile */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
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
                    <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                    <p className="text-xs text-gray-600">@{profile.username}</p>
                  </div>
                </div>
              )}
              
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Profile & Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Adventure Hub</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 mb-8 rounded-lg">
          <button
            onClick={() => setActiveTab('rides')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'rides'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Your Epic Rides ({routes.length + receivedRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'community'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Your Squad ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'friends'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
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
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Epic Routes</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {routes.map((route) => (
                    <div key={route.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          route.privacy === 'public' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {route.privacy}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium text-gray-900">{formatDistance(route.distance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-900">{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">{formatDate(route.start_time)}</span>
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
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Routes Shared With You</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {receivedRoutes.map((route) => (
                    <div key={route.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          shared
                        </span>
                      </div>
                      
                      {route.sender && (
                        <div className="mb-3 text-sm text-gray-600">
                          Shared by: {route.sender.name}
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium text-gray-900">{formatDistance(route.distance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-900">{formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">{formatDate(route.start_time)}</span>
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No rides yet!</h3>
                <p className="text-gray-600 mb-4">Start your adventure by recording your first ride.</p>
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
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Adventure Squad</h2>
            
            {friends.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
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
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-600">@{friend.username}</p>
                      </div>
                    </div>
                    
                    {friend.interests && friend.interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Interests:</p>
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No friends yet!</h3>
                <p className="text-gray-600 mb-4">Connect with other adventure seekers to build your squad.</p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRoute.name}</h2>
                <button
                  onClick={handleBackToRoutes}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Distance</p>
                  <p className="text-xl font-semibold text-gray-900">{formatDistance(selectedRoute.distance)}</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="text-xl font-semibold text-gray-900">{formatDuration(selectedRoute.duration)}</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Start Time</p>
                  <p className="text-xl font-semibold text-gray-900">{new Date(selectedRoute.start_time).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">End Time</p>
                  <p className="text-xl font-semibold text-gray-900">{new Date(selectedRoute.end_time).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Messages</h3>
                {routeMessages.length > 0 ? (
                  <div className="space-y-3">
                    {routeMessages.map((message) => (
                      <div key={message.id} className="bg-gray-50 p-3 border border-gray-200 rounded-lg">
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
                          <span className="font-medium text-sm text-gray-900">{message.sender?.name || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{message.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No messages yet.</p>
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