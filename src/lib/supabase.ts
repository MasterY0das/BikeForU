import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ezoobqnmukszijcbpavu.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6b29icW5tdWtzemlqY2JwYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NzQ5NzAsImV4cCI6MjA1NTU1MDk3MH0.5QzqQxLJD2XZFJD3mzD3mzD3mzD3mzD3mzD3mzD3mzD';

// Get the site URL for password reset
const getSiteURL = () => {
  let url = process.env.REACT_APP_SITE_URL || window.location.origin;
  // Remove trailing slash if present
  return url.replace(/\/$/, '');
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
}); 