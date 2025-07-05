
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
  isCanvasser: boolean;
  isLoading: boolean;
  error: string | null;
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
  const [isCanvasser, setIsCanvasser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserRole = useCallback(async (userId: string): Promise<{ isAdmin: boolean; isCanvasser: boolean }> => {
    try {
      console.log('Checking user role for:', userId);
      
      // Check admin status
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      // Check canvasser status
      const { data: canvasserData, error: canvasserError } = await supabase
        .from('canvassers')
        .select('id, active')
        .eq('email', user?.email)
        .eq('active', true)
        .maybeSingle();
      
      const isAdminRole = !adminError && !!adminData;
      const isCanvasserRole = !canvasserError && !!canvasserData;
      
      console.log('Role check results:', { isAdminRole, isCanvasserRole });
      
      return { isAdmin: isAdminRole, isCanvasser: isCanvasserRole };
    } catch (error) {
      console.error('Error checking user role:', error);
      return { isAdmin: false, isCanvasser: false };
    }
  }, [user?.email]);

  const refreshSession = useCallback(async () => {
    try {
      console.log('Refreshing session...');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        setError('Session expired. Please sign in again.');
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setIsCanvasser(false);
        return;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        
        const { isAdmin: adminRole, isCanvasser: canvasserRole } = await checkUserRole(session.user.id);
        setIsAdmin(adminRole);
        setIsCanvasser(canvasserRole);
        setError(null);
        
        console.log('Session refreshed successfully');
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setError('Failed to refresh session');
    }
  }, [checkUserRole]);

  useEffect(() => {
    let mounted = true;
    let refreshTimer: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setError('Failed to load session');
            setIsLoading(false);
          }
          return;
        }
        
        if (session && mounted) {
          console.log('Initial session found:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          const { isAdmin: adminRole, isCanvasser: canvasserRole } = await checkUserRole(session.user.id);
          setIsAdmin(adminRole);
          setIsCanvasser(canvasserRole);
          setError(null);
          
          // Set up session refresh timer
          const expiresAt = session.expires_at;
          if (expiresAt) {
            const timeUntilExpiry = (expiresAt * 1000) - Date.now();
            const refreshTime = Math.max(timeUntilExpiry - 60000, 30000); // Refresh 1 minute before expiry, minimum 30 seconds
            
            refreshTimer = setTimeout(() => {
              if (mounted) {
                refreshSession();
              }
            }, refreshTime);
          }
        } else {
          console.log('No initial session found');
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { isAdmin: adminRole, isCanvasser: canvasserRole } = await checkUserRole(session.user.id);
            if (mounted) {
              setIsAdmin(adminRole);
              setIsCanvasser(canvasserRole);
              setError(null);
              
              // Set up new refresh timer
              const expiresAt = session.expires_at;
              if (expiresAt) {
                const timeUntilExpiry = (expiresAt * 1000) - Date.now();
                const refreshTime = Math.max(timeUntilExpiry - 60000, 30000);
                
                refreshTimer = setTimeout(() => {
                  if (mounted) {
                    refreshSession();
                  }
                }, refreshTime);
              }
            }
          } catch (error) {
            console.error('Failed to check role after auth change:', error);
            if (mounted) {
              setIsAdmin(false);
              setIsCanvasser(false);
            }
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
            setIsCanvasser(false);
            setError(null);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      subscription.unsubscribe();
    };
  }, [checkUserRole, refreshSession]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = error as AuthError;
      setError(authError.message);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsCanvasser(false);
      setError(null);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if signOut fails
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsCanvasser(false);
      setError('Failed to sign out properly');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signIn,
      signOut,
      refreshSession,
      isAdmin,
      isCanvasser,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
