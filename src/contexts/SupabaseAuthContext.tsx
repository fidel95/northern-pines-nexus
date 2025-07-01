
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      return !error && !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Auto-logout after 24 hours of inactivity
  const setupAutoLogout = () => {
    const timeout = 24 * 60 * 60 * 1000; // 24 hours
    const timeoutId = setTimeout(async () => {
      console.log('Auto-logout due to inactivity');
      await signOut();
    }, timeout);

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    let mounted = true;
    let cleanupAutoLogout: (() => void) | null = null;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        // Clear previous auto-logout
        if (cleanupAutoLogout) {
          cleanupAutoLogout();
          cleanupAutoLogout = null;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Set up auto-logout for active sessions
          cleanupAutoLogout = setupAutoLogout();
          
          // Check admin status with better error handling
          try {
            const adminStatus = await checkAdminStatus(session.user.id);
            if (mounted) {
              setIsAdmin(adminStatus);
              console.log('Admin status set:', adminStatus);
            }
          } catch (error) {
            console.error('Failed to check admin status:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (mounted && session?.user) {
          setSession(session);
          setUser(session.user);
          cleanupAutoLogout = setupAutoLogout();
          
          try {
            const adminStatus = await checkAdminStatus(session.user.id);
            if (mounted) {
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.error('Failed to check initial admin status:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      if (cleanupAutoLogout) {
        cleanupAutoLogout();
      }
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if logout fails
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signIn,
      signOut,
      isAdmin,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
