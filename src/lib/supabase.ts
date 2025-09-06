import { createClient } from '@supabase/supabase-js';

// Get environment variables for Create React App
const getEnvVar = (key: string): string | undefined => {
  // For Create React App
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // Fallback for browser
  return undefined;
};

const supabaseUrl = getEnvVar('REACT_APP_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('REACT_APP_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
  // Don't throw error in development, just log warning
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing Supabase environment variables');
  }
}

// Get the site URL for password reset
export const getSiteURL = (): string => {
  const siteUrl = getEnvVar('REACT_APP_SITE_URL');
  
  if (siteUrl) {
    return siteUrl.replace(/\/$/, '');
  }
  
  // Fallback to current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return 'http://localhost:3000'; // Default fallback
};

// Create Supabase client with proper error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // Fallback URL
  supabaseAnonKey || 'placeholder-key', // Fallback key
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

// Export types for better TypeScript support
export type { User, Session, AuthError } from '@supabase/supabase-js'; 