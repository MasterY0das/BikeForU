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

  // Get pending friend requests
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
            avatar_url
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

  // Send friend request
  async sendFriendRequest(senderId: string, receiverId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return null;
    }
  },

  // Accept friend request
  async acceptFriendRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error accepting friend request:', error);
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
      return null;
    }
  },

  // Create test profile (for debugging)
  async createTestProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: 'Test User',
          username: `user_${userId.slice(0, 8)}`,
          interests: ['Cycling', 'Mountain Biking', 'Road Cycling'],
          colour: 'dark',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      console.log('Created test profile:', data);
      return data;
    } catch (error) {
      console.error('Error creating test profile:', error);
      return null;
    }
  },

  // Create test route (for debugging)
  async createTestRoute(userId: string) {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert({
          user_id: userId,
          name: 'Test Route',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          distance: 15.5,
          duration: 3600, // 1 hour in seconds
          coordinates: JSON.stringify([
            { lat: 40.7128, lng: -74.0060 },
            { lat: 40.7589, lng: -73.9851 }
          ]),
          privacy: 'public',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      console.log('Created test route:', data);
      return data;
    } catch (error) {
      console.error('Error creating test route:', error);
      return null;
    }
  },

  // Get sample data from a table (for debugging)
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
  },

  // Generate and store verification code for onboarding
  async generateVerificationCode(email: string) {
    try {
      console.log('🔑 DatabaseService: Generating verification code for email:', email);
      
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log('🔑 Generated code:', code);
      
      const upsertData = {
        email: email,
        code: code,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        used: false,
        created_at: new Date().toISOString()
      };
      
      console.log('📊 Upsert data:', upsertData);
      
      const { data, error } = await supabase
        .from('verification_codes')
        .upsert(upsertData, {
          onConflict: 'email'
        })
        .select()
        .single();
      
      console.log('📊 Database response:', { data, error });
      
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log('✅ Verification code saved successfully');
      return code;
    } catch (error: any) {
      console.error('💥 Error generating verification code:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }
  },

  // Verify onboarding code
  async verifyOnboardingCode(email: string, code: string) {
    try {
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code.toUpperCase())
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error verifying onboarding code:', error);
      return null;
    }
  },

  // Mark verification code as used
  async markCodeAsUsed(codeId: string) {
    try {
      const { error } = await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', codeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking code as used:', error);
      return false;
    }
  },

  // Debug function to check verification_codes table
  async debugVerificationCodesTable() {
    try {
      console.log('🔍 Checking verification_codes table...');
      
      // First, let's see if the table exists
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'verification_codes');
      
      console.log('📊 Tables check:', { tables, error: tablesError });
      
      if (tablesError) {
        console.error('❌ Error checking tables:', tablesError);
        return;
      }
      
      if (!tables || tables.length === 0) {
        console.error('❌ verification_codes table does not exist!');
        return;
      }
      
      // Check table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', 'verification_codes');
      
      console.log('📊 Table structure:', { columns, error: columnsError });
      
      // Try to insert a test record
      const testData = {
        email: 'test@example.com',
        code: 'TEST123',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: false
      };
      
      console.log('🧪 Testing insert with data:', testData);
      
      const { data: insertData, error: insertError } = await supabase
        .from('verification_codes')
        .insert(testData)
        .select();
      
      console.log('📊 Insert test result:', { insertData, error: insertError });
      
      // Clean up test data
      if (!insertError && insertData) {
        const { error: deleteError } = await supabase
          .from('verification_codes')
          .delete()
          .eq('email', 'test@example.com');
        
        console.log('🧹 Cleanup result:', { error: deleteError });
      }
      
    } catch (error) {
      console.error('💥 Error in debugVerificationCodesTable:', error);
    }
  },

  // Debug function to check profiles table
  async debugProfilesTable() {
    try {
      console.log('🔍 Checking profiles table...');
      
      // First, let's see if the table exists
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'profiles');
      
      console.log('📊 Profiles tables check:', { tables, error: tablesError });
      
      if (tablesError) {
        console.error('❌ Error checking profiles tables:', tablesError);
        return;
      }
      
      if (!tables || tables.length === 0) {
        console.error('❌ profiles table does not exist!');
        return;
      }
      
      // Check table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', 'profiles');
      
      console.log('📊 Profiles table structure:', { columns, error: columnsError });
      
    } catch (error) {
      console.error('💥 Error in debugProfilesTable:', error);
    }
  }
}; 