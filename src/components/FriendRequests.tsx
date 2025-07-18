import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database';

interface User {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  interests: string[];
}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender?: User;
  receiver?: User;
}

const FriendRequests: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'pending' | 'sent'>('search');

  useEffect(() => {
    if (user) {
      loadFriendRequests();
    }
  }, [user]);

  const loadFriendRequests = async () => {
    if (!user) return;
    
    try {
      const [pending, sent] = await Promise.all([
        DatabaseService.getPendingFriendRequests(user.id),
        DatabaseService.getSentFriendRequests(user.id)
      ]);
      
      setPendingRequests(pending || []);
      setSentRequests(sent || []);
    } catch (error) {
      console.error('Error loading friend requests:', error);
      setError('Failed to load friend requests');
    }
  };

  const handleSearch = async () => {
    if (!user || !searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await DatabaseService.searchUsersByUsername(searchQuery.trim(), user.id);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId: string) => {
    if (!user) return;
    
    try {
      await DatabaseService.sendFriendRequest(user.id, receiverId);
      // Refresh the lists
      await loadFriendRequests();
      // Clear search results
      setSearchResults([]);
      setSearchQuery('');
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      setError(error.message || 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await DatabaseService.acceptFriendRequest(requestId);
      await loadFriendRequests();
    } catch (error: any) {
      console.error('Error accepting friend request:', error);
      setError(error.message || 'Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await DatabaseService.rejectFriendRequest(requestId);
      await loadFriendRequests();
    } catch (error: any) {
      console.error('Error rejecting friend request:', error);
      setError(error.message || 'Failed to reject friend request');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await DatabaseService.cancelFriendRequest(requestId);
      await loadFriendRequests();
    } catch (error: any) {
      console.error('Error canceling friend request:', error);
      setError(error.message || 'Failed to cancel friend request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Friend Requests</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 mb-6 rounded-lg">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'search'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Find Friends
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'pending'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors rounded-md ${
              activeTab === 'sent'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-gray-600">@{user.username}</p>
                        {user.interests && user.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.interests.slice(0, 3).map((interest, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Send Request
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !loading && (
              <p className="text-gray-500 text-center py-8">No users found matching "{searchQuery}"</p>
            )}
          </div>
        )}

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {request.sender?.avatar_url ? (
                      <img 
                        src={request.sender.avatar_url} 
                        alt={request.sender.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {request.sender?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.sender?.name}</h4>
                      <p className="text-gray-600">@{request.sender?.username}</p>
                      <p className="text-sm text-gray-500">Sent {formatDate(request.created_at)}</p>
                      {request.sender?.interests && request.sender.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.sender.interests.slice(0, 3).map((interest, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No pending friend requests</p>
            )}
          </div>
        )}

        {/* Sent Requests Tab */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {request.receiver?.avatar_url ? (
                      <img 
                        src={request.receiver.avatar_url} 
                        alt={request.receiver.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {request.receiver?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.receiver?.name}</h4>
                      <p className="text-gray-600">@{request.receiver?.username}</p>
                      <p className="text-sm text-gray-500">Sent {formatDate(request.created_at)}</p>
                      {request.receiver?.interests && request.receiver.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.receiver.interests.slice(0, 3).map((interest, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelRequest(request.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No sent friend requests</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests; 