# Environment Setup Guide

## 1. Create Environment File

Create a `.env` file in your project root with the following format:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Site URL (optional - defaults to window.location.origin)
REACT_APP_SITE_URL=http://localhost:3000
```

## 2. Get Your Supabase API Keys

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon/Public Key**: The `anon` key (starts with `eyJ...`)

## 3. Database Schema

Based on your requirements, you should have these tables in your Supabase database:

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  privacy_level TEXT DEFAULT 'public',
  units TEXT DEFAULT 'metric',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Routes Table
```sql
CREATE TABLE routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  distance DECIMAL,
  duration INTEGER, -- in seconds
  start_location TEXT,
  end_location TEXT,
  route_data JSONB, -- stores coordinates and route details
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Row Level Security (RLS) Policies

### Profiles RLS
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all public profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### User Settings RLS
```sql
-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only access their own settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Routes RLS
```sql
-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Users can view public routes and their own routes
CREATE POLICY "Users can view public routes and own routes" ON routes
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Users can insert their own routes
CREATE POLICY "Users can insert own routes" ON routes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own routes
CREATE POLICY "Users can update own routes" ON routes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own routes
CREATE POLICY "Users can delete own routes" ON routes
  FOR DELETE USING (auth.uid() = user_id);
```

## 5. Testing Your Setup

1. Start your development server: `npm start`
2. Navigate to `http://localhost:3000/debug`
3. Use the debug panel to test your database connection
4. Try the "List All Tables" function first to see your database structure
5. If you're logged in, try the user-specific functions

## 6. Troubleshooting

### Common Issues:

1. **"relation does not exist"** - Tables haven't been created yet
2. **"permission denied"** - RLS policies not set up correctly
3. **"invalid API key"** - Check your environment variables
4. **"network error"** - Check your Supabase URL

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Supabase connection in the debug panel
4. Check Supabase dashboard for table structure

## 7. Next Steps

Once your environment is set up and working:

1. Remove the debug route from production
2. Implement proper error handling
3. Add loading states to your components
4. Set up proper TypeScript types for your database schema
5. Implement the actual features using the database service 