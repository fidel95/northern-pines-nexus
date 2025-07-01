
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

    // Set up auth state listener
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
          
          // Check admin status with retry logic
          let retryCount = 0;
          const maxRetries = 3;
          
          const checkAdminWithRetry = async () => {
            try {
              const adminStatus = await checkAdminStatus(session.user.id);
              if (mounted) {
                setIsAdmin(adminStatus);
                console.log('Admin status:', adminStatus);
              }
            } catch (error) {
              console.error(`Admin check attempt ${retryCount + 1} failed:`, error);
              if (retryCount < maxRetries - 1) {
                retryCount++;
                setTimeout(checkAdminWithRetry, 1000 * retryCount); // Progressive delay
              } else {
                console.error('All admin check attempts failed');
                if (mounted) {
                  setIsAdmin(false);
                }
              }
            }
          };
          
          // Small delay to avoid race conditions
          setTimeout(checkAdminWithRetry, 100);
        } else {
          setIsAdmin(false);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            cleanupAutoLogout = setupAutoLogout();
            const adminStatus = await checkAdminStatus(session.user.id);
            if (mounted) {
              setIsAdmin(adminStatus);
            }
          }
          
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear local state immediately
    setUser(null);
    setSession(null);
    setIsAdmin(false);
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
