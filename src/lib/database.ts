import { supabase } from './supabase';

// Database service matching your actual schema
export const DatabaseService = {
  // Debug function to list all tables
  async listTables() {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      console.log('Available tables:', data);
      return data;
    } catch (error) {
      console.error('Error listing tables:', error);
      return null;
    }
  },

  // Debug function to get table structure
  async getTableStructure(tableName: string) {
    try {
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName);
      
      if (error) throw error;
      console.log(`Table structure for ${tableName}:`, data);
      return data;
    } catch (error) {
      console.error(`Error getting structure for ${tableName}:`, error);
      return null;
    }
  },

  // Get user profile (matches your profiles table)
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Search users by username (case-sensitive)
  async searchUsersByUsername(username: string, currentUserId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${username}%`)
        .neq('id', currentUserId)
        .limit(10);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      return null;
    }
  },

  // Get user routes (matches your routes table)
  async getUserRoutes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user routes:', error);
      return null;
    }
  },

  // Get routes sent to the user (where sent column is not "none")
  async getReceivedRoutes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          sender:profiles!sent (
            id,
            name,
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .neq('sent', 'none')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting received routes:', error);
      return null;
    }
  },

  // Get all public routes
  async getPublicRoutes() {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          profiles:user_id (
            name,
            username,
            avatar_url
          )
        `)
        .eq('privacy', 'public')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting public routes:', error);
      return null;
    }
  },

  // Get user's friends (accepted friend requests)
  async getUserFriends(userId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            name,
            username,
            avatar_url,
            interests
          ),
          receiver:profiles!receiver_id (
            id,
            name,
            username,
            avatar_url,
            interests
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      // Transform to show friends (not requests)
      const friends = data?.map(request => {
        if (request.sender_id === userId) {
          return request.receiver;
        } else {
          return request.sender;
        }
      }) || [];
      
      return friends;
    } catch (error) {
      console.error('Error getting user friends:', error);
      return null;
    }
  },

  // Get pending friend requests (sent to the user)
  async getPendingFriendRequests(userId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            name,
            username,
            avatar_url,
            interests
          )
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting pending friend requests:', error);
      return null;
    }
  },

  // Get sent friend requests (sent by the user)
  async getSentFriendRequests(userId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          receiver:profiles!receiver_id (
            id,
            name,
            username,
            avatar_url,
            interests
          )
        `)
        .eq('sender_id', userId)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting sent friend requests:', error);
      return null;
    }
  },

  // Send a friend request
  async sendFriendRequest(senderId: string, receiverId: string) {
    try {
      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
        .single();

      if (existingRequest) {
        throw new Error('Friend request already exists');
      }

      const { data, error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  // Accept a friend request
  async acceptFriendRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  // Reject a friend request
  async rejectFriendRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  },

  // Cancel a sent friend request
  async cancelFriendRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error canceling friend request:', error);
      throw error;
    }
  },

  // Get messages for a specific route
  async getRouteMessages(routeId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sent (
            id,
            name,
            username,
            avatar_url
          )
        `)
        .eq('route_id', routeId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting route messages:', error);
      return null;
    }
  },

  // Send a message about a route
  async sendRouteMessage(routeId: string, senderId: string, receiverId: string, text: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          route_id: routeId,
          sent: senderId,
          text: text,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending route message:', error);
      return null;
    }
  },

  // Get messages sent to a specific user
  async getMessagesForUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sent (
            id,
            name,
            username,
            avatar_url
          ),
          route:routes!route_id (
            id,
            name,
            user_id
          )
        `)
        .eq('sent', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting messages for user:', error);
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: {
    name?: string;
    username?: string;
    avatar_url?: string;
    interests?: string[];
    colour?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Create test profile
  async createTestProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: 'Test User',
          username: 'testuser',
          avatar_url: null,
          interests: ['Cycling', 'Running'],
          colour: 'dark',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating test profile:', error);
      return null;
    }
  },

  // Create test route
  async createTestRoute(userId: string) {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert({
          name: 'Test Route',
          distance: 15.5,
          duration: 3600,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          privacy: 'public',
          user_id: userId,
          sent: 'none',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating test route:', error);
      return null;
    }
  },

  // Get sample data from a table
  async getSampleData(tableName: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(limit);
      
      if (error) throw error;
      console.log(`Sample data from ${tableName}:`, data);
      return data;
    } catch (error) {
      console.error(`Error getting sample data from ${tableName}:`, error);
      return null;
    }
  }
}; 