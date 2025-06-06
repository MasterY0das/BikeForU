import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ezoobqnmukszijcbpavu.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6b29icW5tdWtzemlqY2JwYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzI4NzQsImV4cCI6MjA2MTA0ODg3NH0.YOS6ZNm_j1HHb-qoRCycTDt0gWpG3Dmq4_wCN0i8Z6U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 