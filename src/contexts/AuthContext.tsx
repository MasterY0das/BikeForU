import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import CookieManager from '../lib/cookies';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  login: async () => ({ error: 'Not implemented' }),
  signup: async () => ({ error: 'Not implemented' }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check cookies first for faster initial load
    const cookieState = CookieManager.getLoginState();
    setIsLoggedIn(cookieState.isLoggedIn);

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        CookieManager.setLoginState(true, session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        CookieManager.clearLoginState();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        CookieManager.setLoginState(true, session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        CookieManager.clearLoginState();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
        CookieManager.setLoginState(true, data.user.id);
        return {};
      }

      return { error: 'Login failed' };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
        CookieManager.setLoginState(true, data.user.id);
        return {};
      }

      return { error: 'Signup failed' };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsLoggedIn(false);
      CookieManager.clearLoginState();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isLoggedIn, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 