import { supabase } from './supabase';

export const DatabaseService = {
  async listTables() {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  },

  async getTableStructure(tableName: string) {
    try {
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

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
      
      const friends = data?.map(request => {
        if (request.sender_id === userId) {
          return request.receiver;
        } else {
          return request.sender;
        }
      }) || [];
      
      return friends;
    } catch (error) {
      return null;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

  async sendFriendRequest(senderId: string, receiverId: string) {
    try {
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
      throw error;
    }
  },

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
      throw error;
    }
  },

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
      throw error;
    }
  },

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
      throw error;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

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
      throw error;
    }
  },

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
      return null;
    }
  },

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
      return null;
    }
  },

  async getSampleData(tableName: string, limit: number = 5) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  }
}; 